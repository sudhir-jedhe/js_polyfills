# A Global Boundary Forces a Full Refresh for a Recoverable Error

Your app has a global error boundary showing "Something went wrong, please refresh," but users are hitting it for a transient, recoverable issue (a flaky third-party script failing to load), and refreshing the whole page is a bad experience for what should be a quick retry. How do you improve this?

**Approach:** Give the boundary a reset mechanism instead of forcing a full page reload, and scope the boundary tighter around just the flaky dependency if possible:

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ThirdPartyWidgetFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>This widget failed to load: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ThirdPartyWidgetFallback}
      onReset={() => {
        // clear whatever bad state caused the failure before remounting children
        clearThirdPartyScriptCache();
      }}
    >
      <ThirdPartyEmbed />
    </ErrorBoundary>
  );
}
```

Scoping the boundary around just `ThirdPartyEmbed` (rather than the whole app) means a transient failure there no longer takes down unrelated parts of the page, and `resetErrorBoundary` re-mounts just that subtree for a quick retry without a full page refresh.
