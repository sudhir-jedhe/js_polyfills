*** copy 05-spreading-props-to-forward-attributes.md ***

# Spreading Props to Forward Unrelated Attributes to the Underlying Element

```jsx
function PrimaryButton({ children, ...rest }) {
  return <button className="btn-primary" {...rest}>{children}</button>;
}
// usage: <PrimaryButton onClick={...} disabled>Save</PrimaryButton>
```
