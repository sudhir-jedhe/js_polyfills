# Nested Checkbox Tree Component in React

## Frontend System Design + Complete Interview-Ready Code

Nested checkbox trees are used in:

```txt
Google Drive (permissions)
File Managers
Multi-select Filters
Product Categories
Amazon Filters
Role/Permission UI
Menu Hierarchies
Notion Sidebar
```

Interviewers ask this because it tests:

✅ Recursion

✅ Immutable data updates

✅ Parent → Child selection

✅ Child → Parent selection

✅ Indeterminate state

✅ Tree traversal

✅ Reusability

✅ Accessibility

---

# 1. Requirements

## Functional

✅ Render nested tree

✅ Toggle nodes (expand / collapse)

✅ Check parent → checks all children

✅ Uncheck parent → unchecks all children

✅ Checking all children → parent auto-checks

✅ Some children checked → parent indeterminate

✅ Reusable component

✅ Recursive rendering

Optional:

✅ Show count of selected items

✅ Search filter

✅ Persist in localStorage

✅ Keyboard support

✅ Icons

---

# 2. Data Structure

```js
const initialTree = [
  {
    id: "1",
    name: "Fruits",
    children: [
      {
        id: "1-1",
        name: "Apple",
      },
      {
        id: "1-2",
        name: "Banana",
      },
      {
        id: "1-3",
        name: "Citrus",
        children: [
          {
            id: "1-3-1",
            name: "Orange",
          },
          {
            id: "1-3-2",
            name: "Lemon",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Vegetables",
    children: [
      {
        id: "2-1",
        name: "Carrot",
      },
      {
        id: "2-2",
        name: "Broccoli",
      },
    ],
  },
];
```

---

# 3. Component Structure

```txt
App
│
└── CheckboxTree
     │
     └── TreeNode (Recursive)
          ├── Checkbox
          ├── Label
          └── TreeNode (child)
```

Recursive rendering.

---

# 4. State Design

We store a **Set of checked node ids**:

```jsx
const [checked, setChecked] = useState(new Set());
```

Why Set?

✅ O(1) lookup

✅ Fast add/remove

✅ Easy checks

---

# 5. Utility Functions

## Get All Descendant IDs

```js
function getDescendantIds(node) {
  const ids = [];

  function traverse(n) {
    ids.push(n.id);

    (n.children || []).forEach(traverse);
  }

  traverse(node);

  return ids;
}
```

---

## Get All Parents Path

Used to update parent indeterminate state.

Example:

```txt
Node ID: 1-3-1
Parents: [1-3, 1]
```

---

## Find Node

Recursive search:

```js
function findNode(tree, id) {
  for (const node of tree) {
    if (node.id === id) {
      return node;
    }

    if (node.children) {
      const found = findNode(node.children, id);

      if (found) return found;
    }
  }

  return null;
}
```

---

## Determine Node State

```js
function getNodeState(node, checked) {
  const descendants = getDescendantIds(node).filter((id) => id !== node.id);

  if (descendants.length === 0) {
    return {
      isChecked: checked.has(node.id),
      isIndeterminate: false,
    };
  }

  const total = descendants.length;

  const checkedCount = descendants.filter((id) => checked.has(id)).length;

  return {
    isChecked: checkedCount === total,
    isIndeterminate: checkedCount > 0 && checkedCount < total,
  };
}
```

---

# 6. TreeNode Component (Recursive)

```jsx
import { useState } from "react";

export default function TreeNode({ node, checked, onToggle }) {
  const [expanded, setExpanded] = useState(true);

  const { isChecked, isIndeterminate } = getNodeState(node, checked);

  const hasChildren = node.children?.length > 0;

  return (
    <div className="tree-node">
      <div className="row">
        {hasChildren ? (
          <button
            className="toggle"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "▼" : "▶"}
          </button>
        ) : (
          <span className="dot">•</span>
        )}

        <input
          type="checkbox"
          checked={isChecked}
          ref={(el) => {
            if (el) {
              el.indeterminate = isIndeterminate;
            }
          }}
          onChange={() => onToggle(node, !isChecked)}
        />

        <label>{node.name}</label>
      </div>

      {expanded && hasChildren && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checked={checked}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

# 7. Main App

```jsx
import { useState } from "react";
import TreeNode from "./TreeNode";

import "./styles.css";

const initialTree = [
  /* ... */
];

