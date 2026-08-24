# What Happens When This `<a>` Tag Is Clicked Inside a React Router App?

```jsx
function Nav() {
  return (
    <nav>
      <a href="/profile">Profile</a>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
```

**Answer:** Clicking "Profile" causes a full page reload (a real HTTP GET request to `/profile`, tearing down the whole React app and re-initializing it). Clicking "Settings" navigates client-side with no reload.

**Why:** A plain `<a href>` has no React Router behavior attached — the browser's default navigation takes over. `<Link>` intercepts the click with `preventDefault()` and uses the History API instead. Using `<a>` for in-app links is a common bug that silently reintroduces full-page reloads and loses all React state.
