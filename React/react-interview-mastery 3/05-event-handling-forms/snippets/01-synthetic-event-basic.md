*** copy 01-synthetic-event-basic.md ***

# Snippet: Basic SyntheticEvent usage

```jsx
// Same shape as a native event
function ClickLogger() {
  function handleClick(event) {
    console.log(event.type, event.target.tagName);
  }
  return <button onClick={handleClick}>Log click</button>;
}
```
