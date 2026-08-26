*** copy How do you implement the roving tabindex pattern for keyboard navigation in React compound components without state re-render overhead?.md ***

The **Roving `tabIndex**` pattern ensures that only one item in a composite widget (such as a Menu, Toolbar, or Tab list) is in the natural tab order (`tabIndex = 0`), while all other items are removed from tab order (`tabIndex = -1`). Arrow keys shift focus between items, dynamically moving the `tabIndex = 0` position.

To implement this **without triggering React re-render cascades** on every arrow keypress, manage focus and DOM attributes imperatively via **DOM Refs and Event Delegation** at the container level.

---

**Step 1: Create the Focus Context and Registry**

The container provides registration functions and a focus manager via a stable Context. State is not used for tracking focus.

```tsx
// RovingContext.tsx
import React, { createContext, useContext, useRef } from 'react';

interface RovingContextValue {
  registerItem: (node: HTMLElement | null) => void;
  unregisterItem: (node: HTMLElement | null) => void;
  focusItem: (index: number) => void;
  itemsRef: React.MutableRefObject<HTMLElement[]>;
}

const RovingContext = createContext<RovingContextValue | null>(null);

export function useRovingFocus() {
  const ctx = useContext(RovingContext);
  if (!ctx) throw new Error('useRovingFocus must be used within <RovingGroup>');
  return ctx;
}

```

---

**Step 2: Container with Event Delegation (`RovingGroup`)**

The container intercepts `onKeyDown` events once at the root level and updates the DOM attributes (`tabIndex`) directly without triggering React state updates.

```tsx
// RovingGroup.tsx
export function RovingGroup({
  children,
  orientation = 'horizontal',
}: {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}) {
  // Ordered registry of real DOM button/tab nodes
  const itemsRef = useRef<HTMLElement[]>([]);

  const registerItem = (node: HTMLElement | null) => {
    if (node && !itemsRef.current.includes(node)) {
      itemsRef.current.push(node);
      // Ensure the first item registered defaults to tabIndex 0
      if (itemsRef.current.length === 1) {
        node.tabIndex = 0;
      }
    }
  };

  const unregisterItem = (node: HTMLElement | null) => {
    if (node) {
      itemsRef.current = itemsRef.current.filter((item) => item !== node);
    }
  };

  const focusItem = (targetIndex: number) => {
    const items = itemsRef.current.filter((el) => !el.hasAttribute('disabled'));
    if (!items.length) return;

    // Clamp / wrap index
    const count = items.length;
    const nextIndex = (targetIndex + count) % count;

    // Update DOM tabIndex directly: old -> -1, new -> 0
    items.forEach((item, idx) => {
      if (idx === nextIndex) {
        item.tabIndex = 0;
        item.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = itemsRef.current.filter((el) => !el.hasAttribute('disabled'));
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (currentIndex === -1) return;

    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        focusItem(currentIndex + 1);
        break;
      case prevKey:
        e.preventDefault();
        focusItem(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(items.length - 1);
        break;
    }
  };

  // Context value remains completely stable across the application lifetime
  const contextValue = useRef<RovingContextValue>({
    registerItem,
    unregisterItem,
    focusItem,
    itemsRef,
  }).current;

  return (
    <RovingContext.Provider value={contextValue}>
      <div role="toolbar" onKeyDown={handleKeyDown}>
        {children}
      </div>
    </RovingContext.Provider>
  );
}

```

---

**Step 3: Lightweight Consumer Sub-Component (`RovingItem`)**

The child component registers its DOM node using a callback ref or `useEffect` and defaults to `tabIndex={-1}`.

```tsx
// RovingItem.tsx
export function RovingItem({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { registerItem, unregisterItem } = useRovingFocus();
  const elementRef = useRef<HTMLButtonElement | null>(null);

  const setRef = (node: HTMLButtonElement | null) => {
    if (elementRef.current) {
      unregisterItem(elementRef.current);
    }
    elementRef.current = node;
    if (node) {
      registerItem(node);
    }
  };

  return (
    <button
      ref={setRef}
      role="button"
      tabIndex={-1} // Initialized as -1; container sets first item to 0
      disabled={disabled}
      onClick={onClick}
      onFocus={(e) => {
        // Synchronize tabIndex if focused via mouse click
        e.currentTarget.tabIndex = 0;
      }}
    >
      {children}
    </button>
  );
}

```

---

**Step 4: Usage in Compound Widgets**

```tsx
export function ToolbarDemo() {
  return (
    <RovingGroup orientation="horizontal">
      <RovingItem onClick={() => console.log('Cut')}>Cut</RovingItem>
      <RovingItem onClick={() => console.log('Copy')}>Copy</RovingItem>
      <RovingItem onClick={() => console.log('Paste')}>Paste</RovingItem>
      <RovingItem onClick={() => console.log('Delete')} disabled>
        Delete
      </RovingItem>
      <RovingItem onClick={() => console.log('Share')}>Share</RovingItem>
    </RovingGroup>
  );
}

```

---

**Why This Eliminates Re-render Overhead**

| Standard React State Approach                                                                          | Imperative Ref / Event Delegation Approach                                          |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Maintains `const [focusedIdx, setFocusedIdx] = useState(0)` in the container.                          | Stores DOM node references inside `useRef<HTMLElement[]>([])`.                      |
| Every arrow keypress calls `setState`, causing **the container and all $N$ child items to re-render**. | Zero `setState` calls. **0 component re-renders** occur during arrow navigation.    |
| Subject to render queuing delays and input lag in deep or heavy lists.                                 | Instant response time via native DOM mutations (`item.tabIndex = 0; item.focus()`). |
