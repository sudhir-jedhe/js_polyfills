# Function Components and Props

A React function component is just a function that takes `props` and returns JSX (or `null`). That's the whole contract:

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// usage
<Greeting name="Ada" />
```

React calls this function on every render, passing a new `props` object each time. Destructuring in the signature is the idiomatic style:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

## Props vs. state

| Aspect | Props | State |
|---|---|---|
| Owner | Passed in from parent | Owned/managed by the component itself |
| Mutability | Read-only from the receiving component's perspective | Mutable via its setter function |
| Who triggers updates | Parent re-renders and passes new props | Component calls its own `useState`/`useReducer` setter |

Use props for data a component receives from outside; use state for data a component manages internally. The common mistake is copying an incoming prop into local state (`useState(props.value)`) as a way to "modify" it locally, which desyncs from the parent and is usually better solved by lifting the state up or using a callback prop (see the `03-state-usestate` topic for the mechanics of `useState` itself).
