# Snippet: useCallback Keeping a Handler Reference Stable Across Renders

```jsx
function SearchBox({ onSearch }) {
  const [text, setText] = useState('');
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(text);
    },
    [text, onSearch]
  );
  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </form>
  );
}
```
