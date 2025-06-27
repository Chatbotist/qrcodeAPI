import { qrStorage } from '../generate-qr';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).end();
  }

  const { id } = req.query;
  
  // Удаляем .png из ID если есть
  const cleanId = id.replace(/\.png$/, '');

  if (!qrStorage.has(cleanId)) {
    return res.status(404).send('QR code not found');
  }

  const { qrBuffer, expiresAt } = qrStorage.get(cleanId);

  if (Date.now() > expiresAt) {
    qrStorage.delete(cleanId);
    return res.status(410).send('QR code expired');
  }

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(qrBuffer);
}
