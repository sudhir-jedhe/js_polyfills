# Container / Presentational Pattern in React

## Frontend System Design + Complete Interview-Ready Explanation

The **Container / Presentational** pattern is one of the most important **Senior React design patterns**.

It answers questions like:

✅ Where should state live?

✅ Where should API calls go?

✅ How to make components reusable?

✅ How to separate business logic from UI?

✅ How to keep code testable?

Real-world examples:

```txt
E-commerce Product Page
Chat Applications
Dashboard Panels
CRUD Screens
Data Tables
Auth Forms
```

Popularized by **Dan Abramov**, this pattern is still used in modern React applications, often refined with hooks and modern architectures.

---

# 1. Definition

## Presentational Component

A component that:

✅ Only renders UI

✅ Uses props for data

✅ Does not fetch data

✅ Does not manage business logic

✅ Uses local state ONLY for UI concerns

✅ Reusable and dumb

Also called:

```txt
Dumb Component
UI Component
View Component
Stateless Component
```

---

## Container Component

A component that:

✅ Handles logic

✅ Handles state

✅ Handles API calls

✅ Passes data to presentational components

✅ Handles user events

✅ Does not render UI directly

Also called:

```txt
Smart Component
Logic Component
Data Component
Stateful Component
```

---

# 2. Analogy

Imagine a restaurant:

```txt
Chef (Container)
   ↓
Prepares ingredients (data)
   ↓
Waiter (Presentational)
   ↓
Serves food to customer (renders UI)
```

The chef doesn't serve food.

The waiter doesn't cook.

Each has a **clear responsibility**.

---

# 3. Why Use This Pattern?

## Benefits

✅ Separation of concerns

✅ Reusability

✅ Testability

✅ Easier debugging

✅ Better performance (memoization)

✅ Cleaner code

✅ Scales better in enterprise apps

---

# 4. Component Design

```txt
UserPage (Container)
   ↓
Handles API + State
   ↓
Passes props → UserProfile (Presentational)
   ↓
UserProfile shows data
```

---

# 5. Example 1: User Profile

### Presentational Component

```jsx
export default function UserProfile({
  user,
  onLogout
}) {

  return (
    <div className="user-card">

      {user.avatar}name}
      />

      <h3>
        {user.name}
      </h3>

      <p>
        {user.email}
      </p>

      <button
        onClick={onLogout}
      >
        Logout
      </button>

    </div>
  );
}
```

Notice:

✅ No API

✅ No state (except UI)

✅ No side effects

✅ Only renders props

✅ Fully reusable

---

### Container Component

```jsx
import { useState, useEffect } from "react";

import UserProfile from "./UserProfile";

export default function UserProfileContainer() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user");

      const data = await res.json();

      setUser(data);
      setLoading(false);
    }

    fetchUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");

    setUser(null);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return <UserProfile user={user} onLogout={handleLogout} />;
}
```

Container handles:

✅ API

✅ State

✅ Loading state

✅ Business logic

✅ Event handlers

Presentational only renders.

---

# 6. Example 2: Product Listing

### Presentational Component

```jsx
export default function ProductList({ products, onAddToCart }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.title}</h3>

          <p>₹{product.price}</p>

          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
```

---

### Container Component

```jsx
import { useState, useEffect } from "react";

import ProductList from "./ProductList";

export default function ProductListContainer() {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  function addToCart(product) {
    setCart((prev) => [...prev, product]);
  }

  return <ProductList products={products} onAddToCart={addToCart} />;
}
```

Business logic → container.

Rendering → presentational.

---

# 7. Modern Version With Hooks

Modern React introduced **hooks**, which reduce the strict boundary between container and presentational components.

However, the pattern still applies as an **architectural mindset**.

### Custom Hook Alternative

```jsx
function useUser() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
```

Now presentational becomes smart-enough without becoming a full container.

Modern approach:

```txt
Presentational Component
    + useCustomHook()
```

Instead of a strict container.

---

# 8. Directory Structure Example

```txt
components/
  ├── UserProfile.jsx      ← Presentational
  ├── UserProfile.container.jsx ← Container
  ├── ProductList.jsx      ← Presentational
  └── ProductList.container.jsx ← Container

hooks/
  └── useUser.js           ← Modern alternative

pages/
  └── ProfilePage.jsx
```

