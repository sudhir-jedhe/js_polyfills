***  01-deep-tree-needs-theme-preference.md ***

# Five-Level-Deep Component Tree Needs the Current User's Theme Preference

**Scenario:** You're building a settings feature where `<App>` → `<Dashboard>` → `<Panel>` → `<Widget>` → `<WidgetHeader>` all need access to the user's `theme` value, but only `WidgetHeader` actually uses it — every component in between is just forwarding a `theme` prop it doesn't care about.

**Approach:** This is textbook prop drilling. Since `theme` is cross-cutting and low-frequency-changing, it's a good fit for Context, which lets `WidgetHeader` read it directly without every intermediate component's signature being coupled to it:

```jsx
const ThemeContext = React.createContext('light');

function App() {
  const [theme] = React.useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

function Dashboard() { return <Panel />; }
function Panel() { return <Widget />; }
function Widget() { return <WidgetHeader />; }

function WidgetHeader() {
  const theme = React.useContext(ThemeContext);
  return <h3 className={`header-${theme}`}>Settings</h3>;
}
```

`Dashboard`, `Panel`, and `Widget` no longer need to know `theme` exists at all — their signatures stay clean, and adding new theme-consuming components anywhere in the tree doesn't require touching the intermediate layers.
