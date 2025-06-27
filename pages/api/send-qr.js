import QRCode from 'qrcode';
import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  // Все поддерживаемые параметры
  const {
    // Обязательные
    text,
    chat_id,
    bot_token,
    
    // Опциональные базовые
    caption,
    parse_mode = 'HTML',
    caption_entities,
    show_caption_above_media,
    disable_notification,
    protect_content,
    message_effect_id,
    reply_parameters,
    reply_markup,
    
    // Опциональные расширенные
    message_thread_id,
    has_spoiler,
    allow_sending_without_reply,
    allow_paid_broadcast,
    business_connection_id
  } = req.body;

  // Валидация
  if (!text || !chat_id || !bot_token) {
    return res.status(400).json({ 
      error: 'Required parameters: text, chat_id, bot_token' 
    });
  }

  // Проверка parse_mode
  const allowedParseModes = ['HTML', 'Markdown', 'MarkdownV2'];
  if (parse_mode && !allowedParseModes.includes(parse_mode)) {
    return res.status(400).json({
      error: `Invalid parse_mode. Allowed: ${allowedParseModes.join(', ')}`
    });
  }

  try {
    // 1. Генерация QR-кода
    const qrBuffer = await QRCode.toBuffer(text, {
      type: 'png',
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H'
    });

    // 2. Подготовка формы для Telegram
    const formData = new FormData();
    
    // Обязательные параметры
    formData.append('chat_id', chat_id);
    formData.append('photo', new Blob([qrBuffer]), 'qrcode.png');
    
    // Опциональные параметры
    if (caption) formData.append('caption', caption);
    if (parse_mode) formData.append('parse_mode', parse_mode);
    if (caption_entities) formData.append('caption_entities', JSON.stringify(caption_entities));
    if (show_caption_above_media !== undefined) formData.append('show_caption_above_media', show_caption_above_media);
    if (disable_notification !== undefined) formData.append('disable_notification', disable_notification);
    if (protect_content !== undefined) formData.append('protect_content', protect_content);
    if (message_effect_id) formData.append('message_effect_id', message_effect_id);
    if (reply_parameters) formData.append('reply_parameters', JSON.stringify(reply_parameters));
    if (reply_markup) formData.append('reply_markup', JSON.stringify(reply_markup));
    if (message_thread_id) formData.append('message_thread_id', message_thread_id);
    if (has_spoiler !== undefined) formData.append('has_spoiler', has_spoiler);
    if (allow_sending_without_reply !== undefined) formData.append('allow_sending_without_reply', allow_sending_without_reply);
    if (allow_paid_broadcast !== undefined) formData.append('allow_paid_broadcast', allow_paid_broadcast);
    if (business_connection_id) formData.append('business_connection_id', business_connection_id);

    // 3. Отправка в Telegram
    const tgResponse = await fetch(`https://api.telegram.org/bot${bot_token}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    const result = await tgResponse.json();

    if (!result.ok) {
      throw new Error(result.description || 'Telegram API error');
    }

    return res.json({
      success: true,
      result: result.result
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
