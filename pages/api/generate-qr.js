import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Храним в памяти (на бесплатном тарифе сбросится при неактивности)
const qrStorage = {};

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
    
    // Сохраняем буфер в памяти
    qrStorage[id] = qrBuffer;
    
    // Формируем прямую ссылку
    const qrUrl = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : req.headers.host}/api/qr/${id}.png`;
    
    return res.json({ 
      qrUrl,
      expiresAt: new Date(Date.now() + 120000).toISOString() // 2 минуты
    });
    
  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(500).json({ error: 'Ошибка генерации' });
  }
}
