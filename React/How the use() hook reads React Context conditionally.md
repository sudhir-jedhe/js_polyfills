In React 19, the **`use()` API** can unwrap React Context just like `useContext()`, but with one major capability: **it can be called conditionally**.

Unlike standard React hooks (`useContext`, `useState`, `useEffect`), `use()` is **not bound to the strict Rules of Hooks**. You can invoke it inside `if` statements, ternary operators, `switch` blocks, and loops.

---

### The Problem with `useContext` (The Old Way)

`useContext()` must always execute at the top level of a component on every single render pass, regardless of whether you actually need the context value.

```tsx
// ❌ Traditional useContext cannot be called conditionally
function ProfileCard({ showPremiumFeatures }: { showPremiumFeatures: boolean }) {
  // Always subscribes to PremiumContext, causing re-renders even when unused!
  const premiumConfig = useContext(PremiumContext);

  if (!showPremiumFeatures) {
    return <div>Standard User View</div>;
  }

  return <div>Premium Expiry: {premiumConfig.expiryDate}</div>;
}

```

---

### The Solution: Conditional Context with `use(Context)`

By switching to `use(Context)`, the component only reads the context and **only subscribes to re-renders** when the condition is met.

```tsx
'use client';

import { createContext, use } from 'react';

interface ThemeConfig {
  mode: 'dark' | 'light';
  accentColor: string;
}

export const ThemeContext = createContext<ThemeConfig>({
  mode: 'light',
  accentColor: '#0070f3',
});

export function ThemedButton({
  useCustomTheme,
  label,
}: {
  useCustomTheme: boolean;
  label: string;
}) {
  // ✅ VALID in React 19: Called conditionally inside an `if` block
  if (useCustomTheme) {
    const theme = use(ThemeContext);
    return (
      <button style={{ backgroundColor: theme.accentColor, color: theme.mode === 'dark' ? '#fff' : '#000' }}>
        {label}
      </button>
    );
  }

  // If `useCustomTheme` is false, this component never subscribes to ThemeContext
  return <button className="default-btn">{label}</button>;
}

```

---

### Key Behavioral Advantages

* **Optimized Subscriptions & Re-renders:** When a component calls `use(ThemeContext)` conditionally, React only establishes a context dependency during render passes where that branch executes. If the condition evaluates to `false`, changes to `ThemeContext.Provider` will **not trigger a re-render** of that component.
* **Early Return Safety:** You can call `use(Context)` after early return guards (e.g., `if (!user) return null; const settings = use(SettingsContext);`).
* **Dynamic Context Selection:** You can switch which context to read dynamically at runtime based on props:

```tsx
function UnifiedEditor({ editorType }: { editorType: 'markdown' | 'rich-text' }) {
  // Dynamically choose which context to consume
  const editorConfig = use(
    editorType === 'markdown' ? MarkdownContext : RichTextContext
  );

  return <div>Current Engine: {editorConfig.engineName}</div>;
}

```

---

### Comparison: `useContext()` vs. `use(Context)`

| Feature                            | `useContext(MyContext)`                                         | `use(MyContext)`                                                |
| ---------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| **Top-level execution**            | Required (Rules of Hooks)                                       | Allowed                                                         |
| **Inside `if` / `switch` blocks**  | ❌ Forbidden                                                     | ✅ **Allowed**                                                   |
| **Inside loops**                   | ❌ Forbidden                                                     | ✅ **Allowed**                                                   |
| **After early returns**            | ❌ Forbidden                                                     | ✅ **Allowed**                                                   |
| **Re-render trigger**              | Always re-renders when Context updates                          | Re-renders only if read during the active render pass           |
| **Context Provider compatibility** | `<Context.Provider value="{...}">` or `<Context value="{...}">` | `<Context.Provider value="{...}">` or `<Context value="{...}">` |

---

### Syntax Tip in React 19: Simplified Context Providers

In React 19, you no longer need to write `<ThemeContext.Provider value="{...}">`. You can render the context directly as a provider:

```tsx
export function App() {
  return (
    // React 19 native syntax: <ThemeContext> instead of <ThemeContext.Provider>
    <ThemeContext value={{ mode: 'dark', accentColor: '#38bdf8' }}>
      <ThemedButton useCustomTheme={true} label="Click Me" />
    </ThemeContext>
  );
}

```
