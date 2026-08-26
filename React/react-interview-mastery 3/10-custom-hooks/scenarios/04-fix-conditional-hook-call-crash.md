*** copy 04-fix-conditional-hook-call-crash.md ***

# Scenario: A Custom Hook Crashes the App With "Rendered Fewer Hooks Than Expected"

A teammate wrote this hook and it throws intermittently:

```jsx
function useValidatedField(value, isRequired) {
  if (isRequired) {
    const [touched, setTouched] = useState(false);
    return { touched, setTouched, isValid: !isRequired || value.length > 0 };
  }
  return { isValid: true };
}
```

They're confused because it works fine when `isRequired` never changes for a given field, but crashes when a form conditionally makes a field required based on another field's value.

**Approach:** Explain the root cause directly: the `useState` call is inside an `if`, so the number of hooks called varies between renders based on `isRequired` — a direct Rule of Hooks violation. Fix it by always calling `useState` unconditionally, and only *using* the conditional logic in what you do with its result:

```jsx
function useValidatedField(value, isRequired) {
  const [touched, setTouched] = useState(false); // always called, every render
  const isValid = !isRequired || value.length > 0;
  return { touched, setTouched, isValid };
}
```

This is a good moment to also recommend the team enable `eslint-plugin-react-hooks`'s `rules-of-hooks` rule in CI if it isn't already — it would have caught this exact conditional-hook-call pattern at write time, before it ever became a runtime crash reported by users.
