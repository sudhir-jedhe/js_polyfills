# Scenario: A reusable `<TextField>` component needs to let parent forms call `.focus()` on validation errors, without exposing the whole DOM node

You're building a design-system `<TextField>` component (which internally renders a `<label>`, an `<input>`, and an error message). A form using several `TextField`s needs to programmatically focus the first field that fails validation on submit — but the design system team doesn't want consumers reaching into the internal DOM structure (e.g., mutating styles directly on the input from outside).

**Approach:** Use `forwardRef` + `useImperativeHandle` to expose only a `focus()` method, hiding the internal markup entirely:

```jsx
const TextField = forwardRef(function TextField({ label, error, ...inputProps }, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
  }));

  return (
    <div className="text-field">
      <label>{label}</label>
      <input ref={inputRef} {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
});

function SignupForm() {
  const fieldRefs = useRef({});
  const handleSubmit = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    fieldRefs.current[firstErrorField]?.focus();
  };
  return (
    <TextField ref={(el) => (fieldRefs.current.email = el)} label="Email" />
  );
}
```

This keeps `TextField`'s internal DOM structure fully private — the form can only call `.focus()`, nothing else — while still solving the real imperative need (focus management) that plain props/state can't express well.
