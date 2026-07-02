# `useMap` Custom Hook

A reusable hook for managing a JavaScript `Map`.

### Features

```text
✅ set(key, value)
✅ get(key)
✅ remove(key)
✅ clear()
✅ reset()
✅ has(key)
✅ size
```

***

## useMap.js

```jsx
import {
  useState,
  useCallback,
} from "react";

export function useMap(
  initialValue = new Map()
) {
  const [map, setMap] =
    useState(
      new Map(initialValue)
    );

  const set = useCallback(
    (key, value) => {
      setMap(prev => {
        const copy =
          new Map(prev);

        copy.set(
          key,
          value
        );

        return copy;
      });
    },
    []
  );

  const remove =
    useCallback(key => {
      setMap(prev => {
        const copy =
          new Map(prev);

        copy.delete(key);

        return copy;
      });
    }, []);

  const clear =
    useCallback(() => {
      setMap(new Map());
    }, []);

  const reset =
    useCallback(() => {
      setMap(
        new Map(
          initialValue
        )
      );
    }, [initialValue]);

  const get =
    useCallback(
      key => map.get(key),
      [map]
    );

  const has =
    useCallback(
      key => map.has(key),
      [map]
    );

  return {
    map,
    set,
    get,
    has,
    remove,
    clear,
    reset,
    size: map.size,
  };
}
```

***

## Usage

```jsx
function App() {
  const {
    map,
    set,
    remove,
    size,
  } = useMap();

  return (
    <>
      <button
        onClick={() =>
          set(
            "name",
            "Sudhir"
          )
        }
      >
        Add
      </button>

      <button
        onClick={() =>
          remove("name")
        }
      >
        Remove
      </button>

      <p>
        Size: {size}
      </p>

      {[...map.entries()].map(
        ([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        )
      )}
    </>
  );
}
```

***

# `useStateWithReset`

Enhances `useState` with a `reset()` method.

### Features

```text
✅ setState
✅ reset
✅ functional updates
✅ reusable
```

***

## useStateWithReset.js

```jsx
import {
  useState,
  useCallback,
} from "react";

export function useStateWithReset(
  initialValue
) {
  const [state, setState] =
    useState(
      initialValue
    );

  const reset =
    useCallback(() => {
      setState(
        initialValue
      );
    }, [initialValue]);

  return [
    state,
    setState,
    reset,
  ];
}
```

***

## Usage

```jsx
import { useStateWithReset }
  from "./useStateWithReset";

function App() {
  const [
    count,
    setCount,
    reset,
  ] =
    useStateWithReset(
      0
    );

  return (
    <>
      <h2>
        {count}
      </h2>

      <button
        onClick={() =>
          setCount(
            prev =>
              prev + 1
          )
        }
      >
        Increment
      </button>

      <button
        onClick={reset}
      >
        Reset
      </button>
    </>
  );
}
```

***

# Advanced `useStateWithReset`

```jsx
import {
  useRef,
  useState,
  useCallback,
} from "react";

export function useStateWithReset(
  initialValue
) {
  const initialRef =
    useRef(
      initialValue
    );

  const [state, setState] =
    useState(
      initialValue
    );

  const reset =
    useCallback(() => {
      setState(
        initialRef.current
      );
    }, []);

  return {
    state,
    setState,
    reset,
  };
}
```

***

# Interview Answer

### `useMap`

> `useMap` encapsulates Map operations such as set, get, delete, clear, and reset while preserving React immutability by creating a new `Map` instance on updates.

### `useStateWithReset`

> `useStateWithReset` extends React's `useState` by exposing a `reset()` function that restores the state back to its initial value, making form resets and wizard flows much simpler.

### Complexity

```text
useMap

set      O(1)
get      O(1)
delete   O(1)

useStateWithReset

setState O(1)
reset    O(1)
```
