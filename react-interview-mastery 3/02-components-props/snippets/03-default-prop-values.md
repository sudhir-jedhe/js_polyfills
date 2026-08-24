# Default Prop Values via Destructuring

```jsx
function Avatar({ size = 40, src, alt = 'user avatar' }) {
  return <img src={src} alt={alt} width={size} height={size} />;
}
```
