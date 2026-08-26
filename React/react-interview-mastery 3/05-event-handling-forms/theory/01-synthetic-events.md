*** copy 01-synthetic-events.md ***

# SyntheticEvent

Handlers you attach in JSX (`onClick`, `onChange`, `onSubmit`, ...) don't receive the raw browser `Event` object — they receive a `SyntheticEvent`, a cross-browser wrapper that normalizes event properties and behavior so you don't have to special-case old browsers. It has the same interface as the native event (`target`, `currentTarget`, `preventDefault()`, `stopPropagation()`, etc.), and exposes the original via `event.nativeEvent` if you ever need it.

```jsx
function Button() {
  function handleClick(event) {
    console.log(event.type);        // "click"
    console.log(event.target);      // the DOM node clicked
    console.log(event.nativeEvent); // the underlying browser event
  }
  return <button onClick={handleClick}>Click</button>;
}
```

Since React 17+, synthetic events are no longer pooled/reused (older React versions nulled out event fields after the handler returned unless you called `event.persist()`), so you can safely read event properties asynchronously (e.g. inside a `setTimeout`) without needing `persist()`.

## No `this`, but closures still matter

Function components sidestep the classic class-component footgun of needing to `.bind(this)` or use arrow-function class fields to keep `this` correct in handlers — there's no `this` to lose track of. But handlers defined inside a function component are still closures over that render's props/state, which is the source of the same category of bugs seen in the state and effects topics:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setTimeout(() => {
      console.log(count); // whatever `count` was during THIS render, not necessarily current
    }, 3000);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```
