# `useLayoutEffect` Measuring the DOM Before Paint to Avoid a Visible Flicker

```jsx
function Tooltip({ text }) {
  const ref = React.useRef(null);
  const [top, setTop] = React.useState(0);
  React.useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTop(-height - 8); // positioned before the browser paints
  }, [text]);
  return <div ref={ref} style={{ position: 'absolute', top }}>{text}</div>;
}
```
