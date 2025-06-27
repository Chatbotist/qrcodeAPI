import { qrStore } from '../generate-qr';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  try {
    const { id } = req.query;
    const cleanId = id.replace(/\.png$/, '');

    if (!qrStore.has(cleanId)) {
      return res.status(404).send('Not found');
    }

    const { qrData, expiresAt } = qrStore.get(cleanId);

    if (Date.now() > expiresAt) {
      qrStore.delete(cleanId);
      return res.status(410).send('Expired');
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(qrData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
}