Very common in enterprise React apps.

---

# 9. When to Use Container/Presentational

### Use it when

✅ Component is complex

✅ Has heavy logic

✅ Handles APIs

✅ You want reusability

✅ You want maintainable architecture

✅ Working in a large team

### Avoid strict version when

❌ Component is small

❌ Component tightly coupled

❌ Custom hooks solve it easier

Modern approach → custom hooks + composition.

---

# 10. Testability Advantage

Presentational component is a **pure function** of props:

```jsx
render(<UserProfile user={mockUser} onLogout={jest.fn()} />);
```

No API mocks needed.

Container tests API + state logic.

Separation improves:

✅ Unit tests

✅ Snapshot tests

✅ Storybook stories

✅ Visual regression tests

---

# 11. Storybook Advantage

Presentational components can be shown in Storybook easily.

Example:

```jsx
export default {
  title: "UserProfile",
  component: UserProfile,
};

export const Default = () => (
  <UserProfile user={mockUser} onLogout={() => {}} />
);
```

No API mocks.

Ideal for design systems.

---

# 12. Anti-Patterns

## ❌ Data fetching in presentational component

```jsx
function ProductCard() {
  fetch("/api/products");
  return <div>...</div>;
}
```

## ❌ Rendering in container

```jsx
function UserContainer() {
  return (
    <div>
      <h3>{user.name}</h3>
    </div>
  );
}
```

Break separation.

---

# 13. Advanced: Combine with HOC / Render Props / Hooks

## With Higher-Order Component

```jsx
const withUser = (Component) => {
  return function Wrapped(props) {
    const { user, loading } = useUser();

    return <Component {...props} user={user} loading={loading} />;
  };
};
```

Then:

```jsx
export default withUser(UserProfile);
```

---

## With Render Props

```jsx
<UserProvider>
  {({ user, loading }) => <UserProfile user={user} />}
</UserProvider>
```

---

## With Custom Hooks

The modern winner:

```jsx
const { user, loading } = useUser();
```

Cleanest and most flexible.

---

# 14. Real-World Systems Using This Pattern

✅ Facebook & Meta apps

✅ Airbnb components

✅ Uber dashboards

✅ Enterprise CRMs

✅ Component libraries like MUI, Ant Design

---

# 15. Complexity & Scale Benefits

For large apps:

✅ Enforces boundaries

✅ Simplifies testing

✅ Enables parallel development

✅ Supports design systems

✅ Improves onboarding

Fits well with:

✅ Redux

✅ Zustand

✅ React Query

✅ Context API

---

# 16. Data Flow Diagram

```txt
Container
   │
   ▼
Fetch API
   │
   ▼
Set State
   │
   ▼
Compute Data
   │
   ▼
Pass Props Down
   │
   ▼
Presentational Component
   │
   ▼
Render UI
   │
   ▼
Emit Events (props)
   │
   ▼
Container Updates State
```

---

# 17. Senior React Interview Answer

> The Container/Presentational pattern separates business logic and UI. Container components handle state, side effects, and data fetching, while presentational components purely render UI based on props they receive. This separation improves reusability, testability, and maintainability, especially in large-scale applications. In modern React, the boundary is less strict because custom hooks encapsulate stateful logic — for example, a `useUser` hook can be reused across many UI components without needing a full container. In real systems, I combine this pattern with hooks, HOCs, Redux, and design systems to build large, scalable React applications used in enterprise dashboards, e-commerce platforms, chat apps, and CRMs — similar to the architecture used at Airbnb, Facebook, and Uber.

# Container / Presentational Pattern

### Full Example • Benefits • Refactoring Existing Components

This is a **very common Senior React interview question** because it tests:

✅ Component architecture

✅ Separation of concerns

✅ Reusability

✅ Testability

✅ Refactoring skills

✅ Enterprise-scale React patterns

Real world usage:

```txt
Facebook
Airbnb
Uber
LinkedIn
Slack
Notion
Amazon
```

Let's break each part clearly.

---

