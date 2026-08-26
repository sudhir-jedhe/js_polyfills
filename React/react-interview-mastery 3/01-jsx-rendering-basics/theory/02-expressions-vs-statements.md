*** copy 02-expressions-vs-statements.md ***

# Expressions vs. Statements Inside JSX

Inside `{}` in JSX you can only use **expressions** (things that produce a value), never statements. `if`, `for`, and variable declarations don't work directly:

```jsx
// Broken — if is a statement
function Bad({ loggedIn }) {
  return <div>{ if (loggedIn) { 'Hi' } }</div>; // SyntaxError
}

// Fine — ternary is an expression
function Good({ loggedIn }) {
  return <div>{loggedIn ? 'Hi' : 'Please log in'}</div>;
}
```

If you need statement-level logic, pull it out above the `return`:

```jsx
function Good({ loggedIn, role }) {
  let message = 'Please log in';
  if (loggedIn && role === 'admin') {
    message = 'Welcome back, admin';
  } else if (loggedIn) {
    message = 'Welcome back';
  }
  return <div>{message}</div>;
}
```

This is why `{}` in JSX only ever accepts ternaries, `&&`/`||`, function calls, template literals, and other expression-forms — never `if`/`for`/`switch`/variable declarations directly inline. Reaching for an early `return` at the top of the component (see the lists-and-conditional-rendering theory file) is usually cleaner than nesting statement-level logic just to compute a single JSX expression.
