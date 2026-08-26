# Interview Q&A: Named Patterns

**Q: What is a compound component, and when would you use one?**
It's a pattern where a parent component implicitly shares state with its children via context, letting you compose a flexible API (`<Tabs><Tabs.Tab/><Tabs.Tab/></Tabs>`) instead of a single component with a rigid prop shape (like an array of tab configs). Use it when you want consumers to control layout/order/composition of related pieces while the parent still coordinates shared state like "which tab is active."

**Q: What's the difference between controlled and uncontrolled components, and when would you pick one over the other?**
A controlled component's value lives in React state and is driven by `value`/`onChange`; an uncontrolled component lets the DOM hold the value, read via a `ref` when needed (with `defaultValue` for the initial value). Pick controlled when you need to react to every change (validation, conditionally disabling other fields); pick uncontrolled for simple forms where you only care about the value at submit time and want to avoid re-rendering on every keystroke.

**Q: Is the container/presentational pattern still relevant with hooks?**
Less so as a strict rule — custom hooks now extract stateful logic without requiring a forced two-component split, so the separation of "logic" and "display" concerns is usually achieved with `const data = useSomeHook()` inside one component. The underlying principle (keep data logic separate from rendering logic) is still good practice; the specific two-component structural pattern is just no longer the default way to achieve it.

**Q: How would you explain the "presentational vs container" split to someone who's only ever written class components before, in terms of what changed?**
In the class-component era, reusing stateful logic across components required patterns like higher-order components or render props, which naturally pushed you toward splitting a "smart" data-owning component from a "dumb" rendering component. Hooks let you extract and reuse that stateful logic directly as a function (a custom hook) without needing to wrap or nest components at all, so the same separation of concerns no longer requires a specific component hierarchy — the logic/UI split becomes a function/JSX split within one component instead.
