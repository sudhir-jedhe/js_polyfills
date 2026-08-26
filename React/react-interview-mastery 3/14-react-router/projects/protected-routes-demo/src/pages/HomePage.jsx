export default function HomePage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Protected Routes Demo</h1>
      <p>
        This is a public page. Try visiting <code>/dashboard</code> without
        logging in first — you'll be redirected to <code>/login</code>, and
        sent back to <code>/dashboard</code> automatically after you log in.
      </p>
    </div>
  );
}
