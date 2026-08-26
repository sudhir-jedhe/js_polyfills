# A Form's Derived "Is Valid" State Gets Out of Sync After a Bug Report

A signup form uses `useEffect` to compute `isFormValid` whenever any field changes, storing it in its own state variable. QA reports that after fixing a validation rule, the submit button is sometimes enabled for a split second on invalid data before flipping back to disabled.

**Approach:** The root cause is storing a derivable value (`isFormValid`) in its own state instead of computing it during render — the effect-based sync always lags one render behind the fields that actually changed, creating the flash QA saw. Remove the effect and compute validity directly in the render body.

```jsx
// Before
const [isFormValid, setIsFormValid] = useState(false);
useEffect(() => {
  setIsFormValid(email.includes("@") && password.length >= 8);
}, [email, password]);

// After
const isFormValid = email.includes("@") && password.length >= 8;
```

Since `isFormValid` is now computed fresh every render from the current `email`/`password` values, there's no intermediate render where it reflects stale field values — the flash disappears because there's no longer a separate state variable that can be out of sync with its inputs, and one fewer render cycle happens on every keystroke.
