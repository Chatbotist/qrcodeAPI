import QRCode from 'qrcode';
import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST запросы' });
  }

  const { 
    text, 
    chat_id, 
    bot_token, 
    caption = '', 
    protect_content = false, 
    parse_mode = 'HTML'
  } = req.body;

  if (!text || !chat_id || !bot_token) {
    return res.status(400).json({ 
      error: 'Обязательные параметры: text, chat_id, bot_token' 
    });
  }

  try {
    // 1. Генерация QR-кода
    const qrBuffer = await QRCode.toBuffer(text, {
      type: 'png',
      width: 300,
      margin: 2
    });

    // 2. Подготовка формы для Telegram API
    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('photo', new Blob([qrBuffer]), 'qrcode.png');
    if (caption) formData.append('caption', caption);
    formData.append('protect_content', protect_content);
    formData.append('parse_mode', parse_mode);

    // 3. Отправка в Telegram
    const tgResponse = await fetch(`https://api.telegram.org/bot${bot_token}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    const result = await tgResponse.json();

    if (!result.ok) {
      throw new Error(result.description || 'Ошибка Telegram API');
    }

    return res.json({
      success: true,
      message: result.result
    });

  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
