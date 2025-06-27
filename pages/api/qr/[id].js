import { qrStore } from '../generate-qr';

export default function handler(req, res) {
  try {
    // Разрешаем только GET запросы
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end();
    }

    // Извлекаем и очищаем ID
    const { id } = req.query;
    const cleanId = id.replace(/\.png$/, '');

    // Проверяем наличие QR-кода
    if (!qrStore.has(cleanId)) {
      return res.status(404).send('QR code not found');
    }

    const { qrData, expiresAt } = qrStore.get(cleanId);

    // Проверяем срок действия
    if (Date.now() > expiresAt) {
      qrStore.delete(cleanId);
      return res.status(410).send('QR code expired');
    }

    // Отправляем изображение
    res
      .setHeader('Content-Type', 'image/png')
      .setHeader('Cache-Control', 'public, max-age=60')
      .send(qrData);
  } catch (error) {
    console.error('QR retrieval error:', error);
    res.status(500).send('Internal Server Error');
  }
}
