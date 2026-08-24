# Output-Based: What's Wrong With This HOC, and What Breaks at Runtime?

```jsx
function withData(Wrapped) {
  Wrapped.defaultProps = { data: [] }; // mutating the original component
  return function WithData(props) {
    return <Wrapped {...props} />;
  };
}
const List = ({ data }) => <ul>{data.map((d, i) => <li key={i}>{d}</li>)}</ul>;
const EnhancedList = withData(List);
// elsewhere in the app, someone also renders <List /> directly (unwrapped)
```
**Answer:** Nothing crashes immediately, but `<List />` rendered directly elsewhere now also gets `defaultProps = { data: [] }` — a side effect the author of that other usage never opted into.

**Why:** The HOC mutates the original `Wrapped` component object instead of only configuring the new wrapper it returns. Because `List` is the *same reference* everywhere it's imported, mutating it leaks the HOC's behavior to every consumer, including ones that never call `withData`. HOCs should treat the wrapped component as read-only and only add behavior on the new component they create.
