*** copy 05-prevent-default-submit.md ***

# Snippet: preventDefault on submit to stop the browser's full-page reload

```jsx
function SubscribeForm() {
  const [email, setEmail] = React.useState('');
  function handleSubmit(e) {
    e.preventDefault();
    console.log('subscribing:', email);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```
