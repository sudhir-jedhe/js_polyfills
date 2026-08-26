export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Mini Notes API</h1>
      <p>This app only exists to demonstrate Route Handlers. Try the API directly:</p>
      <ul>
        <li><code>GET /api/notes</code></li>
        <li><code>POST /api/notes</code> — body: <code>{'{ "title": "...", "body": "..." }'}</code></li>
        <li><code>GET /api/notes/:id</code></li>
        <li><code>PUT /api/notes/:id</code> — body: <code>{'{ "title"?: "...", "body"?: "..." }'}</code></li>
        <li><code>DELETE /api/notes/:id</code></li>
      </ul>
      <p>See the README for curl examples.</p>
    </main>
  );
}
