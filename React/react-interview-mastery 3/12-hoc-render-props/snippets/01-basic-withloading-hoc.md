# Snippet: Basic HOC That Injects a Loading Gate

```jsx
function withLoading(Wrapped) {
  return function WithLoading({ isLoading, ...rest }) {
    return isLoading ? <p>Loading...</p> : <Wrapped {...rest} />;
  };
}
const Greeting = ({ name }) => <p>Hello, {name}</p>;
const GreetingWithLoading = withLoading(Greeting);
// <GreetingWithLoading isLoading={false} name="Ada" /> -> "Hello, Ada"
```
