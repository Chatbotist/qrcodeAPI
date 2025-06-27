import { qrStorage } from '../generate-qr';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { id } = req.query;
  const cleanId = id.replace('.png', '');

  if (!qrStorage[cleanId]) {
    return res.status(404).end();
  }

  // Отправляем PNG изображение
  res.setHeader('Content-Type', 'image/png');
  res.send(qrStorage[cleanId]);
}
