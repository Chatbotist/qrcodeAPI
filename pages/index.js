export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API генератора временных QR-кодов</h1>
      <p>Отправьте POST запрос на <code>/api/generate-qr</code> с JSON телом:</p>
      <pre>{`{
  "text": "Ваш текст для кодирования"
}`}</pre>
      <p>API вернет URL вида <code>/api/get-qr/123-456</code>, который будет действителен 2 минуты</p>
    </div>
  );
}
