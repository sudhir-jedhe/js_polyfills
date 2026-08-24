Here is a complete, scalable solution for **Nested Checkboxes with Indeterminate State** (a common Google Frontend System Design / UI coding interview question).

---

### Key Requirements & State Rules

1. **Top-Down Cascading**: Checking/unchecking a parent node automatically sets the same checked state on **all descendants**.
2. **Bottom-Up Propagation**: A parent's state is derived from its children:

* **All children checked** $\rightarrow$ Parent is **checked** (`checked = true`, `indeterminate = false`).
* **No children checked** $\rightarrow$ Parent is **unchecked** (`checked = false`, `indeterminate = false`).
* **Some (but not all) children checked OR any child is indeterminate** $\rightarrow$ Parent is **indeterminate** (`checked = false`, `indeterminate = true`).

1. **DOM Quirk**: The `indeterminate` state in HTML cannot be set via an HTML attribute (like `<input indeterminate />`). It must be set programmatically via JavaScript property (`inputElement.indeterminate = true`).

---

### Solution 1: React Implementation

#### 1. Recursive Data Structure & Tree Component

```tsx
import React, { useEffect, useRef } from 'react';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export type CheckedStateMap = Record<string, boolean>; // id -> isChecked

interface IndeterminateCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
}

// Custom Checkbox that safely applies the DOM .indeterminate property
const Checkbox: React.FC<IndeterminateCheckboxProps> = ({
  id,
  label,
  checked,
  indeterminate,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none py-1">
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
};

```

---

#### 2. Tree Traversal & State Computation Engine

```tsx
// Helper: Collect all descendant IDs under a node (including itself)
function getAllDescendantIds(node: TreeNode): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
}

// Helper: Determine node's { checked, indeterminate } state based on descendants
function getNodeStatus(
  node: TreeNode,
  checkedMap: CheckedStateMap
): { checked: boolean; indeterminate: boolean } {
  // Leaf node
  if (!node.children || node.children.length === 0) {
    return {
      checked: Boolean(checkedMap[node.id]),
      indeterminate: false,
    };
  }

  // Intermediate node: Evaluate all children recursively
  let checkedCount = 0;
  let hasIndeterminateChild = false;

  for (const child of node.children) {
    const childStatus = getNodeStatus(child, checkedMap);
    if (childStatus.checked) checkedCount++;
    if (childStatus.indeterminate) hasIndeterminateChild = true;
  }

  const allChecked = checkedCount === node.children.length;
  const noneChecked = checkedCount === 0;

  if (allChecked) {
    return { checked: true, indeterminate: false };
  }
  if (noneChecked && !hasIndeterminateChild) {
    return { checked: false, indeterminate: false };
  }

  // Partially checked
  return { checked: false, indeterminate: true };
}

```

---

#### 3. Main Recursive Tree View

```tsx
interface NestedCheckboxesProps {
  data: TreeNode[];
}

export const NestedCheckboxes: React.FC<NestedCheckboxesProps> = ({ data }) => {
  const [checkedMap, setCheckedMap] = React.useState<CheckedStateMap>({});

  const handleToggle = (node: TreeNode, nextChecked: boolean) => {
    const descendantIds = getAllDescendantIds(node);
    setCheckedMap((prev) => {
      const next = { ...prev };
      for (const id of descendantIds) {
        next[id] = nextChecked;
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode) => {
    const { checked, indeterminate } = getNodeStatus(node, checkedMap);

    return (
      <div key={node.id} className="ml-5">
        <Checkbox
          id={node.id}
          label={node.label}
          checked={checked}
          indeterminate={indeterminate}
          onChange={(newChecked) => handleToggle(node, newChecked)}
        />
        {node.children && node.children.length > 0 && (
          <div className="border-l border-gray-200 ml-2 pl-2">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 max-w-md">
      {data.map(renderNode)}
    </div>
  );
};

```

---

### Solution 2: Vanilla JavaScript (DOM Tree Traversal)

