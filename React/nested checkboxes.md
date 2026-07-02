# Nested Checkboxes (Parent → Child → Grandchild)

This is a **very common React machine-coding interview question**.

## Requirements

✅ Parent checked → all children checked

✅ Parent unchecked → all children unchecked

✅ Child checked → parent becomes checked if all children checked

✅ Child unchecked → parent unchecked

✅ Indeterminate state

✅ Infinite nesting support

✅ Recursive solution

***

# Data Structure

```jsx
const data = [
  {
    id: 1,
    label: "Frontend",
    children: [
      {
        id: 2,
        label: "React",
      },
      {
        id: 3,
        label: "Angular",
      },
      {
        id: 4,
        label: "Vue",
      },
    ],
  },
  {
    id: 5,
    label: "Backend",
    children: [
      {
        id: 6,
        label: "Node",
      },
      {
        id: 7,
        label: "Java",
      },
    ],
  },
];
```

***

# Complete Solution

```jsx
import React, {
  useState,
  useRef,
  useEffect,
} from "react";

const data = [
  {
    id: 1,
    label: "Frontend",
    children: [
      {
        id: 2,
        label: "React",
      },
      {
        id: 3,
        label: "Angular",
      },
      {
        id: 4,
        label: "Vue",
      },
    ],
  },
  {
    id: 5,
    label: "Backend",
    children: [
      {
        id: 6,
        label: "Node",
      },
      {
        id: 7,
        label: "Java",
      },
    ],
  },
];

export default function App() {
  const [checked, setChecked] =
    useState(new Set());

  function getAllChildren(
    node
  ) {
    let ids = [node.id];

    if (node.children) {
      node.children.forEach(
        child => {
          ids = [
            ...ids,
            ...getAllChildren(
              child
            ),
          ];
        }
      );
    }

    return ids;
  }

  function handleCheck(
    node,
    isChecked
  ) {
    const allIds =
      getAllChildren(
        node
      );

    setChecked(prev => {
      const next =
        new Set(prev);

      allIds.forEach(id => {
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
    <div>
      <h1>
        Nested Checkboxes
      </h1>

      {data.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          checked={
            checked
          }
          onCheck={
            handleCheck
          }
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  checked,
  onCheck,
}) {
  const checkboxRef =
    useRef();

  const isChecked =
    checked.has(node.id);

  const children =
    node.children || [];

  const checkedChildren =
    children.filter(
      child =>
        checked.has(
          child.id
        )
    );

  const isIndeterminate =
    children.length > 0 &&
    checkedChildren.length >
      0 &&
    checkedChildren.length <
      children.length;

  useEffect(() => {
    if (
      checkboxRef.current
    ) {
      checkboxRef.current.indeterminate =
        isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div
      style={{
        paddingLeft:
          "20px",
      }}
    >
      <label>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={
            isChecked
          }
          onChange={e =>
            onCheck(
              node,
              e.target
                .checked
            )
          }
        />

        {node.label}
      </label>

      {children.map(
        child => (
          <TreeNode
            key={
              child.id
            }
            node={child}
            checked={
              checked
            }
            onCheck={
              onCheck
            }
          />
        )
      )}
    </div>
  );
}
```

***

# Advanced Production Solution

For enterprise apps:

```text
✅ Recursive Tree

✅ Indeterminate State

✅ Lazy Loaded Nodes

✅ Search Nodes

✅ Expand / Collapse

✅ Select All

✅ Virtualized Rendering

✅ Keyboard Accessibility

✅ Async Loading

✅ Drag & Drop
```

***

# Interview Follow-Up Questions

### Q1: How to make parent checked when all children checked?

```js
children.every(child =>
  checked.has(child.id)
)
```

***

### Q2: How to show partial selection?

```js
checkbox.indeterminate =
 true;
```

***

### Q3: Complexity?

### Toggle Parent

```text
O(n)
```

where:

```text
n = child nodes
```

***

### Toggle Child

```text
O(tree depth)
```

***

# Senior-Level Approach

Store state as:

```jsx
{
  1: true,
  2: true,
  3: false,
  4: true
}
```

instead of:

```jsx
Set()
```

for faster lookups and easier serialisation.

For very large trees (10k+ nodes), precompute:

```text
parent → children map

child → parent map
```

to achieve near O(depth) updates rather than traversing the entire tree on every change.
