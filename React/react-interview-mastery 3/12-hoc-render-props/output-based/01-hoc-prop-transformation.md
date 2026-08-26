# Output-Based: What Renders?

```jsx
function withUpperCase(Wrapped) {
  return function WithUpperCase({ text, ...rest }) {
    return <Wrapped text={text.toUpperCase()} {...rest} />;
  };
}
const Label = ({ text }) => <span>{text}</span>;
const UpperLabel = withUpperCase(Label);
function App() {
  return <UpperLabel text="hello" />;
}
```
**Answer:** `<span>HELLO</span>`

**Why:** The HOC intercepts `text`, transforms it, and passes the transformed value plus any remaining rest props down to `Label`. Straightforward prop transformation — no surprises here.
