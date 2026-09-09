***  nested checkbox.md ***

A complete, recursive **Nested Checkbox Tree** component in React supporting infinite nesting, cascading parent-to-child selections, child-to-parent synchronization, and the HTML `indeterminate` state (partial selection).

---

### 1. Nested Checkbox Component (`CheckboxTree.jsx`)

```jsx
import React, { useState, useRef, useEffect } from 'react';

// Sample Recursive Data Structure
const INITIAL_DATA = {
  id: 'root',
  label: 'All Permissions',
  children: [
    {
      id: 'dashboard',
      label: 'Dashboard Access',
      children: [
        { id: 'analytics', label: 'View Analytics' },
        { id: 'reports', label: 'Export Reports' },
      ],
    },
    {
      id: 'settings',
      label: 'System Settings',
      children: [
        {
          id: 'users',
          label: 'User Management',
          children: [
            { id: 'create_user', label: 'Create Users' },
            { id: 'delete_user', label: 'Delete Users' },
          ],
        },
        { id: 'billing', label: 'Manage Billing' },
      ],
    },
  ],
};

// Helper: Collect all descendant IDs under a node
function getAllDescendantIds(node) {
  let ids = [];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(child.id);
      ids = ids.concat(getAllDescendantIds(child));
    });
  }
  return ids;
}

// Single Recursive Node
function TreeNode({ node, checkedState, onToggle }) {
  const checkboxRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = Boolean(node.children && node.children.length > 0);

  // Compute selection stats for descendants
  const descendantIds = getAllDescendantIds(node);
  const totalDescendants = descendantIds.length;
  const checkedDescendants = descendantIds.filter((id) => checkedState[id]).length;

  const isChecked = hasChildren
    ? checkedDescendants === totalDescendants && totalDescendants > 0
    : Boolean(checkedState[node.id]);

  const isIndeterminate =
    hasChildren && checkedDescendants > 0 && checkedDescendants < totalDescendants;

  // Sync the DOM checkbox element's indeterminate property
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleCheckboxChange = () => {
    // If currently indeterminate or unchecked, the action will check all descendants
    const targetState = isIndeterminate ? true : !isChecked;
    onToggle(node, targetState);
  };

  return (
    <div style={styles.nodeWrapper}>
      <div style={styles.row}>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            style={styles.expandBtn}
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span style={styles.expandSpacer} />
        )}

        <label style={styles.label}>
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            style={styles.checkbox}
          />
          <span style={isChecked ? styles.labelTextChecked : styles.labelText}>
            {node.label}
          </span>
        </label>
      </div>

      {hasChildren && isExpanded && (
        <div style={styles.childrenContainer}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checkedState={checkedState}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CheckboxTree() {
  const [checkedState, setCheckedState] = useState({});

  const handleToggle = (node, nextCheckedState) => {
    const idsToUpdate = [node.id, ...getAllDescendantIds(node)];
    
    setCheckedState((prev) => {
      const updated = { ...prev };
      idsToUpdate.forEach((id) => {
        if (nextCheckedState) {
          updated[id] = true;
        } else {
          delete updated[id];
        }
      });
      return updated;
    });
  };

  const handleSelectAll = (select) => {
    if (!select) {
      setCheckedState({});
      return;
    }
    const allIds = [INITIAL_DATA.id, ...getAllDescendantIds(INITIAL_DATA)];
    const newState = {};
    allIds.forEach((id) => {
      newState[id] = true;
    });
    setCheckedState(newState);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Role Permissions</h3>
        <div style={styles.btnGroup}>
          <button onClick={() => handleSelectAll(true)} style={styles.actionBtn}>
            Select All
          </button>
          <button onClick={() => handleSelectAll(false)} style={styles.actionBtn}>
            Clear
          </button>
        </div>
      </div>

      <div style={styles.treeContainer}>
        <TreeNode
          node={INITIAL_DATA}
          checkedState={checkedState}
          onToggle={handleToggle}
        />
      </div>

      <div style={styles.footer}>
        <strong>Selected IDs:</strong> {Object.keys(checkedState).join(', ') || 'None'}
      </div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: '460px',
    margin: '30px auto',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '12px',
  },
  btnGroup: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '4px 10px',
    fontSize: '0.8rem',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  treeContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  nodeWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandSpacer: {
    width: '24px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#2563eb',
  },
  labelText: {
    fontSize: '0.92rem',
    color: '#334155',
  },
  labelTextChecked: {
    fontSize: '0.92rem',
    color: '#0f172a',
    fontWeight: '500',
  },
  childrenContainer: {
    marginLeft: '24px',
    borderLeft: '1px dashed #cbd5e1',
    paddingLeft: '6px',
  },
  footer: {
    marginTop: '20px',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
    fontSize: '0.8rem',
    color: '#64748b',
    wordBreak: 'break-word',
  },
};

```

---

### Core Mechanics

* **DOM Indeterminate Property:** HTML inputs cannot set `indeterminate` via HTML attributes. It must be applied imperatively on the underlying DOM node using `checkboxRef.current.indeterminate = true`.
* **Cascading Parent Updates:** Checking a parent gathers all descendant IDs via `getAllDescendantIds()` and applies the boolean value to every child in the subtree in a single state update.
* **Derived Parent State:** A parent does not store its own isolated checked status. Instead, it inspects how many of its descendants are present in `checkedState`:
* All checked $\rightarrow$ `checked = true`, `indeterminate = false`
* Some checked $\rightarrow$ `checked = false`, `indeterminate = true`
* None checked $\rightarrow$ `checked = false`, `indeterminate = false`
