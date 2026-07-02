# `useArray` Custom Hook

A common custom React hook interview question.

Provides reusable array operations:

```text
✅ Add Item
✅ Remove Item
✅ Update Item
✅ Clear Array
✅ Filter
✅ Reset
✅ Push
✅ Pop
✅ Replace Entire Array
```

***

## useArray.js

```jsx
import { useState, useCallback } from "react";

export function useArray(initialValue = []) {
  const [array, setArray] = useState(initialValue);

  const push = useCallback((item) => {
    setArray((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((index) => {
    setArray((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }, []);

  const update = useCallback(
    (index, newValue) => {
      setArray((prev) =>
        prev.map((item, i) =>
          i === index ? newValue : item
        )
      );
    },
    []
  );

  const filter = useCallback((callback) => {
    setArray((prev) =>
      prev.filter(callback)
    );
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const pop = useCallback(() => {
    setArray((prev) =>
      prev.slice(0, -1)
    );
  }, []);

  const reset = useCallback(() => {
    setArray(initialValue);
  }, [initialValue]);

  return {
    array,
    set: setArray,
    push,
    pop,
    remove,
    update,
    filter,
    clear,
    reset,
  };
}
```

***

## Usage

```jsx
import { useArray } from "./useArray";

export default function App() {
  const {
    array,
    push,
    remove,
    clear,
  } = useArray([
    "React",
    "Vue",
  ]);

  return (
    <>
      <button
        onClick={() =>
          push("Angular")
        }
      >
        Add
      </button>

      <button
        onClick={() =>
          remove(0)
        }
      >
        Remove First
      </button>

      <button
        onClick={clear}
      >
        Clear
      </button>

      {array.map((item) => (
        <div key={item}>
          {item}
        </div>
      ))}
    </>
  );
}
```

***

# `useDefault` Custom Hook

Used when a value can be:

```text
undefined
null
empty
```

and you want a default fallback.

***

## useDefault.js

```jsx
import { useMemo } from "react";

export function useDefault(
  value,
  defaultValue
) {
  return useMemo(() => {
    if (
      value === undefined ||
      value === null
    ) {
      return defaultValue;
    }

    return value;
  }, [value, defaultValue]);
}
```

***

## Usage

```jsx
import { useDefault }
  from "./useDefault";

export default function UserProfile({
  name,
}) {

  const displayName =
    useDefault(
      name,
      "Guest User"
    );

  return (
    <h1>
      {displayName}
    </h1>
  );
}
```

***

## Advanced Version

```jsx
import {
  useState,
} from "react";

export function useDefault(
  initialValue,
  defaultValue
) {
  const [value, setValue] =
    useState(
      initialValue ??
        defaultValue
    );

  return [
    value,
    setValue,
  ];
}
```

Usage:

```jsx
const [
  username,
  setUsername,
] = useDefault(
  undefined,
  "Guest"
);
```

***

# Interview Answer

### `useArray`

> `useArray` abstracts common array operations such as add, remove, update, filter, and reset into a reusable hook. It prevents repetitive state update logic and improves code reuse.

### `useDefault`

> `useDefault` ensures components always receive a valid fallback value when props or state are `null` or `undefined`, reducing defensive checks and simplifying rendering logic.

These are popular custom-hook interview questions because they test:

* Custom hook design
* State abstraction
* Reusability
* API ergonomics
* React Hook best practices
