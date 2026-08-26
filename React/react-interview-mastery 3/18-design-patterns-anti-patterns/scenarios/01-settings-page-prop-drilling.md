# A Settings Page Passes the Same Five Props Through Four Component Layers

You inherit a settings page where `theme`, `locale`, `currentUser`, and two callback props are threaded through `SettingsPage` → `SettingsLayout` → `SettingsSection` → `SettingsField`, even though only `SettingsField` actually uses most of them. Adding a new setting means touching all four files.

**Approach:** Identify which props are cross-cutting concerns (theme, locale, currentUser — good candidates for context) versus which are genuinely specific to a particular field (a callback tied to one specific setting, better passed directly or via composition). Move the cross-cutting ones to context, and restructure the layout components to accept `children` instead of forwarding unrelated props.

```jsx
const SettingsContext = createContext();

function SettingsPage({ user }) {
  return (
    <SettingsContext.Provider value={{ theme: user.theme, locale: user.locale, user }}>
      <SettingsLayout>
        <SettingsSection title="Notifications">
          <SettingsField name="emailAlerts" />
        </SettingsSection>
      </SettingsLayout>
    </SettingsContext.Provider>
  );
}

function SettingsLayout({ children }) {
  return <div className="settings-layout">{children}</div>; // no prop knowledge needed
}

function SettingsField({ name }) {
  const { theme, user } = useContext(SettingsContext);
  // reads what it needs directly, no drilling
  return <div className={theme}>...</div>;
}
```

Now adding a new setting only touches the leaf component and doesn't require editing the layout/section components' prop signatures at all.
