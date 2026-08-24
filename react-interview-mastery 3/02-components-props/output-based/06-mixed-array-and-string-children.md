# What Does This Render?

```jsx
function Wrapper({ children }) {
  return <div>{children}</div>;
}

function App() {
  return (
    <Wrapper>
      {[1, 2, 3].map(n => <span key={n}>{n}</span>)}
      Hello
    </Wrapper>
  );
}
```

**Answer:** A `<div>` containing three `<span>` elements (1, 2, 3) followed by the text "Hello" — `children` here is an array mixing elements and a string.

**Why:** JSX allows multiple children of mixed types; React normalizes them into an array under `props.children` when there's more than one child. Components consuming `children` don't need to know or care whether it's a single node, a string, or an array — `{children}` just renders whatever it is.
