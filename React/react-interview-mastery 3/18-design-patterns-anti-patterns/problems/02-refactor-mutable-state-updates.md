# Problem: Refactor Direct State Mutation into Correct Immutable Updates

## Task

The shopping cart component below mutates `state.items` directly in multiple places before calling `setState`, which causes React to sometimes skip re-rendering and produces stale UI. Refactor every mutation into an immutable update.

## Starting point (the anti-pattern)

```jsx
function ShoppingCart() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  function addItem(item) {
    cart.items.push(item); // mutates the array in place
    cart.total += item.price; // mutates the object in place
    setCart(cart); // same reference — React may not re-render
  }

  function removeItem(id) {
    const index = cart.items.findIndex((i) => i.id === id);
    cart.items.splice(index, 1); // mutates in place
    setCart(cart);
  }

  function updateQuantity(id, quantity) {
    const item = cart.items.find((i) => i.id === id);
    item.quantity = quantity; // mutates a nested object in place
    setCart(cart);
  }

  return (
    <div>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cart.total.toFixed(2)}</p>
      <button onClick={() => addItem({ id: Date.now(), name: "New Item", price: 9.99, quantity: 1 })}>
        Add item
      </button>
    </div>
  );
}
```

## Refactored solution

```jsx
function ShoppingCart() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  function addItem(item) {
    setCart((prev) => ({
      items: [...prev.items, item],
      total: prev.total + item.price,
    }));
  }

  function removeItem(id) {
    setCart((prev) => {
      const removed = prev.items.find((i) => i.id === id);
      return {
        items: prev.items.filter((i) => i.id !== id),
        total: prev.total - (removed ? removed.price * removed.quantity : 0),
      };
    });
  }

  function updateQuantity(id, quantity) {
    setCart((prev) => {
      const items = prev.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items, total };
    });
  }

  return (
    <div>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cart.total.toFixed(2)}</p>
      <button onClick={() => addItem({ id: Date.now(), name: "New Item", price: 9.99, quantity: 1 })}>
        Add item
      </button>
    </div>
  );
}
```

## Why this is better

- Every update now builds and returns a brand-new object/array (`[...prev.items, item]`, `.filter(...)`, `.map(...)`) instead of mutating `cart` or `cart.items` in place, so React's reference comparison correctly detects a change on every call and reliably re-renders.
- Using the updater-function form of `setCart(prev => ...)` (rather than closing over the `cart` variable directly) also protects against stale-closure bugs if multiple updates happen close together, since each updater always receives the latest state.
- `total` is now recomputed from the new `items` array rather than incrementally mutated (`cart.total += ...`), which eliminates an entire class of "total drifted from the actual items" bugs that incremental mutation is prone to (e.g., if `removeItem` forgot to subtract the right amount).
- Each function returns a fresh object shaped exactly like the previous state (`{ items, total }`), so nothing downstream can accidentally still be holding a reference to the old, now out-of-sync array.

## Things to watch out for

- `[...prev.items, item]` copies the array by reference for its *elements* — this is fine as long as you don't then mutate an existing item object in place elsewhere; `updateQuantity` above avoids that by spreading the changed item too (`{ ...item, quantity }`).
- For deeply nested state, spreading only fixes the level you explicitly spread — spreading `cart` but then doing `cart.items.push(...)` on the copy would still mutate the *same* inner array, since a shallow spread doesn't deep-clone. Every level that changes needs its own new reference.
- If this pattern shows up a lot, a reducer (`useReducer`) or an immutability-helper library (Immer) can make the "return a new object from every branch" discipline easier to enforce than hand-writing spreads everywhere.
