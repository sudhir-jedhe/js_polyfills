*** copy 05-default-props-and-component-design.md ***

# Default Prop Values and Component Design Heuristics

## Default props

Provide fallback values via destructuring defaults (the standard function-component idiom — the old static `defaultProps` field on the component is legacy and deprecated for function components):

```jsx
function Button({ label = 'Submit', variant = 'primary' }) {
  return <button className={`btn btn-${variant}`}>{label}</button>;
}
```

Destructuring defaults kick in specifically when a prop's value is `undefined` — whether it was omitted entirely or explicitly passed as `undefined`, both trigger the default. Passing `null` does *not* trigger the default, since `null` is a defined value; the component receives `null` as-is.

## Controlled vs. presentational thinking

"Presentational" (or "dumb") components only render based on props and don't own business logic or state beyond trivial UI-local state (like a hover flag); "controlled" (or "container") components own state/data-fetching and pass values + callbacks down. This isn't an official React API distinction, but a design heuristic: keeping presentational components free of side effects makes them trivially reusable and testable.

```jsx
// Presentational — pure function of props
function TextInput({ value, onChange, placeholder }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} />;
}

// Controlling — owns the state
function SearchBox() {
  const [query, setQuery] = React.useState('');
  return <TextInput value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" />;
}
```

This separation makes UI pieces reusable independent of where their data comes from — `TextInput` doesn't care whether its value comes from local `useState`, a form library, or a Redux store.
