# Per-Section Boundaries So One Widget Failing Doesn't Take Down the Page

```jsx
function HomePage() {
  return (
    <>
      <ErrorBoundary fallback={<p>Weather unavailable</p>}>
        <WeatherWidget />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>News unavailable</p>}>
        <NewsFeed />
      </ErrorBoundary>
    </>
  );
}
```
