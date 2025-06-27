import { writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Генерируем QR-код
    const qrBuffer = await QRCode.toBuffer(text);
    
    // Сохраняем временный файл
    const fileName = `${uuidv4()}.png`;
    const filePath = join('/tmp', fileName);
    writeFileSync(filePath, qrBuffer);

    // Ссылка будет действительна 5 минут
    const qrUrl = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : req.headers.host}/api/temp-qr/${fileName}`;
    
    return res.status(200).json({ 
      qrUrl,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('QR generation error:', error);
    return res.status(500).json({ 
      error: 'QR generation failed',
      details: error.message 
    });
  }
}
