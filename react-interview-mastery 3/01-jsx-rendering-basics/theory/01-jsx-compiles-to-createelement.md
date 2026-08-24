# JSX Compiles to `createElement`/`jsx()` Calls

JSX looks like HTML but it's syntactic sugar over function calls. When you write:

```jsx
const el = <h1 className="title">Hello</h1>;
```

Babel (or the TypeScript compiler) transforms it into either the classic form:

```jsx
const el = React.createElement('h1', { className: 'title' }, 'Hello');
```

or, with the modern automatic JSX runtime (React 17+), into a call to `jsx` imported automatically from `react/jsx-runtime`:

```jsx
import { jsx as _jsx } from 'react/jsx-runtime';
const el = _jsx('h1', { className: 'title', children: 'Hello' });
```

Either way, the result is a plain JavaScript object — a **React element** — describing what should be on screen: a type (string tag or component function), props, and children. It is not a DOM node. React elements are cheap, immutable descriptions; the actual DOM nodes are created and updated by React internally.

This is why `class` becomes `className` and `for` becomes `htmlFor` in JSX — they're just object property names being passed to `createElement`, not real HTML attributes.

## Classic runtime vs. automatic runtime

| Aspect | Classic (`React.createElement`) | Automatic (`jsx-runtime`, React 17+) |
|---|---|---|
| Import requirement | Must `import React from 'react'` in every JSX file | No React import needed just to use JSX |
| Output | `React.createElement(type, props, ...children)` | `jsx(type, { ...props, children })` (optimized `jsxs` for static children arrays) |
| Config | Default in older setups | Requires `"jsx": "react-jsx"` (TS) or a Babel preset config |

Use the automatic runtime for any modern project (Create React App, Vite, Next.js all default to it) — less boilerplate, slightly smaller bundles. The common mistake is assuming you can drop the `React` import while still on an older bundler/tsconfig that hasn't been switched to `react-jsx`, causing a "React is not defined" build error.
