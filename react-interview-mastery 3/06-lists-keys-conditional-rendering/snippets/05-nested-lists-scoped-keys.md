# Snippet: Nested lists each need their own key scoped to their own siblings

```jsx
function Categories({ categories }) {
  return (
    <div>
      {categories.map((cat) => (
        <section key={cat.id}>
          <h3>{cat.name}</h3>
          <ul>
            {cat.items.map((item) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```
