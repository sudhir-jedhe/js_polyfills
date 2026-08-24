# Anti-Pattern: Prop Drilling Instead of Composition/Context

Passing a prop through five layers of components that don't use it themselves, just to get it to a deeply nested consumer, couples every intermediate component to a prop it doesn't care about. It also makes refactors and renames expensive, since you have to touch every layer in between.

```jsx
// Before: theme drilled through Layout -> Header -> Nav -> UserMenu
function Layout({ theme }) {
  return <Header theme={theme} />;
}
function Header({ theme }) {
  return <Nav theme={theme} />;
}
function Nav({ theme }) {
  return <UserMenu theme={theme} />;
}

// After: context, or just composition (pass UserMenu as children)
const ThemeContext = createContext();
function Layout() {
  return <Header />; // no longer needs to know about theme
}
function UserMenu() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

## Two alternatives, and when to use which

**Composition** — pass pre-built elements as `children` or named slot props, so intermediate components stay generic:

```jsx
// Layout no longer needs to know or forward "sidebar" content
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout sidebar={<UserMenu />}>
      <Dashboard />
    </Layout>
  );
}
```

**Context** — for values genuinely needed by many distant, unrelated descendants (theme, auth, locale).

| Aspect | Prop drilling | Context | Composition (children/render props) |
|---|---|---|---|
| Coupling | Every intermediate component must know about the prop | Intermediate components stay ignorant of the value | Intermediate components just render `children`, staying generic |
| Best for | 1-2 levels deep, simple values | Global-ish concerns (theme, auth, locale) needed by many distant descendants | Passing pre-built elements/slots down through a fixed layout structure |
| Common mistake | Drilling props 4+ levels through components that never use them | Overusing context for state that changes often, causing wide re-renders of every consumer | Reaching for context when plain composition (`<Layout sidebar={<X/>}>`) would have been simpler |

Try composition first for layout-shaped problems; reach for context when a value is genuinely needed by many unrelated, deeply nested consumers.
