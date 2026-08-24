# Layout Route With `<Outlet />` for Nested Pages

```jsx
function AppLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
// <Route element={<AppLayout />}>
//   <Route path="/" element={<Home />} />
//   <Route path="/about" element={<About />} />
// </Route>
```
