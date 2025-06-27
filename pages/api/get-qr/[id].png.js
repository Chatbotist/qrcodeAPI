import { qrStorage } from '../generate-qr';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).end();
  }

  const { id } = req.query;

  if (!id || !qrStorage.has(id)) {
    return res.status(404).send('QR-код не найден');
  }

  const { qrData, expiresAt } = qrStorage.get(id);

  if (Date.now() > expiresAt) {
    qrStorage.delete(id);
    return res.status(410).send('QR-код больше не доступен');
  }

  res.setHeader('Content-Type', 'image/png');
  res.send(qrData);
}
