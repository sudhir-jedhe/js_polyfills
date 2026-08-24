# Snippet: Using a Fragment with a key when mapping to multiple sibling elements

```jsx
function DefinitionList({ entries }) {
  return (
    <dl>
      {entries.map((e) => (
        <React.Fragment key={e.id}>
          <dt>{e.term}</dt>
          <dd>{e.definition}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```
