When state and updater functions are bundled into a single Context object, **any state change creates a new object reference**, forcing every consuming component to re-render—even components that only use the dispatch function and never read the state.

The **Separate State and Dispatch Pattern** splits data flow into two distinct contexts:

1. **`StateContext`**: Holds data values (changes frequently).
2. **`DispatchContext`**: Holds the stable dispatch/setter reference (never changes across renders).

---

**1. Create the Split Contexts (`CartContext.jsx`)**

```jsx
// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartStateContext.Provider value={state}>
      {/* dispatch from useReducer is guaranteed to have a stable reference */}
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// Custom hooks with guard clauses
export function useCartState() {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (!context) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context;
}

```

---

**2. Sibling Implementation & Render Behavior**

**Sibling A: Writer Component (Dispatch Only)**
This component only triggers updates. Because it subscribes **only** to `CartDispatchContext`, it **will not re-render** when items are added.

```jsx
// src/components/AddToCartButton.jsx
import React from 'react';
import { useCartDispatch } from '../context/CartContext';

export function AddToCartButton({ item }) {
  const dispatch = useCartDispatch();

  // Will log ONLY ONCE on mount, not on every click
  console.log('Rendering AddToCartButton');

  return (
    <button
      onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
    >
      Add {item.name}
    </button>
  );
}

```

**Sibling B: Reader Component (State Only)**
This component only reads data. It subscribes to `CartStateContext` and re-renders whenever `state.items` changes.

```jsx
// src/components/CartBadge.jsx
import React from 'react';
import { useCartState } from '../context/CartContext';

export function CartBadge() {
  const { items } = useCartState();

  // Logs on mount and every time an item is added
  console.log('Rendering CartBadge');

  return <div>Total Items: {items.length}</div>;
}

```

---

**3. Application Root (`App.jsx`)**

```jsx
// src/App.jsx
import React from 'react';
import { CartProvider } from './context/CartContext';
import { AddToCartButton } from './components/AddToCartButton';
import { CartBadge } from './components/CartBadge';

export default function App() {
  return (
    <CartProvider>
      <header>
        <CartBadge />
      </header>
      <main>
        <AddToCartButton item={{ id: 1, name: 'Mechanical Keyboard' }} />
        <AddToCartButton item={{ id: 2, name: 'Wireless Mouse' }} />
      </main>
    </CartProvider>
  );
}

```

---

**Why This Eliminates Unnecessary Re-renders**

* **Reference Stability:** React guarantees that `dispatch` returned by `useReducer` (and state updater functions from `useState`) maintains the same identity across all re-renders.
* **Granular Subscriptions:** Components importing `useCartDispatch()` only subscribe to the unchanging `DispatchContext`, completely bypassing updates when `CartStateContext` fires new values.
