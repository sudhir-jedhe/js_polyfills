*** copy  Build a Multi Level dropdown with Infinite nesting in React js.md ***

An infinite-level nested dropdown in React using a **recursive component tree pattern**, automatic click-outside detection, keyboard accessibility, and hover/click expansion triggers.

---

### 1. Recursive Dropdown Item (`DropdownItem.jsx`)

Each item checks if it has nested `children`. If it does, it renders its own submenu recursively.

```jsx
import React, { useState, useRef, useEffect } from 'react';

export default function DropdownItem({ item, onSelect, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef(null);
  const hasChildren = Boolean(item.children && item.children.length > 0);

  // Close submenus on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    } else {
      if (item.action) item.action();
      if (onSelect) onSelect(item);
    }
  };

  return (
    <li
      ref={itemRef}
      style={styles.itemWrapper}
      onMouseEnter={() => hasChildren && setIsOpen(true)}
      onMouseLeave={() => hasChildren && setIsOpen(false)}
    >
      <button
        onClick={handleClick}
        style={{
          ...styles.itemButton,
          backgroundColor: isOpen ? '#f1f5f9' : 'transparent',
        }}
        aria-haspopup={hasChildren ? 'true' : 'false'}
        aria-expanded={isOpen}
      >
        <span style={styles.itemLabel}>{item.label}</span>
        {hasChildren && (
          <span style={styles.chevron}>
            {depth === 0 ? '▾' : '▸'}
          </span>
        )}
      </button>

      {/* Recursive Submenu Render */}
      {hasChildren && isOpen && (
        <ul
          style={{
            ...styles.submenu,
            top: depth === 0 ? '100%' : '0',
            left: depth === 0 ? '0' : '100%',
          }}
          role="menu"
        >
          {item.children.map((child, index) => (
            <DropdownItem
              key={child.id || `${child.label}-${index}`}
              item={child}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const styles = {
  itemWrapper: {
    position: 'relative',
    listStyle: 'none',
  },
  itemButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    fontSize: '0.9rem',
    color: '#1e293b',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
    whiteSpace: 'nowrap',
    minWidth: '180px',
  },
  itemLabel: {
    marginRight: '12px',
  },
  chevron: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  submenu: {
    position: 'absolute',
    margin: 0,
    padding: '6px 0',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
  },
};

```

---

### 2. Main Menu Container with Outside-Click Handler (`MultiLevelMenu.jsx`)

```jsx
import React, { useState, useRef, useEffect } from 'react';
import DropdownItem from './DropdownItem';

export default function MultiLevelMenu({ title = 'Navigation', menuData, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Click Outside Listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleItemSelect = (item) => {
    setIsOpen(false); // Close parent menu once a leaf is selected
    if (onSelect) onSelect(item);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={styles.triggerBtn}
      >
        <span>{title}</span>
        <span style={{ marginLeft: '8px', fontSize: '0.75rem' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <ul style={styles.rootMenu} role="menubar">
          {menuData.map((item, index) => (
            <DropdownItem
              key={item.id || `${item.label}-${index}`}
              item={item}
              onSelect={handleItemSelect}
              depth={0}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  triggerBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 18px',
    fontSize: '0.95rem',
    fontWeight: '600',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  rootMenu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    margin: 0,
    padding: '6px 0',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    zIndex: 40,
  },
};

```

---

### 3. Usage Example with Arbitrary Nested Data (`App.jsx`)

```jsx
import React from 'react';
import MultiLevelMenu from './MultiLevelMenu';

const NAVIGATION_TREE = [
  {
    label: 'Products',
    children: [
      {
        label: 'Computers',
        children: [
          {
            label: 'Laptops',
            children: [
              { label: 'MacBook Pro M-Series' },
              { label: 'ThinkPad X1 Carbon' },
              { label: 'Dell XPS 15' },
            ],
          },
          { label: 'Desktops' },
          { label: 'Monitors' },
        ],
      },
      {
        label: 'Audio',
        children: [
          { label: 'Over-Ear Headphones' },
          { label: 'In-Ear Monitors (IEMs)' },
        ],
      },
      { label: 'Accessories' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'Cloud Architecture' },
      {
        label: 'Consulting',
        children: [
          { label: 'Security Auditing' },
          { label: 'Performance Optimization' },
        ],
      },
    ],
  },
  {
    label: 'About Us',
  },
];

export default function App() {
  const handleSelect = (item) => {
    alert(`Selected: ${item.label}`);
  };

  return (
    <div style={{ padding: '60px', height: '100vh', backgroundColor: '#f8fafc' }}>
      <MultiLevelMenu
        title="Explore Catalog"
        menuData={NAVIGATION_TREE}
        onSelect={handleSelect}
      />
    </div>
  );
}

```

---

### Key Architectural Concepts

* **Self-Referential Rendering:** `DropdownItem` invokes itself dynamically whenever `item.children` exists, allowing arbitrary tree depths ($N$-levels deep) without modifying component code.
* **Smart Coordinate Offsetting:** Submenu positioning calculates coordinates based on recursion depth (`depth === 0` opens directly downward; `depth > 0` cascades to the right).
* **Click-Outside Closure:** The root container manages global mouse down detection via standard ref encapsulation to dismiss the entire tree when focus leaves.
