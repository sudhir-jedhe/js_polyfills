***  02-controlled-vs-uncontrolled-inputs.md ***

# Interview Q&A: Controlled vs. Uncontrolled Inputs

**Q: What's the difference between a controlled and an uncontrolled input?**
A controlled input's displayed value is driven entirely by React state — you pass `value` and update it via `onChange`, so state is the single source of truth and the DOM value always mirrors it. An uncontrolled input manages its own value internally in the DOM, and React only reads it on demand (typically via a `ref`) rather than tracking every keystroke in state.

**Q: When would you deliberately choose an uncontrolled input over a controlled one?**
For simple, low-interaction forms where you don't need live validation or derived UI per keystroke; when integrating a non-React widget that expects to manage its own DOM state; and for `<input type="file">`, which can't be controlled by React at all since browsers don't allow JavaScript to programmatically set a file input's value for security reasons.

**Q: How do you handle multiple form fields with a single change handler instead of writing one handler per field?**
Give each input a `name` attribute matching a key in one state object, and read `e.target.name`/`e.target.value` generically inside one handler to update just that key.

```jsx
function handleChange(e) {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
}
```

## Comparison table

| Aspect | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM itself; React reads it on demand via `ref` |
| Validation / conditional UI | Trivial — state is always current, can disable/validate on every keystroke | Requires reading the DOM value explicitly when needed |
| Boilerplate | More — needs state + handler per field | Less — no state wiring needed for simple cases |

Use controlled inputs as the default for most application forms, especially anything needing live validation, formatting, or derived UI. Use uncontrolled for simple one-off forms, integrating third-party non-React widgets, or `<input type="file">` (which can't be controlled by React at all). The common mistake is mixing the two on the same input — passing both `value` and `defaultValue`, or passing `value` without `onChange` — which produces a "changing an uncontrolled input to controlled" warning or a frozen field.