export default function App() {
  const [checked, setChecked] = useState(new Set());

  function handleToggle(node, isChecked) {
    const descendantIds = getDescendantIds(node);

    setChecked((prev) => {
      const next = new Set(prev);

      descendantIds.forEach((id) => {
        if (isChecked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });

      return next;
    });
  }

  return (
    <div className="container">
      <h2>Category Filter</h2>

      {initialTree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          checked={checked}
          onToggle={handleToggle}
        />
      ))}

      <hr />

      <h4>Selected</h4>

      <p>{[...checked].join(", ") || "None"}</p>
    </div>
  );
}
```

---

# 8. CSS

```css
.container {
  padding: 20px;
  font-family: Arial;
  max-width: 500px;

  background: white;
  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.tree-node {
  margin: 4px 0;
}

.row {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 4px;
  border-radius: 4px;
}

.row:hover {
  background: #f3f4f6;
}

.toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.dot {
  width: 12px;
  color: #9ca3af;
}

.children {
  margin-left: 22px;
}
```

---

# 9. How It Works

```txt
User Toggles Node
       ↓
Get all descendant ids
       ↓
Add/remove from Set
       ↓
Recompute parent states
       ↓
Render updated tree
```

---

# 10. Node State Logic

Consider this tree:

```txt
Fruits
├── Apple ✓
├── Banana ✓
└── Citrus
    ├── Orange
    └── Lemon
```

If both Apple + Banana are checked but Citrus children are not:

```txt
Fruits → indeterminate
Apple → checked
Banana → checked
Citrus → unchecked
```

If Apple + Banana + Orange + Lemon all checked:

```txt
Fruits → checked
```

Handled by:

```jsx
isChecked && isIndeterminate;
```

---

# 11. Behaviour Examples

## Check Parent

```txt
Check Fruits
 ↓
All children auto-checked
```

## Uncheck Parent

```txt
Uncheck Fruits
 ↓
All descendants unchecked
```

## Check Some Children

```txt
Only Apple + Banana ✓
 ↓
Fruits = indeterminate
```

## Check All Children

```txt
All children ✓
 ↓
Fruits auto-checked
```

Common behaviour used in:

```txt
Amazon filters
Gmail label picker
Notion tags
```

---

# 12. Complexity

## Toggle

```txt
O(k) where k = descendants
```

## Get Node State

```txt
O(k)
```

## Rendering

```txt
O(n) — nodes in tree
```

Efficient for practical trees.

---

# 13. Advanced Extensions

✅ Search bar to filter nodes

✅ Highlight matches

✅ Load lazy (large trees)

✅ Virtualization using react-window

✅ Save state to localStorage

✅ Sync selection to backend

✅ Keyboard navigation (Arrow keys)

✅ Right-click context menu

✅ Drag & Drop reordering

✅ Custom icons per node

✅ Nested undo/redo

---

# 14. Accessibility

✅ Use `<label>` around checkbox

✅ Provide keyboard support

✅ Use ARIA:

```txt
role="treeitem"
role="group"
aria-checked
aria-expanded
```

Example:

```jsx
<div
  role="treeitem"
  aria-checked={isChecked}
  aria-expanded={expanded}
>
```

---

# 15. Optional: Persist Selection

```jsx
useEffect(() => {
  localStorage.setItem("tree-checked", JSON.stringify([...checked]));
}, [checked]);
```

Load on mount:

```jsx
const [checked, setChecked] = useState(() => {
  const saved = localStorage.getItem("tree-checked");

  return saved ? new Set(JSON.parse(saved)) : new Set();
});
```

---

# 16. Data Flow Diagram

```txt
User clicks checkbox
        ↓
Compute descendant ids
        ↓
Update Set state
        ↓
Recursive rerender
        ↓
Compute parent states
        ↓
Update indeterminate & checked visuals
```

---

# 17. Senior React Interview Answer

> I would design a nested checkbox tree using a recursive `TreeNode` component and a normalized selection state stored in a `Set` for O(1) lookups. Toggling a parent updates all its descendants using a recursive traversal, while parent state (`checked` or `indeterminate`) is derived from the count of selected descendants. This ensures full consistency between parent and children without duplicating state. For scalability, I'd support search filtering, virtualization for large trees, ARIA-based accessibility, keyboard navigation, and persistence via localStorage or backend APIs. This is the same architecture used in tools like Amazon category filters, Notion sidebar, and Gmail label management.
