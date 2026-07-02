# Shopping Cart with Redux Toolkit + TypeScript

Redux Toolkit's `createSlice` is the standard approach for writing Redux logic and automatically generates actions and reducers. It also uses Immer internally, allowing reducer code that appears to mutate state safely. [\[redux-toolkit.js.org\]](https://redux-toolkit.js.org/api/createslice/)

***

# cartSlice.ts

```tsx
import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export interface Product {
  id: number;
  title: string;
  price: number;
}

export interface CartProduct
  extends Product {
  quantity: number;
}

interface CartState {
  productsInCart: CartProduct[];
  showCart: boolean;
}

const initialState: CartState = {
  productsInCart: [],
  showCart: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addProductToCart: (
      state,
      action: PayloadAction<Product>
    ) => {
      const existing =
        state.productsInCart.find(
          item =>
            item.id ===
            action.payload.id
        );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.productsInCart.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<Product>
    ) => {
      state.productsInCart =
        state.productsInCart.filter(
          item =>
            item.id !==
            action.payload.id
        );
    },

    addQuantity: (
      state,
      action: PayloadAction<Product>
    ) => {
      const item =
        state.productsInCart.find(
          p =>
            p.id ===
            action.payload.id
        );

      if (item) {
        item.quantity += 1;
      }
    },

    removeQuantity: (
      state,
      action: PayloadAction<Product>
    ) => {
      const item =
        state.productsInCart.find(
          p =>
            p.id ===
            action.payload.id
        );

      if (!item) return;

      item.quantity -= 1;

      if (
        item.quantity <= 0
      ) {
        state.productsInCart =
          state.productsInCart.filter(
            p =>
              p.id !== item.id
          );
      }
    },

    clearCart: state => {
      state.productsInCart =
        [];
    },

    toggleShowCart:
      state => {
        state.showCart =
          !state.showCart;
      },
  },
});

export const {
  addProductToCart,
  removeFromCart,
  addQuantity,
  removeQuantity,
  clearCart,
  toggleShowCart,
} = cartSlice.actions;

export default cartSlice.reducer;
```

***

# App.tsx

```tsx
import { Provider } from "react-redux";
import { store } from "./store";

import {
  Products,
  Cart,
} from "./Components";

export default function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>
          Shopping Cart
        </h1>

        <Products />

        <Cart />
      </div>
    </Provider>
  );
}
```

***

# Components.tsx

```tsx
import {
  useDispatch,
  useSelector,
} from "react-redux";

import type {
  RootState,
} from "./store";

import {
  addProductToCart,
  removeFromCart,
  addQuantity,
  removeQuantity,
  clearCart,
  toggleShowCart,
} from "./cartSlice";

const products = [
  {
    id: 1,
    title: "Laptop",
    price: 1000,
  },
  {
    id: 2,
    title: "Phone",
    price: 500,
  },
  {
    id: 3,
    title: "Tablet",
    price: 300,
  },
];

export function Products() {
  const dispatch =
    useDispatch();

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
          >
            <span>
              {
                product.title
              }{" "}
              (${product.price})
            </span>

            <button
              onClick={() =>
                dispatch(
                  addProductToCart(
                    product
                  )
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

export function Cart() {
  const dispatch =
    useDispatch();

  const {
    productsInCart,
    showCart,
  } = useSelector(
    (
      state: RootState
    ) => state.cart
  );

  const totalItems =
    productsInCart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  const totalPrice =
    productsInCart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (
    <div>
      <button
        onClick={() =>
          dispatch(
            toggleShowCart()
          )
        }
      >
        Cart (
        {totalItems})
      </button>

      {showCart && (
        <div>
          <h2>
            Shopping Cart
          </h2>

          {productsInCart.map(
            item => (
              <div
                key={
                  item.id
                }
              >
                <h4>
                  {
                    item.title
                  }
                </h4>

                <p>
                  Quantity:
                  {
                    item.quantity
                  }
                </p>

                <p>
                  Total:
                  $
                  {item.price *
                    item.quantity}
                </p>

                <button
                  onClick={() =>
                    dispatch(
                      addQuantity(
                        item
                      )
                    )
                  }
                >
                  +
                </button>

                <button
                  onClick={() =>
                    dispatch(
                      removeQuantity(
                        item
                      )
                    )
                  }
                >
                  -
                </button>

                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart(
                        item
                      )
                    )
                  }
                >
                  Remove
                </button>
              </div>
            )
          )}

          <h3>
            Grand Total:
            $
            {totalPrice}
          </h3>

          <button
            onClick={() =>
              dispatch(
                clearCart()
              )
            }
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
```

***

# Why This Passes the Tests

### Add Product

```ts
addProductToCart()
```

Checks if product exists:

```ts
existing.quantity += 1
```

Prevents duplicate products. [\[dev.to\]](https://dev.to/avinash_krishnan/add-to-cart-feature-in-react-with-redux-toolkit-24f7), [\[redux-toolkit.js.org\]](https://redux-toolkit.js.org/api/createslice/)

***

### Increment Quantity

```ts
addQuantity()
```

```text
1 → 2 → 3
```

***

### Decrement Quantity

```ts
removeQuantity()
```

```text
2 → 1 → 0
```

Automatically removes the item when quantity reaches zero.

***

### Cart Badge

```ts
productsInCart.reduce(
  (sum, item) =>
    sum + item.quantity
)
```

Shows total item count.

***

### Cart Total

```ts
price * quantity
```

Summed across all cart items.

***

### Toggle Cart

```ts
toggleShowCart()
```

```text
false → true
true → false
```

***

### Clear Cart

```ts
clearCart()
```

Removes every item.

***

# Senior Interview Talking Points

```text
State Shape

{
  productsInCart: [],
  showCart: false
}
```

```text
Selectors

cartItems
cartTotal
cartBadgeCount
```

```text
Redux Toolkit

✅ createSlice
✅ Immer
✅ Typed PayloadAction
✅ Auto Action Creators
```

Redux Toolkit's `createSlice` automatically generates action creators and reducer logic while allowing concise reducer code. [\[redux-toolkit.js.org\]](https://redux-toolkit.js.org/api/createslice/)

This is the typical Redux Toolkit shopping-cart solution expected in React/Frontend machine-coding interviews.
