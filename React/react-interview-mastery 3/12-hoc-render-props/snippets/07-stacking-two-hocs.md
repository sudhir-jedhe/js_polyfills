# Snippet: Stacking Two HOCs (Showing the Wrapper Nesting Hooks Avoid)

```jsx
const Enhanced = withLoading(withBorder(Greeting));
// Tree in DevTools: WithLoading > WithBorder > Greeting
// <Enhanced isLoading={false} borderColor="blue" name="Ada" />
```
