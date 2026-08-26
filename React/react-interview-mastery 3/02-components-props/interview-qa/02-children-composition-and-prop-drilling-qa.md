*** copy 02-children-composition-and-prop-drilling-qa.md ***

# Interview Q&A — Children, Composition, and Prop Drilling

**Q: What is `props.children`, and where does it come from?**
It's a special prop automatically populated with whatever is nested between a component's opening and closing JSX tags. It lets a component act as a generic container/wrapper without knowing what will be rendered inside it — the basis for components like `Modal`, `Card`, or `Layout`.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

**Q: What is prop drilling, and why is it considered a problem?**
It's passing data through several layers of components via props purely so a deeply nested descendant can access it, even though the intermediate components don't use that data themselves. It's not a bug, but it couples every intermediate component's signature to data it doesn't care about, making refactors (renaming/moving that data) touch every layer in between and making the intermediate components harder to reuse independently.

**Q: What are the main ways to avoid prop drilling?**
Context (for cross-cutting, infrequently-changing data like theme/auth/locale), composition (passing already-built JSX elements as props/`children` instead of raw data, so intermediate layers don't need to know about it), and, for larger apps, a dedicated state management library. Composition is often underused and solves the problem without adding Context's re-render considerations.
