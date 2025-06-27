import { qrStore } from '../generate-qr';

export const config = {
  api: {
    responseLimit: false, // Отключаем лимит размера ответа
  },
};

export default function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).setHeader('Allow', 'GET').end();
    }

    const { id } = req.query;
    const cleanId = id.replace(/\.png$/, '');

    if (!qrStore.has(cleanId)) {
      return res.status(404).send('QR-код не найден');
    }

    const { qrData, expiresAt } = qrStore.get(cleanId);

    if (Date.now() > expiresAt) {
      qrStore.delete(cleanId);
      return res.status(410).send('QR-код устарел');
    }

    res
      .setHeader('Content-Type', 'image/png')
      .setHeader('Cache-Control', 'public, max-age=60')
      .send(qrData);
  } catch (error) {
    console.error('Ошибка получения QR:', error);
    res.status(500).send('Ошибка сервера');
  }
}
