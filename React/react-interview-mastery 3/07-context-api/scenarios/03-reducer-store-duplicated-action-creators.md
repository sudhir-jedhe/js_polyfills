*** copy 03-reducer-store-duplicated-action-creators.md ***

# Scenario: Building a shopping cart with Context + useReducer, but action creators are duplicated everywhere

You're building a cart feature with Context + `useReducer`. Multiple components dispatch actions like `dispatch({ type: 'ADD_ITEM', payload: item })` directly, and a typo in an action type (`'ADD_ITME'`) silently does nothing because the reducer's `default` case just returns the state unchanged, with no error.

**Approach:** Two improvements: centralize action creators as functions exported alongside the context, and make the reducer loud about unknown actions in development.

```jsx
const CartContext = createContext();
const CartDispatchContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    default:
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Unknown cart action: ${action.type}`);
      }
      return state;
  }
}

// Action creators — the only sanctioned way to dispatch, so typos are caught by imports, not strings
export const cartActions = {
  addItem: (item) => ({ type: 'ADD_ITEM', payload: item }),
  removeItem: (id) => ({ type: 'REMOVE_ITEM', payload: { id } }),
};

function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) throw new Error('useCartDispatch must be used within CartProvider');
  return dispatch;
}

// usage in a component
const dispatch = useCartDispatch();
dispatch(cartActions.addItem(item)); // typo-proof, autocompletable
```

This is essentially reinventing a small slice of what Redux gives you for free — worth calling out to the team as a signal that if the cart logic grows further, a proper state library might pay for itself.
