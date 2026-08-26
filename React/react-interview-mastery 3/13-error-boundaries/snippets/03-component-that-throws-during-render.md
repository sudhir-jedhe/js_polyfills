# A Component That Throws During Render (Will Be Caught)

```jsx
function Buggy({ user }) {
  return <p>{user.profile.name}</p>; // throws if user.profile is undefined
}
// <ErrorBoundary><Buggy user={{}} /></ErrorBoundary> shows the fallback UI
```