If the interviewer asks for a zero-framework Vanilla JS implementation using DOM event delegation:

```html
<div id="tree-container">
  <ul class="tree">
    <li>
      <input type="checkbox" id="root" /> <label for="root">Select All</label>
      <ul>
        <li>
          <input type="checkbox" id="c1" /> <label for="c1">Electronics</label>
          <ul>
            <li><input type="checkbox" id="c1_1" /> <label for="c1_1">Phones</label></li>
            <li><input type="checkbox" id="c1_2" /> <label for="c1_2">Laptops</label></li>
          </ul>
        </li>
        <li>
          <input type="checkbox" id="c2" /> <label for="c2">Clothing</label>
          <ul>
            <li><input type="checkbox" id="c2_1" /> <label for="c2_1">Shirts</label></li>
            <li><input type="checkbox" id="c2_2" /> <label for="c2_2">Shoes</label></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>

<script>
const container = document.getElementById('tree-container');

container.addEventListener('change', (e) => {
  if (e.target.type !== 'checkbox') return;

  const currentCheckbox = e.target;
  const isChecked = currentCheckbox.checked;

  // 1. Cascade DOWN to all child checkboxes
  const parentLi = currentCheckbox.closest('li');
  const childCheckboxes = parentLi.querySelectorAll('ul input[type="checkbox"]');
  childCheckboxes.forEach((child) => {
    child.checked = isChecked;
    child.indeterminate = false;
  });

  // 2. Bubble UP to all parent checkboxes
  let parentUl = parentLi.parentElement.closest('ul');
  while (parentUl && parentUl.classList.contains('tree') === false) {
    const parentContainerLi = parentUl.closest('li');
    if (!parentContainerLi) break;

    const parentBox = parentContainerLi.querySelector(':scope > input[type="checkbox"]');
    const siblingBoxes = parentContainerLi.querySelectorAll(':scope > ul > li > input[type="checkbox"]');

    let checkedCount = 0;
    let hasIndeterminate = false;

    siblingBoxes.forEach((box) => {
      if (box.checked) checkedCount++;
      if (box.indeterminate) hasIndeterminate = true;
    });

    if (checkedCount === siblingBoxes.length) {
      parentBox.checked = true;
      parentBox.indeterminate = false;
    } else if (checkedCount === 0 && !hasIndeterminate) {
      parentBox.checked = false;
      parentBox.indeterminate = false;
    } else {
      parentBox.checked = false;
      parentBox.indeterminate = true;
    }

    parentUl = parentContainerLi.parentElement.closest('ul');
  }
});
</script>

```

---

### Sample Test Data

```typescript
const mockCategories: TreeNode[] = [
  {
    id: 'all',
    label: 'All Departments',
    children: [
      {
        id: 'electronics',
        label: 'Electronics',
        children: [
          { id: 'phones', label: 'Smartphones' },
          { id: 'laptops', label: 'Laptops' },
          { id: 'accessories', label: 'Accessories' },
        ],
      },
      {
        id: 'clothing',
        label: 'Clothing',
        children: [
          { id: 'men', label: "Men's Apparel" },
          { id: 'women', label: "Women's Apparel" },
        ],
      },
    ],
  },
];

```

---

### System Design / Interview Follow-Up Discussion Points

* **Handling $100{,}000+$ Nodes (Virtualization)**: Instead of recursive tree rendering, flatten the tree into a linear list with indentation levels (`depth: number`) and render with `@tanstack/react-virtual`.
* **State Normalization**: For $O(1)$ lookups and bottom-up traversal without deep recursion, store the tree normalized in memory:

```typescript
interface FlatTreeState {
  nodes: Record<string, { id: string; parentId: string | null; childrenIds: string[] }>;
  checkedIds: Set<string>;
}

```

* **Accessibility (a11y)**:
* Use ARIA tree view roles (`role="tree"`, `role="treeitem"`, `role="group"`).
* Use `aria-checked="mixed"` alongside DOM `indeterminate = true` for complete screen reader compliance.
