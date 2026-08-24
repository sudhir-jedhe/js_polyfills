# Snippet: Setting `displayName` for Debuggable HOCs

```jsx
function withLogger(Wrapped) {
  function WithLogger(props) {
    console.log('rendering', Wrapped.name, props);
    return <Wrapped {...props} />;
  }
  WithLogger.displayName = `withLogger(${Wrapped.displayName || Wrapped.name})`;
  return WithLogger;
}
```
