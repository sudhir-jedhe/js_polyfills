# Multiple Lazy Components Under One Shared Boundary

```jsx
const Sidebar = React.lazy(() => import("./Sidebar"));
const MainContent = React.lazy(() => import("./MainContent"));

function Layout() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Sidebar />
      <MainContent />
    </Suspense>
  );
}
```
