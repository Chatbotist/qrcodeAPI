export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>QR Code Generator API</h1>
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        <h3>How to use:</h3>
        <pre>{`
POST /api/generate-qr
Content-Type: application/json

{
  "text": "Your text here"
}
        `}</pre>
        <p>Response:</p>
        <pre>{`
{
  "qrUrl": "https://your-domain.com/api/qr/[uuid].png",
  "expiresAt": "2023-12-31T23:59:59.000Z"
}
        `}</pre>
      </div>
    </div>
  );
}
