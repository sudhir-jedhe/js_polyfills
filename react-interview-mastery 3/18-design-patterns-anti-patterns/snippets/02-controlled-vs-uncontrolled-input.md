# Controlled Input vs. Uncontrolled Input with a Ref

```jsx
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

function UncontrolledInput() {
  const ref = useRef(null);
  function handleSubmit() {
    console.log(ref.current.value); // read only when needed
  }
  return (
    <>
      <input ref={ref} defaultValue="" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```
