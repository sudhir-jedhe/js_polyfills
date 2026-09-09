***  01-card-component-with-children-composition.md ***

# Problem: Build a Reusable `<Card>` Component With Header/Body/Footer Slots

## Problem Statement

Build a reusable `<Card>` component that supports three optional content regions — header, body, footer — using `props.children` composition rather than raw data props, so each region can hold arbitrary JSX (icons, buttons, formatted text) instead of just strings.

## Requirements

- `<Card>` accepts three optional named props: `header`, `footer`, and the default `children` slot for the body — matching the "children for the single main slot, named props for other slots" guidance from the theory notes.
- Any slot that isn't passed should not render an empty wrapper element (no empty `<header>`/`<footer>` in the DOM when unused).
- The body region should accept arbitrary nested JSX just like normal `children` composition.
- Must support an optional `variant` prop (`'default' | 'outlined'`) that changes the wrapper's class name, defaulting to `'default'`.

## Approach

Use named props (`header`, `footer`) for the two auxiliary slots, since a component can only have one `children`, and reserve the default `children` slot for the main body content — this mirrors the `children` vs. named-prop composition tradeoff from the theory notes. Each slot renders conditionally (`header && <header>...</header>`) so unset slots don't leave empty DOM nodes behind.

## Solution

```jsx
function Card({ header, children, footer, variant = 'default' }) {
  return (
    <div className={`card card--${variant}`}>
      {header && <header className="card__header">{header}</header>}
      <div className="card__body">{children}</div>
      {footer && <footer className="card__footer">{footer}</footer>}
    </div>
  );
}

// --- usage ---
function ProductCard({ product }) {
  return (
    <Card
      variant="outlined"
      header={
        <div className="card__title-row">
          <h3>{product.name}</h3>
          <span className="price">${product.price}</span>
        </div>
      }
      footer={<button onClick={() => addToCart(product.id)}>Add to cart</button>}
    >
      <p>{product.description}</p>
      <img src={product.imageUrl} alt={product.name} />
    </Card>
  );
}

// --- a card with only a body, to show unused slots stay out of the DOM ---
function SimpleNote({ text }) {
  return (
    <Card>
      <p>{text}</p>
    </Card>
  );
}
// renders <div class="card card--default"><div class="card__body"><p>...</p></div></div>
// — no empty <header>/<footer> elements
```

**Why this works:** `header` and `footer` being plain props (rather than `children`) lets `Card` accept three genuinely independent regions at once, which a single `children` prop couldn't do on its own. Guarding each optional region with `header && <header>...` (rather than always rendering the wrapper) keeps the DOM output clean and CSS-selector-friendly when a consumer only needs the body — an empty `<footer></footer>` would otherwise still take up layout space or need extra CSS to hide.

**Known limitation:** using `header && ...` inherits the same falsy-value caveat as any `&&` guard in JSX — if `header` were ever passed as a number (unlikely here, but worth remembering), `0` would render literally. Since `header`/`footer` are always expected to be JSX elements or `undefined` in this component's contract, that edge case doesn't apply in practice, but it's worth flagging when reusing this pattern for props that could plausibly be numeric.
