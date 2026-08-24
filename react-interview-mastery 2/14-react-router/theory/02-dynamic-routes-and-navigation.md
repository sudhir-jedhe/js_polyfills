# Dynamic Route Matching and Navigation Hooks

## Dynamic route matching with `useParams`

Segments prefixed with `:` are params, extracted with `useParams()`:

```jsx
// route: <Route path="/users/:userId" element={<UserProfile />} />
function UserProfile() {
  const { userId } = useParams(); // e.g. "42" for /users/42
  return <p>Viewing user {userId}</p>;
}
```

Route params are always strings — React Router does zero type coercion or validation on dynamic segments. Any type conversion (`Number(userId)`) and validation is the developer's responsibility inside the component or a loader.

## `useNavigate`, `useLocation`, `useSearchParams`

```jsx
function LoginForm() {
  const navigate = useNavigate();
  function handleSubmit() {
    login().then(() => navigate('/dashboard')); // programmatic navigation
  }
  return <form onSubmit={handleSubmit}>...</form>;
}

function CurrentPathDisplay() {
  const location = useLocation(); // { pathname, search, hash, state, key }
  return <p>You're on {location.pathname}</p>;
}

function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  return (
    <input
      value={query}
      onChange={e => setParams({ q: e.target.value })} // updates ?q=...
    />
  );
}
```

`navigate(-1)` goes back; `navigate('/path', { replace: true })` replaces the current history entry instead of pushing (useful after a redirect so back doesn't loop through it).

Query parameters (`?sort=price`) differ from route params (`:id`): route params are part of the URL path structure defined by the route's `path` and read with `useParams()`; query params are read/updated with `useSearchParams()`, which returns a `URLSearchParams`-like object and a setter, updating the query string without necessarily matching a different route.

## `useNavigate` vs `<Navigate>`

| Aspect | `useNavigate()` hook | `<Navigate>` component |
|---|---|---|
| Trigger | Imperative — call `navigate('/path')` inside an event handler, effect, or async callback | Declarative — rendered as JSX, navigates as a side effect of being rendered |
| Typical use case | Navigating after a form submit, button click, or async operation completes | Redirecting during render, e.g. inside a route guard (`isAuthed ? children : <Navigate to="/login"/>`) |
| Common mistake | Calling `navigate()` directly in the render body (not inside an event handler/effect), causing render-phase side effects and warnings | Using `<Navigate>` for something that should be a response to a user action instead of a render-time condition, making the redirect harder to trace |

Use `<Navigate>` for conditional redirects that are a function of current render state (like auth guards); use `useNavigate` for anything triggered by an explicit action. Calling `navigate()` directly during the render phase is a side effect and violates React's rule against side effects in render — `<Navigate>` is specifically designed to perform its redirect safely when rendered, making it safe to return conditionally from JSX.
