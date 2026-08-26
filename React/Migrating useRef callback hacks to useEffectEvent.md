Before `useEffectEvent`, the standard React workaround for reading the latest props or state inside an effect without re-triggering that effect was the **"latest ref callback hack"** (often implemented via custom hooks like `useLatest`, `useEvent`, or manual `useRef` assignments).

`useEffectEvent` replaces these hacks with a first-class, compiler-safe API that eliminates boilerplate and avoids concurrent rendering edge cases.

---

### The Anatomy of the Legacy `useRef` Hack

In older React versions, developers kept a mutable ref in sync with a callback on every render to bypass the `useEffect` dependency array:

```tsx
// ❌ Legacy Pattern: Manual ref synchronization hack
import { useEffect, useRef } from 'react';

function ChatRoom({ roomId, theme, onConnected }) {
  // 1. Maintain a ref for the latest callback/values
  const savedCallback = useRef(onConnected);
  const themeRef = useRef(theme);

  // 2. Synchronize ref values on every render
  useEffect(() => {
    savedCallback.current = onConnected;
    themeRef.current = theme;
  });

  // 3. Effect reads from the refs to avoid dependency tracking
  useEffect(() => {
    const socket = connectToChat(roomId);

    socket.on('connect', () => {
      // Accessing mutable ref values
      if (savedCallback.current) {
        savedCallback.current(themeRef.current);
      }
    });

    return () => socket.disconnect();
  }, [roomId]); // Only re-run when roomId changes
}

```

#### Why the `useRef` Hack Was Flawed

* **Manual Lifecycle Sync:** Required separate `useEffect` calls or render-time mutations (`ref.current = ...`) just to keep references up to date.
* **Concurrent Rendering Hazards:** Mutating refs directly during render breaks Concurrent React guarantees (since renders can be aborted or run speculatively).
* **Verbose & Fragile:** Easy to forget updating a ref, creating silent bugs where stale values persist.

---

### The Modern Solution: `useEffectEvent`

With `useEffectEvent`, you extract the non-reactive behavior into a single declarative function. React guarantees that it always captures the latest render scope without needing to be listed in the effect's dependency array.

```tsx
// ✅ Modern Pattern: Clean, declarative useEffectEvent
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme, onConnected }) {
  // 1. Declare the Effect Event (always sees fresh props & state)
  const onConnectEvent = useEffectEvent(() => {
    onConnected(theme);
  });

  // 2. Effect only declares true reactive triggers
  useEffect(() => {
    const socket = connectToChat(roomId);

    socket.on('connect', () => {
      onConnectEvent(); // Safe, non-reactive invocation
    });

    return () => socket.disconnect();
  }, [roomId]); // Clean dependency array
}

```

---

### Common Migration Scenarios

#### Scenario 1: Migrating `useInterval` / Timer Callbacks

**Before (`useRef` Hack):**

```tsx
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

```

**After (`useEffectEvent`):**

```tsx
function useInterval(callback: () => void, delay: number) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    const id = setInterval(() => onTick(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

```

---

#### Scenario 2: Migrating Analytics / Page View Logging

**Before (`useRef` Hack):**

```tsx
function ProductPage({ productId, currentUser, analyticsService }) {
  const userRef = useRef(currentUser);
  userRef.current = currentUser;

  useEffect(() => {
    // Only log once when productId changes, but read latest user details
    analyticsService.logView(productId, userRef.current.plan);
  }, [productId, analyticsService]);
}

```

**After (`useEffectEvent`):**

```tsx
function ProductPage({ productId, currentUser, analyticsService }) {
  const logPageView = useEffectEvent((id: string) => {
    analyticsService.logView(id, currentUser.plan);
  });

  useEffect(() => {
    logPageView(productId);
  }, [productId]); // currentUser is omitted safely
}

```

---

### Step-by-Step Refactoring Checklist

1. **Find `useRef` Callbacks:** Identify any `useRef` used exclusively to store a function or reactive prop for consumption inside `useEffect`.
2. **Remove Sync Effects:** Delete the companion `useEffect(() => { ref.current = fn; })` blocks or render-time `ref.current = fn` assignments.
3. **Replace with `useEffectEvent`:** Wrap the non-reactive logic in `useEffectEvent(...)`.
4. **Clean Dependencies:** Remove the ref and non-reactive values from the `useEffect` dependency array. The official React ESLint plugin automatically recognizes `useEffectEvent` and forbids it from being listed in dependencies.

---

### Comparison: `useRef` Hack vs `useEffectEvent`

| Feature                | Legacy `useRef` Hack                                    | `useEffectEvent`                            |
| ---------------------- | ------------------------------------------------------- | ------------------------------------------- |
| **Boilerplate**        | High (ref declaration + sync effect + `.current` calls) | **Minimal (single function wrapper)**       |
| **Concurrent Safety**  | Risky during concurrent / interrupted renders           | **100% Concurrent Mode safe**               |
| **Dependency Linting** | Requires ignoring ESLint or using non-standard rules    | **Natively understood by React ESLint**     |
| **Execution Context**  | Reads mutable `.current` pointer                        | **Binds to latest committed Fiber closure** |
| **Usage Restrictions** | Can be called anywhere (prone to misuse)                | **Strictly constrained to `useEffect**`     |
