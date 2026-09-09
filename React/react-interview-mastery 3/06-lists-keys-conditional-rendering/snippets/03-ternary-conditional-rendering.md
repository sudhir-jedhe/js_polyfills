***  03-ternary-conditional-rendering.md ***

# Snippet: Ternary conditional rendering — two mutually exclusive branches

```jsx
function AuthGate({ isLoggedIn }) {
  return isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>;
}
```
