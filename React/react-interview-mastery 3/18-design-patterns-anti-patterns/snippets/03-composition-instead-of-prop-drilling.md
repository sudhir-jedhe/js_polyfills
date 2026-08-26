# Composition Instead of Prop Drilling

```jsx
// Layout no longer needs to know or forward "sidebar" content
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout sidebar={<UserMenu />}>
      <Dashboard />
    </Layout>
  );
}
```
