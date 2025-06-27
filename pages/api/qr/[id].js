import { qrStorage } from '../generate-qr';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { id } = req.query;
  const cleanId = id.replace('.png', '');

  if (!qrStorage.has(cleanId)) {
    return res.status(404).send('QR-код не найден или удален');
  }

  try {
    const qrBuffer = qrStorage.get(cleanId);
    res.setHeader('Content-Type', 'image/png');
    res.send(qrBuffer);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка сервера');
  }
}