# 1. Example Code — Container + Presentational

## Scenario

Product Listing Screen

```txt
Fetch products from API
      ↓
Handle loading & error
      ↓
Handle Add to Cart
      ↓
Show grid of products
```

---

## ✅ Presentational Component

Only renders UI. Reusable.

```jsx
export default function ProductList({
  products,
  loading,
  error,
  onAddToCart
}) {

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (error) {
    return (
      <p>{error}</p>
    );
  }

  return (
    <div
      className="product-grid"
    >
      {products.map(
        product => (
          <div
            key={product.id}
            className="product-card"
          >

            <img
              src"{"/>

            <h3>
              {product.title}
            </h3>

            <p>
              ₹{product.price}
            </p>

            <button
              onClick={() =>
                onAddToCart(
                  product
                )
              }
            >
              Add to Cart
            </button>

          </div>
        )
      )}
    </div>
  );
}
```

Key characteristics:

- Renders UI only
- Uses props
- Emits events via props
- No API
- No state (except UI)
- No side effects
- Fully reusable

Perfect for design systems and Storybook.

---

## ✅ Container Component

Handles all logic.

```jsx
import { useState, useEffect, useCallback } from "react";

import ProductList from "./ProductList";

export default function ProductListContainer() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product) => {
    setCart((prev) => [...prev, product]);
  }, []);

  return (
    <ProductList
      products={products}
      loading={loading}
      error={error}
      onAddToCart={handleAddToCart}
    />
  );
}
```

Container handles:

- Fetching
- Business logic
- Error state
- Loading state
- Cart state
- Event handlers

Container knows **what** to do.

Presentational knows **how** to show.

---

# 2. Benefits of Container / Presentational

## ✅ Separation of Concerns

- Business logic isolated
- UI logic isolated
- Easy to refactor
- Prevents "God components"

---

## ✅ Reusability

Presentational components can be reused with:

- Different data sources
- Different APIs
- Different feature areas

Example:

```jsx
<ProductList
  products={
    trendingProducts
  }
/>

<ProductList
  products={
    searchResults
  }
/>

<ProductList
  products={
    recommendedProducts
  }
/>
```

Same UI, different data.

---

## ✅ Testability

Presentational component becomes a pure function of props.

```jsx
render(
  <ProductList
    products={mock}
    loading={false}
    error={null}
    onAddToCart={jest.fn()}
  />,
);
```

No API mocks, no side effects.

Container tests focus on:

- API
- Business logic
- Error handling

---

## ✅ Storybook Friendly

Presentational components can be shown with mock data instantly:

```jsx
export const Default = () => <ProductList products={mockData} />;
```

Great for design systems.

---

## ✅ Team Collaboration

Teams can work in parallel:

```txt
Backend Team → Container API integration
UI Team → Presentational Layout
```

No blockers.

---

## ✅ Improved Debugging

Debugging is easier because:

- Data problems → container
- Layout problems → presentational

Clear separation.

---

## ✅ Better Performance

Presentational components can be memoized easily:

```jsx
const ProductList =
  React.memo(function ProductList({
    ...
  }) {
    ...
  });
```

Because they depend only on props.

Reduces unnecessary re-renders.

---

## ✅ Scales Better

For enterprise apps:

- Multiple containers
- Multiple UIs
- Multiple pages

Grow independently.

Airbnb, Uber, LinkedIn use similar structure.

---

## ✅ Enables Composition

Presentational components combine easily:

```jsx
<ProductList />
<Pagination />
<Filters />
<Sort />
```

Without leaking logic.

---

# 3. How to Refactor an Existing Component

Below is a **typical messy component** most developers write.

## ❌ Before Refactor — All logic in one file

```jsx
import {
  useState,
  useEffect
} from "react";

export default function ProductPage() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [cart, setCart] =
    useState([]);

  useEffect(() => {

    async function loadData() {

      try {

        const res = await fetch(
          "/api/products"
        );

        const data =
          await res.json();

        setProducts(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);
      }
    }

    loadData();

  }, []);

  function addToCart(
    product
  ) {

    setCart(prev => [
      ...prev,
      product
    ]);
  }

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (error) {
    return (
      <p>Error: {error}</p>
    );
  }

  return (
    <div
      className="grid"
    >
      {products.map(
        product => (
          <div
            key={product.id}
          >
            <img
              src"{"/>

            <h3>
              {product.title}
            </h3>

            <p>
              ₹{product.price}
            </p>

            <button
              onClick={() =>
                addToCart(
                  product
                )
              }
            >
              Add to Cart
            </button>
          </div>
        )
      )}
    </div>
  );
}
```

