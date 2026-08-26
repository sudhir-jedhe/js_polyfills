# Route-Level Code Splitting

```jsx
const Home = React.lazy(() => import("./routes/Home"));
const About = React.lazy(() => import("./routes/About"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```
