***  01-jsx-compiles-to-createelement.md ***

# JSX Compiles to `createElement`/`jsx()` Calls

```jsx
// JSX compiles to createElement / jsx() calls — these two are equivalent
const a = <p id="x">Hi</p>;
const b = React.createElement('p', { id: 'x' }, 'Hi');
```
