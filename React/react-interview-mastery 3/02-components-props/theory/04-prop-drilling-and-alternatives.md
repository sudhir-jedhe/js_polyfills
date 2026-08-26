*** copy 04-prop-drilling-and-alternatives.md ***

# Prop Drilling and Its Alternatives

When data needs to reach a deeply nested component, and every intermediate component has to accept and forward a prop it doesn't itself use, that's prop drilling:

```jsx
function App() {
  const [user, setUser] = React.useState({ name: 'Ada' });
  return <Page user={user} />;
}
function Page({ user }) {
  return <Sidebar user={user} />; // Page doesn't use `user`, just forwards it
}
function Sidebar({ user }) {
  return <Avatar user={user} />; // same here
}
function Avatar({ user }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}
```

It's not *wrong*, but it becomes a maintenance burden as the tree grows: every intermediate component's signature is coupled to data it doesn't care about, and moving/renaming that data means touching every layer. Common fixes: `Context` for cross-cutting data (theme, auth, locale), composition (passing already-built elements down via `children` instead of raw data), or a state management library for genuinely global app state.

## Prop drilling vs. Context vs. composition

| Aspect | Prop drilling | Context | Composition (pass elements as props/children) |
|---|---|---|---|
| Setup cost | None — just pass props | Requires a Provider + `useContext` calls | Requires restructuring how components are nested |
| Coupling | Every intermediate component's signature is coupled to data it doesn't use | Consumers subscribe directly, no intermediate coupling | Intermediate components don't need to know about the data at all |
| Best for | Shallow trees, 1-2 levels | Cross-cutting, rarely-changing data (theme, auth, locale) | Avoiding drilling without needing global/shared state at all |

Use plain prop drilling for shallow component trees where it's still easy to trace. Reach for Context when data genuinely needs to be read by many components at different depths and doesn't change on every keystroke (frequent updates through Context can cause broad re-renders — see the `07-context-api` topic). Reach for composition first when the "problem" is actually just deeply nested layout — passing already-built elements down often removes the need for Context entirely. The common mistake is jumping straight to Context/a state library for a problem that composition would solve more simply.
