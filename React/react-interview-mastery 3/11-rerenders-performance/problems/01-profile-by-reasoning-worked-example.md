# Problem 1: Profile-by-Reasoning a Component Tree

This is a worked example — reasoning through which components re-render on a given state change *without* opening the actual DevTools Profiler, the way you'd need to on a whiteboard or in a code review.

## The tree

```jsx
function App() {
  const [user, setUser] = useState({ name: 'Ada', id: 1 });
  const [cartCount, setCartCount] = useState(0);

  return (
    <div>
      {/* Header renders Nav + CartBadge as children */}
      <Header user={user} cartCount={cartCount} />
      {/* Main renders ProductList (not memoized) and Footer (memoized) */}
      <Main />
      <Footer />
    </div>
  );
}

function Header({ user, cartCount }) {
  // Not memoized.
  return (
    <header>
      <Nav user={user} />
      <CartBadge count={cartCount} />
    </header>
  );
}

function Nav({ user }) {
  // Not memoized.
  console.log('Nav render');
  return <p>Welcome, {user.name}</p>;
}

const CartBadge = React.memo(function CartBadge({ count }) {
  // Memoized — count is a primitive, so memo works cleanly here.
  console.log('CartBadge render');
  return <span className="badge">{count}</span>;
});

function Main() {
  // Not memoized. Renders a large, expensive ProductList.
  console.log('Main render');
  return <ProductList />;
}

const ProductList = React.memo(function ProductList() {
  // Memoized, and takes no props at all — its own render is fully
  // decoupled from anything in App's state.
  console.log('ProductList render');
  return <ul>{/* ...expensive list... */}</ul>;
});

const Footer = React.memo(function Footer() {
  console.log('Footer render');
  return <footer>© 2026</footer>;
});
```

## Scenario A: user clicks "Add to cart" → `setCartCount(c => c + 1)`

Walk the tree top-down, applying the three re-render triggers (own state, parent re-render, context change) at each node:

- **`App`** — its own state (`cartCount`) changed → **re-renders**.
- **`Header`** — not memoized, and its parent (`App`) just re-rendered → **re-renders**, regardless of the fact that its `user` prop didn't change. This is the classic "parent re-renders, child follows by default" rule.
- **`Nav`** — not memoized, and its parent (`Header`) just re-rendered → **re-renders**, even though `user` is the exact same object reference as before. `Nav render` logs again despite nothing relevant to `Nav` having changed — this is "wasted" work, though cheap here.
- **`CartBadge`** — memoized, parent (`Header`) re-rendered, but its own prop `count` is a primitive that *did* change (`0` → `1`) → `memo`'s shallow comparison correctly says "different" → **re-renders**. This is the one component that needed to update, and it did.
- **`Main`** — not memoized, but `App`'s re-render doesn't reach `Main` any differently than always — `Main` is a sibling of `Header`, also a direct child of `App`, so it re-renders for the exact same reason `Header` does: its parent re-rendered → **re-renders**, even though nothing about the product list changed at all.
- **`ProductList`** — memoized, receives no props → `memo`'s comparison trivially passes (no props to compare, nothing changed) → **does not re-render**. This is `memo` doing real, useful work: it absorbs the re-render that cascaded from `App` and stops it here.
- **`Footer`** — memoized, receives no props → same as `ProductList` → **does not re-render**.

**Summary for this click:** `App`, `Header`, `Nav`, `CartBadge`, `Main` re-render. `ProductList` and `Footer` are correctly skipped by `memo`.

**The wasted work:** `Nav` and `Main` re-render for no functional reason — `Nav`'s `user` prop is unchanged, and `Main` has no props at all. Wrapping `Nav` in `React.memo` would stop it, since `user` is the same object reference (it wasn't touched by `setCartCount`). Wrapping `Main` in `React.memo` would stop it too — `Main` has no props, so it can never legitimately need to re-render except when its parent forces it, exactly like `ProductList`/`Footer` already demonstrate.

## Scenario B: user's name changes → `setUser({ ...user, name: 'Grace' })`

- **`App`** — own state changed → **re-renders**.
- **`Header`** — parent re-rendered → **re-renders**.
- **`Nav`** — parent re-rendered, and this time `user` *did* legitimately change → **re-renders** — this one is necessary work.
- **`CartBadge`** — memoized, parent re-rendered, but `count` prop is unchanged (still whatever it was) → `memo` **skips** it. This is the payoff of memoizing `CartBadge`: it doesn't care that `Header` re-rendered, only that its own prop changed.
- **`Main`** / **`ProductList`** / **`Footer`** — identical reasoning to Scenario A: `Main` re-renders (unmemoized, parent re-rendered), `ProductList` and `Footer` don't (memoized, no props).

**Key takeaway from comparing A and B:** the *set* of components that "needed" to update is different in each scenario (`CartBadge` in A, `Nav` in B), but without memoization on `Nav`/`Main`, both scenarios cause identical, blanket re-render cascades through the unmemoized parts of the tree regardless of which state actually changed. This is exactly the reasoning process the Profiler's "why did this render" panel automates — you're doing it by hand here.
