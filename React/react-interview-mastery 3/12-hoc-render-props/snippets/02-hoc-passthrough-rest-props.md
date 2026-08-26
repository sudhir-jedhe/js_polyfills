# Snippet: HOC Passing Through Extra Props With `...rest`

```jsx
function withBorder(Wrapped) {
  return function WithBorder({ borderColor = 'black', ...rest }) {
    return (
      <div style={{ border: `1px solid ${borderColor}` }}>
        <Wrapped {...rest} />
      </div>
    );
  };
}
const Card = ({ title }) => <div>{title}</div>;
const BorderedCard = withBorder(Card);
// <BorderedCard title="Hi" borderColor="red" /> renders bordered <div>Hi</div>
```
