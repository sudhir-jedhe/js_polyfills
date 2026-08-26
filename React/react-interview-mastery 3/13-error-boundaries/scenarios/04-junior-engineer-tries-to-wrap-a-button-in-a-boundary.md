# A Junior Engineer Wants to Wrap a Button's Click Handler in an `<ErrorBoundary>`

A senior engineer asks you to add error handling around a `<button onClick={handleCheckout}>` where `handleCheckout` can throw if payment validation fails. A junior engineer suggests wrapping the button in an `<ErrorBoundary>`. Why won't that work, and what should you do instead?

**Approach:** Explain that error boundaries don't catch event handler errors at all — the click handler executes outside any render/commit call stack the boundary could intercept, so wrapping the button changes nothing. Handle it with a local `try/catch` and turn the failure into UI state directly:

```jsx
function CheckoutButton() {
  const [error, setError] = useState(null);

  function handleCheckout() {
    try {
      validatePayment(); // may throw
      submitOrder();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
```

This is the correct pattern for expected, user-facing failures (validation errors) — surface them as regular UI state, not by trying to route them through an error boundary that structurally can't see them.
