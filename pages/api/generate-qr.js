import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Хранилище в памяти с автоматической очисткой
const qrStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [id, { expiresAt }] of qrStore.entries()) {
    if (now > expiresAt) qrStore.delete(id);
  }
}, 300000); // Каждые 5 минут

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Необходим текстовый параметр' });
    }

    const id = uuidv4();
    const qrData = await QRCode.toBuffer(text);
    const expiresAt = Date.now() + 120000; // 2 минуты

    qrStore.set(id, { qrData, expiresAt });

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`;

    return res.status(200).json({
      qrUrl: `${baseUrl}/api/qr/${id}.png`,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } catch (error) {
    console.error('Ошибка генерации QR:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
