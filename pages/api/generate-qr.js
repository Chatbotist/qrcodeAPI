import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

const qrStorage = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Текст обязателен' });
  }

  try {
    const id = uuidv4();
    const qrBuffer = await QRCode.toBuffer(text);
    
    // Сохраняем на 5 секунд
    qrStorage.set(id, qrBuffer);
    setTimeout(() => qrStorage.delete(id), 5000);

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : `${req.headers['x-forwarded-proto']}://${req.headers.host}`;

    return res.json({
      qrUrl: `${baseUrl}/api/qr/${id}.png`
    });

  } catch (error) {
    console.error('Ошибка генерации:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
