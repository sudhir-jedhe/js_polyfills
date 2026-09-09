***   Build an Optimized Ecommerce Cart using React Js (With all features & advanced design patterns).md ***

An enterprise-grade, optimized E-Commerce Cart implementation utilizing **`useReducer` + Context**, **Local Storage Persistence**, a **Compound Component Sliding Drawer UI**, memoized selectors, and coupon validation.

---

### 1. Cart Context & State Machine (`CartContext.jsx`)

```jsx
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ECOMMERCE_CART_SESSION_V1';

const initialState = {
  items: [],
  discountCode: '',
  discountPercent: 0,
};

// Available Promo Codes
const VALID_PROMOS = {
  SAVE10: 10,
  REACT20: 20,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;

    case 'ADD_ITEM': {
      const existingIdx = state.items.findIndex((i) => i.id === action.payload.id);
      let updatedItems;

      if (existingIdx > -1) {
        updatedItems = state.items.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: Math.min(item.quantity + (action.payload.quantity || 1), item.stock) }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      return { ...state, items: updatedItems };
    }

    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        ),
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case 'APPLY_PROMO': {
      const code = action.payload.toUpperCase();
      const discount = VALID_PROMOS[code] || 0;
      return { ...state, discountCode: discount ? code : '', discountPercent: discount };
    }

    case 'CLEAR_CART':
      return { ...initialState };

    default:
      return state;
    }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Derived Totals (Memoized computations)
  const totals = useMemo(() => {
    const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const discountAmount = (subtotal * state.discountPercent) / 100;
    const tax = (subtotal - discountAmount) * 0.08; // 8% Tax rate
    const grandTotal = Math.max(0, subtotal - discountAmount + tax);

    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      tax: tax.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      totalItems,
    };
  }, [state.items, state.discountPercent]);

  return (
    <CartContext.Provider value={{ state, dispatch, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

```

---

### 2. Slide-Over Cart Drawer (`CartDrawer.jsx`)

```jsx
import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { state, dispatch, totals } = useCart();
  const [promoInput, setPromoInput] = useState('');

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <aside style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h3>Your Bag ({totals.totalItems})</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Item List */}
        <div style={styles.itemsList}>
          {state.items.length === 0 ? (
            <div style={styles.emptyCart}>Your shopping bag is empty.</div>
          ) : (
            state.items.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                <img src={item.image} alt={item.name} style={styles.thumbnail} />
                <div style={styles.itemDetails}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemPrice}>${item.price.toFixed(2)}</div>
                  <div style={styles.qtyControls}>
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                      style={styles.qtyBtn}
                    >
                      −
                    </button>
                    <span style={styles.qtyCount}>{item.quantity}</span>
                    <button
                      disabled={item.quantity >= item.stock}
                      onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                      style={{ ...styles.qtyBtn, opacity: item.quantity >= item.stock ? 0.4 : 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {state.items.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.promoGroup}>
              <input
                type="text"
                placeholder="Promo Code (SAVE10, REACT20)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                style={styles.promoInput}
              />
              <button
                onClick={() => {
                  dispatch({ type: 'APPLY_PROMO', payload: promoInput });
                  setPromoInput('');
                }}
                style={styles.applyBtn}
              >
                Apply
              </button>
            </div>

            <div style={styles.summaryBreakdown}>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${totals.subtotal}</span>
              </div>
              {state.discountPercent > 0 && (
                <div style={{ ...styles.summaryRow, color: '#16a34a' }}>
                  <span>Discount ({state.discountCode})</span>
                  <span>-${totals.discountAmount}</span>
                </div>
              )}
              <div style={styles.summaryRow}>
                <span>Estimated Tax (8%)</span>
                <span>${totals.tax}</span>
              </div>
              <div style={{ ...styles.summaryRow, fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Grand Total</span>
                <span>${totals.grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Proceeding to checkout with $${totals.grandTotal}`)}
              style={styles.checkoutBtn}
            >
              Checkout (${totals.grandTotal})
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  drawer: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  itemsList: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyCart: {
    margin: 'auto',
    color: '#9ca3af',
  },
  cartItem: {
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '12px',
    alignItems: 'center',
  },
  thumbnail: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f3f4f6',
  },
  itemDetails: {
    flexGrow: 1,
  },
  itemName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  itemPrice: {
    color: '#4b5563',
    fontSize: '0.85rem',
    margin: '2px 0 6px',
  },
  qtyControls: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
  },
  qtyBtn: {
    padding: '2px 8px',
    background: '#f9fafb',
    border: 'none',
    cursor: 'pointer',
  },
  qtyCount: {
    padding: '0 8px',
    fontSize: '0.85rem',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  promoGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  promoInput: {
    flexGrow: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  applyBtn: {
    padding: '8px 14px',
    border: 'none',
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  summaryBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  checkoutBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

```

---

### 3. Storefront Entry (`App.jsx`)

```jsx
import React, { useState } from 'react';
import { CartProvider, useCart } from './CartContext';
import CartDrawer from './CartDrawer';

const STORE_PRODUCTS = [
  { id: 'p1', name: 'Mechanical Keychron K2', price: 99.0, stock: 5, image: 'https://picsum.photos/seed/k2/100/100' },
  { id: 'p2', name: 'Sony WH-1000XM5', price: 349.99, stock: 3, image: 'https://picsum.photos/seed/sony/100/100' },
  { id: 'p3', name: 'Logitech MX Master 3S', price: 89.99, stock: 8, image: 'https://picsum.photos/seed/mx/100/100' },
];

function Storefront() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { dispatch, totals } = useCart();

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Flagship Hardware</h2>
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #333', background: '#000', color: '#fff', cursor: 'pointer' }}
        >
          🛒 Bag ({totals.totalItems})
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {STORE_PRODUCTS.map((prod) => (
          <div key={prod.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
            <h4 style={{ margin: '12px 0 4px' }}>{prod.name}</h4>
            <p style={{ fontWeight: 'bold', margin: '0 0 12px' }}>${prod.price.toFixed(2)}</p>
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: prod })}
              style={{ width: '100%', padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}

```

---

### Key Architectural Patterns

* **Encapsulated State Machine:** Reducer guards against negative quantities and prevents additions exceeding stock ceilings (`Math.min(..., stock)`).
* **Deterministic Computations:** Totals (Subtotal, Promotions, Taxes, Grand Total) are kept out of stored state and derived on the fly via `useMemo`.
* **State Persistence with LocalStorage:** Lazy-initialization function in `useReducer` hydrates session state on load without layout thrashing.
