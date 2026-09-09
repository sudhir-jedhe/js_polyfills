***  02-children-as-reusable-container.md ***

# `props.children` Makes a Component a Reusable Container

```jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}
// usage: <Panel title="Info"><p>Some content</p></Panel>
```