Problems:

- API + UI + State mixed
- Hard to test
- Can't reuse UI
- Hard to maintain
- Not testable with Storybook
- Difficult to extend

---

## ✅ Step 1 — Extract UI Into Presentational

```jsx
// ProductList.jsx

export default function ProductList({
  products,
  loading,
  error,
  onAddToCart
}) {

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (error) {
    return (
      <p>Error: {error}</p>
    );
  }

  return (
    <div
      className="grid"
    >
      {products.map(
        product => (
          <div
            key={product.id}
          >
            <img
              src"{"/>

            <h3>
              {product.title}
            </h3>

            <p>
              ₹{product.price}
            </p>

            <button
              onClick={() =>
                onAddToCart(
                  product
                )
              }
            >
              Add to Cart
            </button>
          </div>
        )
      )}
    </div>
  );
}
```

Clean, pure, reusable.

---

## ✅ Step 2 — Move Logic Into Container

```jsx
// ProductPage.container.jsx

import { useState, useEffect } from "react";

import ProductList from "./ProductList";

export default function ProductPageContainer() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/products");

        const data = await res.json();

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function addToCart(product) {
    setCart((prev) => [...prev, product]);
  }

  return (
    <ProductList
      products={products}
      loading={loading}
      error={error}
      onAddToCart={addToCart}
    />
  );
}
```

---

## ✅ Step 3 — Optional Modern Refactor: Custom Hook

```jsx
// hooks/useProducts.js

import { useState, useEffect } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");

        const data = await res.json();

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    products,
    loading,
    error,
  };
}
```

Then container becomes simpler:

```jsx
export default function ProductPageContainer() {
  const { products, loading, error } = useProducts();

  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((prev) => [...prev, product]);
  }

  return (
    <ProductList
      products={products}
      loading={loading}
      error={error}
      onAddToCart={addToCart}
    />
  );
}
```

---

# 4. Best Practices for Refactoring

## ✅ Always start by extracting UI

Move JSX + props into a new presentational component.

---

## ✅ Move state and effects into a container

Keep business logic away from UI.

---

## ✅ Replace inline logic with handlers

Improves reusability.

---

## ✅ Use custom hooks for reusable logic

Better than deeply nested containers.

---

## ✅ Use folder structure

```txt
ProductPage/
  ├── ProductPage.container.jsx
  ├── ProductList.jsx (presentational)
  ├── useProducts.js
  └── styles.css
```

Very common in enterprise setups.

---

## ✅ Keep Presentational component pure

No API. No state (except UI).

---

## ✅ Use TypeScript for props

Enforces contracts.

Prevents mistakes.

---

# 5. Data Flow Diagram

```txt
Container
   │
   ▼
Fetch Data
   │
   ▼
Update State
   │
   ▼
Pass Props
   │
   ▼
Presentational Component
   │
   ▼
Render UI
   │
   ▼
User Events (onClick)
   │
   ▼
Emit to Container
   │
   ▼
Container Updates State
```

---

# 6. Senior React Interview Answer

> The Container/Presentational pattern separates concerns by placing business logic (API calls, state, effects, event handlers) in a **container component** while pure UI resides in a **presentational component**. This separation improves reusability because the UI depends only on props, making it easy to test, mock, integrate with design systems, and use in Storybook. To refactor an existing monolithic component, I first extract the JSX into a presentational component that accepts props like data, loading, error, and callbacks. Then I move all state and side effects into a container that wraps the presentational component. Finally, for modern React, I refactor reusable logic into custom hooks like `useProducts` so the container becomes minimal. This approach mirrors production architectures at Facebook, Airbnb, and Uber, offering scalable, testable, and maintainable components for enterprise-grade React applications.
