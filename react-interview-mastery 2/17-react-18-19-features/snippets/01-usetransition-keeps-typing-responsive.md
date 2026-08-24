# useTransition Keeps Typing Responsive During an Expensive Re-render

```jsx
function FilterList({ items }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filtered, setFiltered] = useState(items);

  function handleChange(e) {
    setText(e.target.value);
    startTransition(() => {
      setFiltered(items.filter((i) => i.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={text} onChange={handleChange} />
      {isPending && <span> updating...</span>}
      <ul>{filtered.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}
```
