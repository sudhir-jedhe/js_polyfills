# Problem: Demonstrate What an Error Boundary Does NOT Catch

**Requirements:**
- Show a component whose event handler throws, wrapped in an `<ErrorBoundary>`, to demonstrate the boundary does nothing for it.
- Show the correct fix: a `try/catch` inside the handler that turns the failure into local UI state.

## The broken assumption

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <p>Fallback UI</p> : this.props.children;
  }
}

function RiskyButton() {
  function handleClick() {
    throw new Error('Payment validation failed');
  }
  return <button onClick={handleClick}>Pay now</button>;
}

function App() {
  return (
    <ErrorBoundary>
      <RiskyButton />
    </ErrorBoundary>
  );
}
```

Clicking the button throws an **uncaught** exception in the console. The boundary's fallback never appears — `getDerivedStateFromError`/`componentDidCatch` are only invoked for errors thrown during React's render/commit/lifecycle call stack, and a click handler executes completely outside of that.

## The correct fix: `try/catch` in the handler

```jsx
function RiskyButton() {
  const [error, setError] = useState(null);

  function handleClick() {
    try {
      validatePayment(); // may throw
      submitPayment();
    } catch (err) {
      setError(err.message); // convert the failure into React state
    }
  }

  return (
    <div>
      <button onClick={handleClick}>Pay now</button>
      {error && <p role="alert" className="error-text">{error}</p>}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <RiskyButton />
    </ErrorBoundary>
  );
}
```

**Notes:**
- The boundary is still useful here as a safety net for genuinely unexpected render errors elsewhere in the tree — it just isn't the right tool for expected, user-triggered failures like a validation error in a click handler.
- If you want a *single, uniform* error UI for both render errors and event-handler errors, catch the event handler's error, store it in state, then `throw` it during the next render (`if (error) throw error;`). That converts it into a render-phase error the boundary above genuinely can catch — this is what `react-error-boundary`'s `useErrorHandler` does under the hood.
