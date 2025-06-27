import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const qrStorage = new Map();

// Очистка старых QR-кодов
setInterval(() => {
  const now = Date.now();
  for (const [id, { expiresAt }] of qrStorage.entries()) {
    if (now > expiresAt) qrStorage.delete(id);
  }
}, 300000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Необходим текст для QR-кода' });
  }

  try {
    const id = uuidv4();
    const qrData = await QRCode.toBuffer(text);
    const expiresAt = Date.now() + 120000; // 2 минуты

    qrStorage.set(id, { qrData, expiresAt });

    const baseUrl = req.headers['x-forwarded-proto'] + '://' + req.headers['x-forwarded-host'];
    const qrImageUrl = `${baseUrl}/api/qr/${id}.png`;

    return res.status(200).json({
      qrUrl: qrImageUrl,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(500).json({ error: 'Ошибка генерации QR-кода' });
  }
}
