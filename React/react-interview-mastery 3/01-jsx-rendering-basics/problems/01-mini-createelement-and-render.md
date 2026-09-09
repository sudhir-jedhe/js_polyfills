***  01-mini-createelement-and-render.md ***

# Problem: Implement a Minimal `createElement` + `render`

## Problem Statement

Implement a simplified `createElement(type, props, ...children)` function that builds a plain-object "virtual node" (vnode) the same shape JSX compiles down to, and a `render(vnode, container)` function that walks that vnode tree and produces real DOM nodes inside `container`. This is a from-scratch proof that you understand what JSX actually compiles into and how a minimal virtual-DOM-to-real-DOM renderer works — it is intentionally not a full reimplementation of React (no reconciliation/diffing, no components, no state).

## Requirements

- `createElement(type, props, ...children)` returns `{ type, props: { ...props, children } }`, matching the shape `React.createElement` produces.
- `type` is always a string tag (`'div'`, `'h1'`, etc.) — component functions are out of scope for this minimal version.
- Children can be nested arrays (from `.map()`), strings, numbers, `null`/`undefined`/`false` (should be skipped), or other vnodes — flatten and filter appropriately.
- `render(vnode, container)` creates the real DOM tree for `vnode` and appends it into `container`, recursively rendering children and applying props (including event handlers like `onClick` and plain attributes like `className`).
- Text/number children become real DOM text nodes.

## Approach

`createElement` just packages its arguments into an object — no DOM work happens at element-creation time, mirroring how JSX/React elements are cheap, inert descriptions. All the real work happens in `render`, which pattern-matches on the vnode: primitives (string/number) become text nodes, `null`/`undefined`/`boolean` are skipped entirely (mirroring React's actual rendering rules), and object vnodes create a real element via `document.createElement`, apply props, then recursively render and append each child.

## Solution

```jsx
// createElement: packages type/props/children into a plain vnode object,
// exactly like what JSX compiles to under the hood.
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // Flatten nested arrays (from .map()) and drop nullish/boolean children,
      // matching React's actual "don't render these" rules.
      children: children.flat(Infinity).filter(
        (child) => child !== null && child !== undefined && typeof child !== 'boolean'
      ),
    },
  };
}

// applyProp: sets a single prop on a real DOM node, special-casing event
// handlers (onClick -> click) and className.
function applyProp(node, name, value) {
  if (name === 'children') return; // handled separately by render()
  if (name.startsWith('on') && typeof value === 'function') {
    const eventName = name.slice(2).toLowerCase();
    node.addEventListener(eventName, value);
  } else if (name === 'className') {
    node.setAttribute('class', value);
  } else if (name === 'style' && typeof value === 'object') {
    Object.assign(node.style, value);
  } else {
    node.setAttribute(name, value);
  }
}

// render: turns a vnode (or primitive) into a real DOM node and appends it
// into `container`. No diffing — every call does a full fresh build.
function render(vnode, container) {
  // Text-like leaves: string/number children.
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    container.appendChild(document.createTextNode(String(vnode)));
    return;
  }

  // Skip nullish/boolean vnodes, exactly like React does for {cond && null} etc.
  if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
    return;
  }

  const { type, props } = vnode;
  const domNode = document.createElement(type);

  Object.keys(props).forEach((name) => {
    if (name !== 'children') applyProp(domNode, name, props[name]);
  });

  props.children.forEach((child) => render(child, domNode));

  container.appendChild(domNode);
}

// --- verification ---
// Equivalent to: <div className="card"><h1>Hello</h1><p>{0}</p>{null}</div>
const vnode = createElement(
  'div',
  { className: 'card' },
  createElement('h1', null, 'Hello'),
  createElement('p', null, 0), // numbers (even 0) are rendered as text
  null // skipped entirely, like React does
);

const root = document.createElement('div');
render(vnode, root);
console.log(root.innerHTML);
// '<div class="card"><h1>Hello</h1><p>0</p></div>'
```

**Why this works:** Separating `createElement` (pure data construction) from `render` (the only function that touches the DOM) mirrors React's actual architecture — elements are cheap descriptions, and only the renderer decides how to turn them into DOM operations. Filtering out `null`/`undefined`/booleans at both `createElement` and `render` time matches React's real behavior for expressions like `{condition && <X />}` when `condition` is `false`.

**Known limitation:** this has no diffing/reconciliation — every `render` call tears down nothing and just appends fresh nodes, so calling it twice on the same container duplicates content. A real implementation would need to diff against the previous tree (see the `04-virtual-dom-reconciliation-and-keys.md` theory file for what that involves) and it has no concept of component functions or state, both of which are the next layer up from what's demonstrated here.
