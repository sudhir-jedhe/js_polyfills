*** copy 01-jsx-compilation-and-elements-qa.md ***

# Interview Q&A — JSX Compilation and Elements

**Q: What is JSX, and does the browser understand it directly?**
No. JSX is a syntax extension that isn't valid JavaScript on its own — browsers can't execute it. A build tool (Babel, the TypeScript compiler, esbuild/SWC) transpiles it into plain function calls, either `React.createElement(type, props, children)` or, with the modern automatic runtime, calls to `jsx`/`jsxs` from `react/jsx-runtime`. Those calls return plain JavaScript objects (React elements) describing the UI, which is what actually ships to the browser.

**Q: What's the difference between a React element and a component?**
An element is a plain, immutable object describing what to render (`{ type, props }`) — cheap to create, thrown away every render. A component is a function (or class) that takes props and returns elements. You render components by referencing them in JSX (`<MyComponent />`), which produces an element whose `type` is the function itself; React later calls that function to figure out what to actually render.

**Q: Is `className` the same thing in JSX as `class` in HTML?**
Functionally, yes — it sets the CSS class — but the prop is literally named `className` in JSX because JSX props are just JavaScript object keys passed to `createElement`, and `class` is a reserved word in JavaScript. Similarly `for` becomes `htmlFor`. This is a common source of confusion for developers copy-pasting HTML directly into JSX.
