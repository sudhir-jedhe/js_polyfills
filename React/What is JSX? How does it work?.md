*** copy What is JSX? How does it work?.md ***

**JSX (JavaScript XML)** is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside JavaScript files. It is not standard JavaScript and cannot be executed directly by browsers; it is syntactic sugar designed to produce React Elements.

---

**How JSX Works: The Compilation Pipeline**

JSX undergoes a two-step lifecycle: build-time compilation into plain JavaScript function calls, followed by runtime evaluation into in-memory Virtual DOM objects.

```
       [JSX Code]
  <div className="card">
    <h1>Hello</h1>
  </div>
          │
          ▼  (Babel / SWC / esbuild)
  [Transpiled JavaScript]
  jsx("div", {
    className: "card",
    children: jsx("h1", { children: "Hello" })
  })
          │
          ▼  (Browser Execution)
  [React Element Tree (Plain JS Object)]
  {
    $$typeof: Symbol(react.element),
    type: "div",
    props: { className: "card", children: ... }
  }
          │
          ▼  (React Fiber Reconciliation)
       [Real DOM]

```

---

**Under the Hood: Classic vs. Modern Compilation**

Depending on your React version and compiler settings, JSX transforms in one of two ways:

* **Classic Transform (`React.createElement` — React 16 and earlier)**
* Requires `import React from 'react'` in every file using JSX.
* Translates `<h1 id="title">Hello</h1>` to `React.createElement('h1', { id: 'title' }, 'Hello')`.

* **Modern Transform (`react/jsx-runtime` — React 17+)**
* Does **not** require importing `React` into scope just for JSX.
* The compiler automatically injects an internal import:

```javascript
import { jsx as _jsx } from 'react/jsx-runtime';

const element = _jsx('h1', { id: 'title', children: 'Hello' });

```

* Passes `children` directly inside the props object rather than as trailing arguments, reducing object allocation overhead.

---

**Core Rules & Mechanics**

* **Expressions inside `{}`:** Any valid JavaScript expression (variables, function calls, ternary operators, map functions) can be embedded inside curly braces.
* **Capitalization Determines Type:**
* Lowercase tags (`<div />`, `<span />`) compile with a string tag name (`"div"`), telling React to create a native DOM node.
* Capitalized tags (`<Card/>`, `<UserProfile/>`) compile with the identifier itself (`Card`), telling React to instantiate or invoke that component function/class.

* **Attribute Mapping:** Because JSX maps to JavaScript properties rather than HTML attributes, naming conventions use camelCase (e.g., `className` instead of `class`, `htmlFor` instead of `for`, `onClick` instead of `onclick`).
* **Single Root Requirement:** A JSX expression must return a single root element (or a `<React.Fragment>` / `<>...</>`) because a JavaScript function can only return a single value/object at a time.
