import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const qrStore = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const id = uuidv4();
    const qrData = await QRCode.toBuffer(text);
    const expiresAt = Date.now() + 120000;

    qrStore.set(id, { qrData, expiresAt });

    // Удаляем через 2 минуты
    setTimeout(() => qrStore.delete(id), 120000);

    const host = req.headers['x-forwarded-host'] || 'your-domain.vercel.app';
    const qrUrl = `https://${host}/api/qr/${id}.png`;

    return res.json({ qrUrl, expiresAt: new Date(expiresAt).toISOString() });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'QR generation failed' });
  }
}
