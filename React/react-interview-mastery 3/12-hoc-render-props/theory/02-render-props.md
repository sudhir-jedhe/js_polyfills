# Render Props

A render prop is a prop whose value is a **function that returns JSX**, letting the consumer decide what to render while the provider component controls the *logic/state*.

```jsx
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading });
}

// usage
<DataFetcher url="/api/user">
  {({ data, loading }) => (loading ? <Spinner /> : <h1>{data.name}</h1>)}
</DataFetcher>;
```

## `children` as function vs a named `render` prop

The prop doesn't have to be literally called `children` — `render={fn}` is equally common and was the more idiomatic name before children-as-function became popular. Functionally identical:

```jsx
<DataFetcher url="/api/user" render={({ data, loading }) => (
  loading ? <Spinner /> : <h1>{data.name}</h1>
)} />
```

| Aspect | `children` as function | Named `render` prop |
|---|---|---|
| Syntax | `<Comp>{(state) => <div/>}</Comp>` — reads like normal JSX children | `<Comp render={(state) => <div/>} />` — explicit prop name |
| Clarity | Can be confusing since `children` is usually elements, not a function — easy to misuse | Self-documenting; obvious at a glance that this prop is a render function |
| Common mistake | Mixing function children with regular element children on the same component (only one is valid at a time) | Forgetting `render` while also passing regular `children`, causing confusion about which one the component actually uses |

Functionally interchangeable — pick based on codebase convention; `render` is more explicit for newcomers, `children` reads more naturally at the call site.

## What is the render props pattern, in one sentence?

A pattern where a component accepts a function as a prop (commonly `children` or `render`) and calls that function — usually with some internal state — to determine what to render, letting the consumer control the UI while the provider controls the logic.
