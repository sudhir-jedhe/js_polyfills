# React 19 `useOptimistic` – Complete Solution

This machine-coding problem tests:

```text
✅ useOptimistic

✅ startTransition

✅ Optimistic UI

✅ Server Success

✅ Server Failure

✅ Rollback State

✅ React 19 APIs
```

***

# Complete Code

```jsx
import React, {
  startTransition,
  useOptimistic,
  useState,
} from "react";

import {
  FaHeart,
} from "react-icons/fa";

/*
  Successful API
*/
async function toggleFavoriteSuccess() {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  return true;
}

/*
  Error API
*/
async function toggleFavoriteError() {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  throw new Error(
    "Server Error"
  );
}

function FavoriteCard({
  title,
  shouldFail = false,
}) {
  const [liked, setLiked] =
    useState(false);

  const [
    optimisticLiked,
    addOptimistic,
  ] = useOptimistic(
    liked,
    (
      currentState,
      nextValue
    ) => nextValue
  );

  async function handleToggle() {
    const nextValue =
      !optimisticLiked;

    /*
      MUST be inside startTransition
    */
    startTransition(() => {
      addOptimistic(
        nextValue
      );
    });

    try {
      if (shouldFail) {
        await toggleFavoriteError();
      } else {
        await toggleFavoriteSuccess();

        setLiked(
          nextValue
        );
      }
    } catch (error) {
      console.error(
        error
      );

      /*
        Rollback happens
        automatically because
        liked state
        never changed.
      */
    }
  }

  return (
    <div
      style={{
        border:
          "1px solid #ddd",
        padding: "20px",
        width: "250px",
        borderRadius:
          "8px",
      }}
    >
      <h3>{title}</h3>

      <button
        onClick={
          handleToggle
        }
        style={{
          background:
            "transparent",
          border:
            "none",
          cursor:
            "pointer",
        }}
      >
        <FaHeart
          data-testid={`${title}-heart`}
          size={40}
          color={
            optimisticLiked
              ? "red"
              : "#ccc"
          }
        />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>
        useOptimistic Demo
      </h1>

      <div
        style={{
          display:
            "flex",
          gap: "24px",
        }}
      >
        <FavoriteCard
          title="Successful toggle"
        />

        <FavoriteCard
          title="Error toggle"
          shouldFail
        />
      </div>
    </div>
  );
}
```

***

# Behaviour

## Initial State

```text
Successful toggle → Grey Heart

Error toggle → Grey Heart
```

***

## Successful Toggle

Click ❤️

```text
Immediately red
          ↓
Server responds
          ↓
Remains red
```

***

## Error Toggle

Click ❤️

```text
Immediately red
          ↓
Server throws error
          ↓
Rollback
          ↓
Grey again
```

***

# Why `startTransition`?

Incorrect:

```jsx
addOptimistic(true);
```

React warns.

Correct:

```jsx
startTransition(() => {
  addOptimistic(true);
});
```

Required when updating optimistic state.

***

# How Rollback Works

Real state:

```jsx
const [liked, setLiked]
```

Optimistic state:

```jsx
const [
  optimisticLiked,
  addOptimistic,
]
```

Success:

```jsx
setLiked(true);
```

Final state matches optimistic state.

***

Failure:

```jsx
setLiked(...)
never happens
```

React automatically reverts optimistic state back to:

```jsx
liked === false
```

***

# Interview Answer

> `useOptimistic` allows the UI to update immediately before the server responds. I keep the actual server-confirmed state in `useState` and derive a temporary optimistic state using `useOptimistic`. I wrap optimistic updates in `startTransition` to avoid React warnings. On success, I persist the change to the real state. On failure, I don't update the real state, which automatically causes React to roll back the optimistic value to the previous confirmed state.
