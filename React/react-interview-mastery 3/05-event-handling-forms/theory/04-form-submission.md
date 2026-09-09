***  04-form-submission.md ***

# Form submission and `preventDefault`

The browser's default behavior for a `<form>` submission is a full-page navigation/reload — almost never what you want in a React app. Call `event.preventDefault()` in the `onSubmit` handler to stop it:

```jsx
function LoginForm() {
  function handleSubmit(e) {
    e.preventDefault(); // stop the default page reload/navigation
    // ...submit logic
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button type="submit">Log in</button>
    </form>
  );
}
```

Prefer attaching the handler to `onSubmit` on the `<form>` (triggered by pressing Enter in an input, or clicking a `type="submit"` button) rather than `onClick` on the button alone, so both interaction paths are covered.
