# Basic Lazy Component with Suspense Fallback

```jsx
const Profile = React.lazy(() => import("./Profile"));

function App() {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <Profile />
    </Suspense>
  );
}
```
