# Shopping Cart Checkout (React Machine Coding Interview)

A Shopping Cart Checkout flow is one of the most frequently asked React machine-coding problems. Common requirements include:

* Product listing
* Add to cart
* Remove item
* Quantity update
* Dynamic totals
* Checkout flow
* Order confirmation [\[linkedin.com\]](https://www.linkedin.com/posts/ranjna-devi-7a69a6137_machine-coding-round-shopping-cart-add-activity-7445856550293979136-U9jK), [\[youtube.com\]](https://www.youtube.com/watch?v=r9v9nR6QQYE), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/reactjs/shopping-cart-app-using-react/)

Enterprise examples in internal commerce and user-story documents describe shopping cart management, cart review, quantity updates, total calculation, and checkout confirmation as core checkout requirements. [\[Writing Go...e written  \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjk1NzYxOTEwMjEwNTYwMCJ9), [\[Generating...right test \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzUxMTM2OTk0NDU4MDA5NiJ9)

***

# Requirements

✅ Add Product

✅ Remove Product

✅ Increase Quantity

✅ Decrease Quantity

✅ Calculate Subtotal

✅ Tax Calculation

✅ Shipping Charge

✅ Order Total

✅ Checkout

✅ Order Confirmation

***

# Folder Structure

```text
src/
├── App.tsx
├── data/products.ts
├── components/
│   ├── ProductList.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── OrderSuccess.tsx
├── context/
│   └── CartContext.tsx
└── styles.css
```

***

# Types

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem
  extends Product {
  quantity: number;
}
```

***

# Mock Products

```ts
export const products = [
  {
    id: 1,
    name: "Laptop",
    price: 80000,
  },
  {
    id: 2,
    name: "Phone",
    price: 35000,
  },
  {
    id: 3,
    name: "Headphones",
    price: 5000,
  },
];
```

***

# Cart Context

```tsx
import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext =
  createContext<any>(null);

export function CartProvider({
  children,
}: any) {
  const [cart, setCart] =
    useState([]);

  const addToCart = (
    product
  ) => {
    setCart(prev => {
      const existing =
        prev.find(
          item =>
            item.id ===
            product.id
        );

      if (existing) {
        return prev.map(
          item =>
            item.id ===
            product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    1,
                }
              : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = id => {
    setCart(prev =>
      prev.filter(
        item =>
          item.id !== id
      )
    );
  };

  const updateQuantity = (
    id,
    qty
  ) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                Math.max(
                  1,
                  qty
                ),
            }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart =
  () =>
    useContext(
      CartContext
    );
```

***

# Product List

```tsx
import { products }
from "../data/products";

import { useCart }
from "../context/CartContext";

export default function ProductList() {
  const {
    addToCart,
  } = useCart();

  return (
    <div>
      <h2>
        Products
      </h2>

      {products.map(
        product => (
          <div
            key={
              product.id
            }
            className="card"
          >
            <h3>
              {product.name}
            </h3>

            <p>
              ₹{
                product.price
              }
            </p>

            <button
              onClick={() =>
                addToCart(
                  product
                )
              }
            >
              Add To Cart
            </button>
          </div>
        )
      )}
    </div>
  );
}
```

***

# Cart Component

```tsx
import { useCart }
from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <div>
      <h2>
        Shopping Cart
      </h2>

      {cart.map(item => (
        <div
          key={item.id}
          className="cart-row"
        >
          <span>
            {item.name}
          </span>

          <button
            onClick={() =>
              updateQuantity(
                item.id,
                item.quantity -
                  1
              )
            }
          >
            -
          </button>

          <span>
            {
              item.quantity
            }
          </span>

          <button
            onClick={() =>
              updateQuantity(
                item.id,
                item.quantity +
                  1
              )
            }
          >
            +
          </button>

          <span>
            ₹
            {item.price *
              item.quantity}
          </span>

          <button
            onClick={() =>
              removeItem(
                item.id
              )
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

***

# Checkout Component

```tsx
import { useCart }
from "../context/CartContext";

interface Props {
  onCheckout:
    () => void;
}

export default function Checkout({
  onCheckout,
}: Props) {
  const {
    cart,
  } = useCart();

  const subtotal =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const tax =
    subtotal * 0.18;

  const shipping =
    subtotal > 50000
      ? 0
      : 500;

  const total =
    subtotal +
    tax +
    shipping;

  return (
    <div>
      <h2>
        Checkout
      </h2>

      <p>
        Subtotal:
        ₹
        {subtotal}
      </p>

      <p>
        Tax:
        ₹
        {tax}
      </p>

      <p>
        Shipping:
        ₹
        {shipping}
      </p>

      <h3>
        Total:
        ₹{total}
      </h3>

      <button
        onClick={
          onCheckout
        }
      >
        Place Order
      </button>
    </div>
  );
}
```

***

# Order Success

```tsx
export default function OrderSuccess() {
  return (
    <div>
      <h2>
        ✅ Order Placed
      </h2>

      <p>
        Thank you for
        shopping.
      </p>
    </div>
  );
}
```

***

# App.tsx

```tsx
import {
  useState,
} from "react";

import ProductList
from "./components/ProductList";

import Cart
from "./components/Cart";

import Checkout
from "./components/Checkout";

import OrderSuccess
from "./components/OrderSuccess";

import {
  CartProvider,
} from "./context/CartContext";

export default function App() {
  const [
    orderPlaced,
    setOrderPlaced,
  ] = useState(false);

  return (
    <CartProvider>
      <div>
        <ProductList />

        <Cart />

        {!orderPlaced ? (
          <Checkout
            onCheckout={() =>
              setOrderPlaced(
                true
              )
            }
          />
        ) : (
          <OrderSuccess />
        )}
      </div>
    </CartProvider>
  );
}
```

***

# Interview Discussion

### State Machine

```text
BROWSING
    ↓
CART
    ↓
CHECKOUT
    ↓
PAYMENT
    ↓
SUCCESS
```

### Optimisations

```text
✅ Context API
✅ Redux Toolkit
✅ React Query
✅ LocalStorage Persistence
✅ Coupon Support
✅ Inventory Validation
✅ Payment Gateway
✅ Address Management
✅ Order Tracking
✅ Guest Checkout
```

### Complexity

```text
Add Item        O(n)
Remove Item     O(n)
Update Qty      O(n)
Calculate Total O(n)
```

### Senior-Level Architecture

```text
Product Page
      │
      ▼
Cart Store
      │
      ▼
Checkout
      │
      ▼
Payment Gateway
      │
      ▼
Order Service
      │
      ▼
Confirmation
```

This implementation covers the exact behaviours typically expected in a React machine-coding round: add-to-cart, quantity management, total calculations, cart review, checkout, and order confirmation. [\[linkedin.com\]](https://www.linkedin.com/posts/ranjna-devi-7a69a6137_machine-coding-round-shopping-cart-add-activity-7445856550293979136-U9jK), [\[youtube.com\]](https://www.youtube.com/watch?v=r9v9nR6QQYE), [\[Writing Go...e written  \| Viva Engage\]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMjk1NzYxOTEwMjEwNTYwMCJ9)
