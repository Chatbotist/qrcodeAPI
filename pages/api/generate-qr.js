import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Простое хранилище в памяти
const qrCodes = {};

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { text } = req.body;
    
    // Валидация
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Генерация QR
    const qrData = await QRCode.toBuffer(text);
    const id = uuidv4();
    
    // Сохраняем на 2 минуты
    qrCodes[id] = qrData;
    setTimeout(() => delete qrCodes[id], 120000);

    // Формируем URL
    const qrUrl = `https://${req.headers.host}/api/qr/${id}.png`;
    
    return res.json({ qrUrl });
    
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Generation failed' });
  }
}
