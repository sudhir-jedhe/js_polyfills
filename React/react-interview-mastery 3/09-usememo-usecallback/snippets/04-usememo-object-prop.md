***  04-usememo-object-prop.md ***

# Snippet: useMemo to Avoid Recreating an Object Passed to a Memoized Child

```jsx
const Chart = React.memo(function Chart({ config }) {
  console.log('Chart render');
  return <canvas />;
});

function Dashboard({ data }) {
  const config = useMemo(() => ({ type: 'line', data }), [data]);
  return <Chart config={config} />;
}
```
