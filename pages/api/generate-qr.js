import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Хранилище в памяти
const qrStore = new Map();

// Автоочистка каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [id, { expiresAt }] of qrStore.entries()) {
    if (now > expiresAt) qrStore.delete(id);
  }
}, 300000);

export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Проверяем наличие текста
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  try {
    // Генерируем QR-код
    const qrData = await QRCode.toBuffer(text);
    const id = uuidv4();
    const expiresAt = Date.now() + 120000; // 2 минуты

    // Сохраняем в хранилище
    qrStore.set(id, { qrData, expiresAt });

    // Формируем URL
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const qrUrl = `${protocol}://${host}/api/qr/${id}.png`;

    return res.status(200).json({
      qrUrl,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
