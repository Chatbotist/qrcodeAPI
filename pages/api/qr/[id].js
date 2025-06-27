import { qrCodes } from '../generate-qr';

export default function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { id } = req.query;
    const cleanId = id.replace('.png', '');

    if (!qrCodes[cleanId]) {
      return res.status(404).end();
    }

    res.setHeader('Content-Type', 'image/png');
    return res.send(qrCodes[cleanId]);

  } catch (error) {
    console.error('QR error:', error);
    return res.status(500).end();
  }
}
