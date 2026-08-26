# QA Reports a Silent Failure From a Rejected Promise in `useEffect`

QA reports that when a network request fails inside a `useEffect`, the app doesn't show any error — it just silently shows a stale/empty state, and no error boundary catches it. Why, and how do you fix it?

**Approach:** Error boundaries never catch errors from async code — a rejected promise inside `useEffect` happens outside React's render call stack, so `getDerivedStateFromError`/`componentDidCatch` simply never see it. Fix by catching the rejection explicitly and turning it into React state, which *will* trigger a normal re-render (and can even be re-thrown during render to let a boundary handle it uniformly):

```jsx
function UserProfile({ userId }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });
    fetchUser(userId)
      .then(data => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch(error => { if (!cancelled) setState({ status: 'error', data: null, error }); });
    return () => { cancelled = true; };
  }, [userId]);

  if (state.status === 'error') {
    // re-throw during render so the nearest error boundary handles it uniformly
    throw state.error;
  }
  if (state.status === 'loading') return <Spinner />;
  return <h1>{state.data.name}</h1>;
}
```

This "throw during render" trick is exactly what `react-error-boundary`'s `useErrorHandler` does under the hood — it bridges an async error into React's synchronous render phase so an existing error boundary can catch and display it consistently with render-time errors.
