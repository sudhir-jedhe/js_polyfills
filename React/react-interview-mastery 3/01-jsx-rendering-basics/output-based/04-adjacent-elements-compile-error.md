*** copy 04-adjacent-elements-compile-error.md ***

# Does This Compile/Render?

```jsx
function Header() {
  return (
    <h1>Title</h1>
    <nav>Links</nav>
  );
}
```

**Answer:** It fails to compile — a syntax/build error, not a runtime one.

**Why:** JSX must evaluate to a single element (a single `createElement`/`jsx` call result). Two adjacent top-level elements with no wrapping parent are invalid JSX. Wrapping them in `<>...</>` or a `<div>` fixes it.
