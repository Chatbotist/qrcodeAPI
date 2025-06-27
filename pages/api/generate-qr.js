import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const qrStorage = new Map();

// Автоочистка каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [id, { expiresAt }] of qrStorage.entries()) {
    if (now > expiresAt) qrStorage.delete(id);
  }
}, 300000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const id = uuidv4();
    const qrBuffer = await QRCode.toBuffer(text);
    const expiresAt = Date.now() + 120000; // 2 минуты

    qrStorage.set(id, { qrBuffer, expiresAt });

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const qrUrl = `${protocol}://${host}/api/qr/${id}.png`;

    return res.status(200).json({ 
      qrUrl,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return res.status(500).json({ error: 'QR generation failed' });
  }
}
