*** copy 07-measure-element-on-click.md ***

# Snippet: Reading an element's size after layout, without storing it in re-render-triggering state

```jsx
function MeasureOnClick() {
  const boxRef = useRef(null);

  const logSize = () => {
    const rect = boxRef.current.getBoundingClientRect();
    console.log(rect.width, rect.height);
  };

  return (
    <div>
      <div ref={boxRef} style={{ width: '50%', height: 100, background: '#eee' }} />
      <button onClick={logSize}>Log size</button>
    </div>
  );
}
```
