import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Хранилище QR-кодов в памяти
const qrStorage = new Map();

// Очистка старых QR-кодов каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [id, { expiresAt }] of qrStorage.entries()) {
    if (now > expiresAt) {
      qrStorage.delete(id);
    }
  }
}, 300000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Необходим текстовый параметр' });
  }

  try {
    const id = uuidv4();
    const qrDataUrl = await QRCode.toDataURL(text);
    const expiresAt = Date.now() + 120000; // 2 минуты

    qrStorage.set(id, { qrDataUrl, expiresAt });

    const baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers['x-forwarded-host'];
    const qrUrl = `${baseUrl}/api/get-qr/${id}`;

    return res.status(200).json({
      qrUrl,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } catch (error) {
    console.error('Ошибка генерации QR:', error);
    return res.status(500).json({ error: 'Ошибка генерации QR-кода' });
  }
}
