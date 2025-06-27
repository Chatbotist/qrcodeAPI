import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Необходим текст для QR-кода' });
  }

  try {
    // Генерируем QR-код и сразу возвращаем как Data URL
    const qrDataUrl = await QRCode.toDataURL(text);
    return res.json({ qrDataUrl });
    
  } catch (error) {
    console.error('Ошибка генерации:', error);
    return res.status(500).json({ error: 'Ошибка генерации QR-кода' });
  }
}
