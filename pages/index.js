export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Генератор QR-кодов</h1>
      <p>Отправьте POST запрос на <code>/api/generate-qr</code> с JSON телом:</p>
      <pre>{`{
  "text": "Ваш текст"
}`}</pre>
      <p>В ответе получите Data URL QR-кода, который можно использовать в теге img:</p>
      <pre>{`{
  "qrDataUrl": "data:image/png;base64,..."
}`}</pre>
    </div>
  );
}
