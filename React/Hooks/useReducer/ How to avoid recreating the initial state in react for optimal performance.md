***   How to avoid recreating the initial state in react for optimal performance.md ***

To avoid recreating expensive initial state on every re-render in React, pass an **initializer function** (also called **lazy initialization**) instead of executing the expensive operation directly inside `useState` or `useReducer`.

---

### 1. The Anti-Pattern: Direct Execution

When you pass the result of a function call directly to `useState`, React only uses the returned value on the **first render**. However, the function will still execute on **every subsequent re-render**, wasting CPU cycles.

```javascript
// ❌ BAD: Parses localStorage and builds state on EVERY re-render
function BadComponent() {
  const [data, setData] = useState(expensiveComputation()); 
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('cart')));
  // ...
}

```

---

### 2. The Solution: Lazy Initialization (`useState`)

Pass a **function reference** or an inline arrow function that returns the initial value. React will only invoke this function **once** during the initial mount.

```javascript
// ✅ GOOD: Executed ONLY during the initial render
function GoodComponent() {
  const [data, setData] = useState(expensiveComputation); // Pass function reference

  // Or pass an anonymous arrow function for parameterized calls:
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  // ...
}

```

---

### 3. Lazy Initialization with `useReducer`

For `useReducer`, pass the initial argument as the 2nd parameter and the **initializer function** as the 3rd parameter.

```javascript
function createInitialState(rawConfig) {
  // Heavy computation/transformation logic here
  return { ...rawConfig, processed: true };
}

function ReducerComponent({ config }) {
  // ❌ BAD: Runs createInitialState(config) on every render
  // const [state, dispatch] = useReducer(reducer, createInitialState(config));

  // ✅ GOOD: 3rd argument is the initializer; runs only on mount
  const [state, dispatch] = useReducer(reducer, config, createInitialState);
  // ...
}

```

---

### 4. Avoiding Recreating Initial Ref Values (`useRef`)

Unlike `useState`, `useRef` does not accept an initializer function. You can achieve lazy initialization by storing `null` initially and assigning it on demand:

```javascript
function RefComponent() {
  const audioContextRef = useRef(null);

  function getAudioContext() {
    if (audioContextRef.current === null) {
      audioContextRef.current = new AudioContext(); // Created only once
    }
    return audioContextRef.current;
  }
  // ...
}

```

---

### Summary Checklist

* **Use Lazy State (`() => initValue`)** for parsing `localStorage`, generating large arrays, filtering large datasets, or decoding tokens.
* **Keep pure primitives direct** (`useState(0)`, `useState(false)`); lazy initialization is unnecessary overhead for simple static primitives.
