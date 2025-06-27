import { qrStorage } from '../generate-qr';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { id } = req.query;

  if (!id || !qrStorage.has(id)) {
    return res.status(404).json({ error: 'QR-код не найден' });
  }

  const { qrDataUrl, expiresAt } = qrStorage.get(id);

  if (Date.now() > expiresAt) {
    qrStorage.delete(id);
    return res.status(410).json({ error: 'Срок действия QR-кода истек' });
  }

  // Перенаправляем на Data URL изображения
  return res.redirect(qrDataUrl);
}
