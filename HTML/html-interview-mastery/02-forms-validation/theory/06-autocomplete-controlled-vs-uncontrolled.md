***  06-autocomplete-controlled-vs-uncontrolled.md ***

# Autocomplete, and Controlled vs. Uncontrolled Inputs

## The `autocomplete` attribute

`autocomplete` tells the browser (and password managers) what *kind* of data a field expects, enabling accurate autofill — this is a UX and accessibility feature (WCAG 1.3.5 "Identify Input Purpose" is literally about this attribute), not just a convenience toggle.

```html
<form>
  <input type="text" name="fname" autocomplete="given-name">
  <input type="text" name="lname" autocomplete="family-name">
  <input type="email" name="email" autocomplete="email">
  <input type="tel" name="phone" autocomplete="tel">
  <input type="text" name="cc-number" autocomplete="cc-number">
  <input type="password" name="new-password" autocomplete="new-password">
  <input type="password" name="current-password" autocomplete="current-password">
</form>
```

`autocomplete="off"` on an entire `<form>` is often misused to "prevent autofill" — most modern browsers deliberately ignore `off` for login/payment-related fields as a UX decision (users overwhelmingly want autofill there), so it's an unreliable way to actually disable it. The correct, respected values are the specific field-purpose tokens above (`new-password` vs. `current-password` is a particularly important distinction: it tells password managers whether to *suggest a strong generated password* or *fill the existing saved one*).

## Controlled vs. uncontrolled inputs — the concept

This distinction is really a **framework/state-management concept** layered on top of native HTML, most associated with React, but the underlying idea applies more broadly:

| | Uncontrolled | Controlled |
|---|---|---|
| Source of truth | The DOM itself holds the current value | Application state (e.g. a JS variable / React state) holds the value; the DOM is kept in sync with it |
| How you read the value | Query the DOM directly (`input.value`, or `FormData` on submit) | Read from your state variable — it's already there |
| How you set the value | User types directly into the DOM; `defaultValue` sets the *initial* value only | Every keystroke fires a change handler that updates state, which re-renders the input's `value` |

## Native HTML forms are inherently "uncontrolled"

Plain HTML/JS forms are naturally uncontrolled — the browser owns the input's value, and you read it out (via `FormData`, `input.value`, or on submit) rather than continuously syncing it with your own JS state:

```html
<input id="name" type="text" defaultValue="not a real HTML attribute — this is React syntax">
<input id="name" type="text" value="Jane">  <!-- in plain HTML, `value` just sets the INITIAL value; the user can freely change it from there -->
```

## React's controlled pattern, for contrast

```jsx
function NameInput() {
  const [name, setName] = useState('');
  return (
    <input
      value={name}                          // DOM value is FORCED to match state on every render
      onChange={(e) => setName(e.target.value)} // every keystroke updates state, triggering a re-render
    />
  );
}
```

If you set `value` without an `onChange` handler in React, the input becomes read-only (React will also warn about this) — because the DOM value is being forced to match state, and without `onChange` nothing ever updates that state, so every keystroke is immediately overridden back to the old value.

## Why the distinction matters practically

- **Uncontrolled** is simpler and has less re-render overhead — good for forms where you only need the value on submit (e.g. `FormData` on a login form).
- **Controlled** is necessary when you need the value *live*, on every keystroke — for real-time validation feedback, conditionally showing/hiding other fields, character counters, or syncing multiple inputs together.
- Mixing the two on the same input (e.g. a React input with both `value` and direct DOM manipulation via a ref) is a common source of subtle bugs — cursor position jumping, or the input seeming to "lag" a keystroke behind — because two different systems are fighting over the same source of truth.
