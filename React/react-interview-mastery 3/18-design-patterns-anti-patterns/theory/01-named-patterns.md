# Named Patterns Worth Knowing

## Compound components

A parent component implicitly shares state with its children via context, so the children can be composed flexibly while still coordinating (think `<Select>` / `<Select.Option>`, or `<Tabs>` / `<Tabs.Tab>`):

```jsx
function Tabs({ children, defaultIndex = 0 }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}
Tabs.Tab = function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button onClick={() => setActive(index)} aria-selected={active === index}>
      {children}
    </button>
  );
};
```

Use it when you want consumers to control layout/order/composition of related pieces while the parent still coordinates shared state like "which tab is active."

## Controlled vs. uncontrolled components

Controlled means the value lives in React state and is set via `value`/`onChange`; uncontrolled means the DOM owns the value and you read it via a `ref` when needed. Controlled gives you validation-as-you-type and single-source-of-truth state; uncontrolled is simpler for basic forms and avoids re-rendering on every keystroke.

| Aspect | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM itself (accessed via `ref`) |
| Re-renders | On every keystroke/change | None from the input itself |
| Use when | You need live validation, conditional disabling, or to derive other UI from the value as it's typed | Simple forms where you only need the value on submit |
| Common mistake | Making every form field controlled by default even when nothing needs the live value, adding unnecessary re-renders | Trying to programmatically set an uncontrolled input's value outside of `defaultValue`/refs, fighting the DOM instead of just switching it to controlled |

Default to uncontrolled for simple forms; switch specific fields to controlled only when you actually need to react to changes as they happen.

## Container/presentational

Separating data-fetching/logic ("container") from pure rendering ("presentational") components. This was more load-bearing before hooks, when logic reuse required class-component wrapper patterns; today custom hooks extract logic without forcing a component-splitting hierarchy, so this pattern shows up less as a strict rule and more as a general instinct ("keep display logic separate from data logic") than a named structural requirement.

| Aspect | Container/Presentational (two components) | Custom hook (one component) |
|---|---|---|
| Structure | Forces a parent/child component hierarchy | Logic lives in a hook, UI stays in one component |
| Reusability | Reuse requires reusing the container component | Reuse the hook independently of any specific UI |
| Era | Common pre-hooks (class component era) | The default idiom since hooks |
| Common mistake | Still splitting into two components purely out of habit when a hook would be simpler | Cramming too much unrelated logic into one giant custom hook, recreating the "does too much" problem inside the hook instead of the component |

In the class-component era, reusing stateful logic across components required patterns like higher-order components or render props, which naturally pushed developers toward splitting a "smart" data-owning component from a "dumb" rendering component. Hooks let you extract and reuse that stateful logic directly as a function without needing to wrap or nest components at all — the same separation of concerns no longer requires a specific component hierarchy; it becomes a function/JSX split within one component instead.
