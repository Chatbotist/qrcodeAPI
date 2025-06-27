export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>API генератора QR-кодов</h1>
      <p>Отправьте POST запрос на <code>/api/generate-qr</code>:</p>
      
      <pre>{`{
  "text": "Ваш текст"
}`}</pre>

      <p>В ответ получите:</p>
      <pre>{`{
  "qrUrl": "https://ваш-домен/api/qr/abc123.png",
  "expiresAt": "2023-12-31T23:59:59.000Z"
}`}</pre>
    </div>
  );
}
