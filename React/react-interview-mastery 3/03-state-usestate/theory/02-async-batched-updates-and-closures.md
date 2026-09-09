***  02-async-batched-updates-and-closures.md ***

# Updates Are Asynchronous and Batched

Calling the setter doesn't update `count` synchronously in the current closure — it schedules an update. React processes state updates and re-renders as a batch, typically at the end of the current event handler (and, since React 18, in timeouts/promises/native handlers too — "automatic batching"):

```jsx
function Example() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // still logs the OLD value — this render's closure
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`count` inside `handleClick` is a value captured from the render that created this closure; it doesn't magically update mid-function just because you called `setCount`. The DOM/UI updates only after React re-renders with the new state.

## Why "asynchronous" is the right word here

Practically, this means code immediately after a `setState` call in the same function still sees the old value, and multiple `setState` calls to the same piece of state in one handler using the direct (non-functional) form all read the same stale closure value rather than compounding — covered in detail in `03-functional-updates.md`.

React does not guarantee that multiple `setState` calls in the same event handler each cause a separate re-render — it batches multiple state updates that occur within the same synchronous block of work (an event handler, and since React 18, also timeouts/promises/native listeners) into a single re-render for efficiency, rather than re-rendering after each individual `setState` call.
