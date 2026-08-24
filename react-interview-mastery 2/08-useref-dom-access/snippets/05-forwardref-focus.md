# Snippet: forwardRef so a parent can focus a custom input component

```jsx
const CustomInput = forwardRef(function CustomInput(props, ref) {
  return <input ref={ref} {...props} className="custom-input" />;
});

function Form() {
  const ref = useRef(null);
  return (
    <>
      <CustomInput ref={ref} placeholder="Name" />
      <button onClick={() => ref.current.focus()}>Focus name field</button>
    </>
  );
}
```
