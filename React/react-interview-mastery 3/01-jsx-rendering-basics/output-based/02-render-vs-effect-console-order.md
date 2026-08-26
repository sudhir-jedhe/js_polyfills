*** copy 02-render-vs-effect-console-order.md ***

# What's the Console Output Order?

```jsx
function App() {
  console.log('render');
  React.useEffect(() => {
    console.log('effect');
  });
  return <div>hi</div>;
}
```

**Answer:** `render` logs first, then `effect`, on every render.

**Why:** JSX/function body execution happens synchronously during render, producing the element tree. Effects run after React commits that tree to the DOM, not during render — so any `useEffect` callback (without dependencies shown here, meaning it runs after every render) always logs after the render log.
