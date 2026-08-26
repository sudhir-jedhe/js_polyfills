*** copy 02-rendering-rules-and-syntax-qa.md ***

# Interview Q&A — Rendering Rules and Syntax

**Q: Why can't you return two sibling elements from a component without a wrapper?**
Because JSX compiles to a single function call that returns one value. `<A /><B />` isn't a JSX expression at all — it's two separate expressions with no top-level container, which is invalid syntax. Wrap them in a real DOM element or in a `Fragment` (`<>...</>`) to satisfy the "single root" requirement without adding an unwanted DOM node.

**Q: Can you put an `if` statement directly inside JSX curly braces?**
No — `{}` in JSX only accepts expressions, and `if` is a statement, not an expression. You either compute the value before the `return` using a normal `if`, use an expression-based construct like a ternary or `&&` inside the JSX, or use an early `return` at the top of the component to skip rendering the rest of the tree.
