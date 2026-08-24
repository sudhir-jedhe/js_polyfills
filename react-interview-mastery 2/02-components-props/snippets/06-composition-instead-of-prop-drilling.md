# Composition Instead of Prop Drilling — Pass a Built Element Down

```jsx
function Layout({ sidebar, content }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}
// usage: <Layout sidebar={<Nav />} content={<Dashboard />} />
```
