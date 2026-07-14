# Map Data Structure with Event Listener (Reactive Map)

### JavaScript System Design + Complete Implementation

This is a common **Senior JavaScript / Frontend System Design** interview question.

Real-world use cases:

```txt
Redux State
Firebase Realtime DB
MobX Observables
Reactive Systems
Event-Driven Architectures
Live Chat State
Stock Ticker Updates
Configuration Change Detection
```

---

# 1. Requirements

## Functional

✅ Get / Set / Delete values

✅ Emit events on changes

✅ Support listeners

```txt
add
update
delete
clear
```

✅ Multiple subscribers per event

✅ Ability to unsubscribe

✅ Chainable API

---

# 2. Design

## Component Diagram

```txt
ReactiveMap
     │
     ├── Internal Map (data)
     │
     ├── Event Listeners
     │     ├── set
     │     ├── update
     │     ├── delete
     │     ├── clear
     │
     ├── on(event, callback)
     ├── off(event, callback)
     ├── emit(event, payload)
     │
     └── Public API
           ├── get(key)
           ├── set(key, value)
           ├── delete(key)
           ├── clear()
           ├── has(key)
           └── size()
```

---

# 3. Data Flow

```txt
User calls set()
      │
      ▼
Update Internal Map
      │
      ▼
Emit "set" or "update"
      │
      ▼
All Listeners Notified
```

---

# 4. Implementation

```js
class ReactiveMap {
  constructor() {
    this.store = new Map();

    this.listeners = new Map();
  }

  // Subscribe
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);

    // Return unsubscribe fn
    return () => this.off(event, callback);
  }

  // Unsubscribe
  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  // Emit
  emit(event, payload) {
    this.listeners.get(event)?.forEach((callback) => callback(payload));
  }

  // Getter
  get(key) {
    return this.store.get(key);
  }

  has(key) {
    return this.store.has(key);
  }

  size() {
    return this.store.size;
  }

  // Setter
  set(key, value) {
    const existed = this.store.has(key);

    const oldValue = this.store.get(key);

    this.store.set(key, value);

    if (existed) {
      this.emit("update", {
        key,
        oldValue,
        newValue: value,
      });
    } else {
      this.emit("set", {
        key,
        value,
      });
    }

    this.emit("change", {
      key,
      value,
    });

    return this;
  }

  delete(key) {
    if (!this.store.has(key)) {
      return false;
    }

    const oldValue = this.store.get(key);

    this.store.delete(key);

    this.emit("delete", {
      key,
      oldValue,
    });

    this.emit("change", {
      key,
      value: undefined,
    });

    return true;
  }

  clear() {
    this.store.clear();

    this.emit("clear", {});

    this.emit("change", {});
  }
}
```

---

# 5. Usage Example

```js
const map = new ReactiveMap();
```

Subscribe:

```js
const unsubscribe = map.on("set", ({ key, value }) => {
  console.log("Added:", key, value);
});
```

---

Add data:

```js
map.set("name", "Sudhir");
map.set("age", 30);
```

Console output:

```txt
Added: name Sudhir
Added: age 30
```

---

Update data:

```js
map.on("update", ({ key, oldValue, newValue }) => {
  console.log(`Updated ${key}: ${oldValue} → ${newValue}`);
});

map.set("age", 31);
```

Output:

```txt
Updated age: 30 → 31
```

---

Delete data:

```js
map.on("delete", ({ key }) => {
  console.log("Deleted:", key);
});

map.delete("age");
```

Output:

```txt
Deleted: age
```

---

Clear data:

```js
map.on("clear", () => {
  console.log("Map cleared");
});

map.clear();
```

Output:

```txt
Map cleared
```

---

Unsubscribe:

```js
unsubscribe();
```

---

# 6. Complexity

## Time Complexity

```txt
get()    → O(1)
set()    → O(1)
delete() → O(1)
emit()   → O(k)  (k = listeners)
```

## Space Complexity

```txt
Store     → O(n)
Listeners → O(k)
```

---

# 7. Real-World Use Cases

### Config Store

```js
const config = new ReactiveMap();

config.on("update", () => rerenderUI());
```

---

### Chat System

```js
messages.on("set", (msg) => renderMessage(msg));
```

---

### Live Stock Ticker

```js
prices.on("update", ({ key, newValue }) => {
  updatePriceUI(key, newValue);
});
```

---

### Global State

```js
state.on("change", render);
```

---

# 8. Advanced Extensions

### 1. Namespaced Events

```js
map.on("set:user.name", callback);
```

Useful for nested keys.

---

### 2. Middleware

```js
map.use((event, payload) => {
  console.log(event, payload);
});
```

Similar to Redux.

---

### 3. Debounced Emitters

Prevent frequent updates:

```js
debounce(emit, 200);
```

---

### 4. History Tracking

Store past values:

```js
map.history = [];
```

Enables undo/redo.

---

### 5. Observability

```js
map.on("*", callback);
```

Wildcard listener like Node.js EventEmitter.

---

### 6. Persistence

Save state to:

```txt
localStorage
IndexedDB
```

Rehydrate on load.

---

### 7. React Integration

Convert to hook:

```js
function useMapValue(key) {
  const [value, setValue] = useState(map.get(key));

  useEffect(() => {
    const unsub = map.on("change", ({ key: k, value: v }) => {
      if (k === key) {
        setValue(v);
      }
    });

    return unsub;
  }, [key]);

  return value;
}
```

---

# 9. Interview Comparison

## Regular Map vs ReactiveMap

| Feature           | Map | ReactiveMap   |
| ----------------- | --- | ------------- |
| Get / Set         | ✅  | ✅            |
| Listeners         | ❌  | ✅            |
| Change Detection  | ❌  | ✅            |
| Undo / Redo       | ❌  | ✅ (Optional) |
| Multi Subscribers | ❌  | ✅            |
| Frontend State    | ❌  | ✅            |

---

# 10. Senior JavaScript Interview Answer

> I would implement `ReactiveMap` as an event-emitting wrapper over the native `Map`. It exposes `on`, `off`, and `emit` methods for pub/sub behavior. Every mutation (`set`, `delete`, `clear`) automatically emits domain-specific events like `set`, `update`, `delete`, and `change` so listeners can react in real time. Each `on()` returns an unsubscribe function to prevent memory leaks. The design supports multiple listeners per event, chainable APIs, and constant-time operations. Extensions like namespaced events, middleware, history tracking, wildcard listeners, persistence, and React hook integration make it suitable for building reactive systems similar to Redux, MobX, Firebase, and observable stores.

# ReactiveMap Advanced Usage

### Event Listeners • Unsubscription • React Hook Integration

These are the **three most common Senior JavaScript / React interview follow-ups** after implementing a ReactiveMap.

They test:

✅ Real event-driven design

✅ Memory-safe subscriptions

✅ React reactivity patterns

✅ Custom hooks

---

# 1. Full Example Usage With Event Listeners

Create map instance:

```js
const userMap = new ReactiveMap();
```

---

## Add Listeners

```js
userMap.on("set", ({ key, value }) => {
  console.log("Added:", key, value);
});

userMap.on("update", ({ key, oldValue, newValue }) => {
  console.log(`Updated ${key}:`, oldValue, "→", newValue);
});

userMap.on("delete", ({ key }) => {
  console.log("Removed:", key);
});

userMap.on("clear", () => {
  console.log("Cleared all users");
});
```

---

## Set Data

```js
userMap.set("sudhir", { role: "Lead" });

userMap.set("apoorva", { role: "Manager" });
```

Output:

```txt
Added: sudhir  { role: "Lead" }
Added: apoorva { role: "Manager" }
```

---

## Update Existing Key

```js
userMap.set("sudhir", { role: "Architect" });
```

Output:

```txt
Updated sudhir:
{ role: "Lead" } → { role: "Architect" }
```

---

## Delete

```js
userMap.delete("apoorva");
```

Output:

```txt
Removed: apoorva
```

---

## Clear

```js
userMap.clear();
```

Output:

```txt
Cleared all users
```

---

# 2. How to Unsubscribe from Events

## Why?

Without unsubscribing:

```txt
❌ Memory Leaks
❌ Ghost handlers
❌ Duplicate side effects
❌ Broken cleanup
```

Especially in React apps where components mount/unmount frequently.

---

## Best Practice: Return Unsubscribe Function

Inside `on()`:

```js
on(event, callback) {

  if (
    !this.listeners.has(
      event
    )
  ) {
    this.listeners.set(
      event,
      new Set()
    );
  }

  this.listeners
    .get(event)
    .add(callback);

  return () =>
    this.off(
      event,
      callback
    );
}
```

---

## Usage

```js
const unsubscribe = userMap.on("set", ({ key, value }) => {
  console.log("Added:", key);
});
```

---

## Later

```js
unsubscribe();
```

Removes the handler.

Verified:

```js
userMap.set("amit", { role: "Analyst" });
```

No console output.

---

## Alternative Manual Unsubscribe

```js
function handler(payload) {
  console.log(payload);
}

userMap.on("set", handler);

// Later
userMap.off("set", handler);
```

---

## Very Common Interview Question

### Q: Why return unsubscribe function instead of using `off()`?

Because:

✅ Guarantees exact function is removed

✅ Prevents typos

✅ Works well in `useEffect` cleanup

✅ Enables closures / private handlers

---

# 3. React Integration Using Custom Hook

We integrate `ReactiveMap` into React using hooks so components automatically update when data changes.

---

## Create Reactive Instance (Singleton)

Store globally:

```js
export const globalMap = new ReactiveMap();
```

Or scope it to a feature:

```js
export const cart = new ReactiveMap();
```

---

## Custom Hook

```jsx
import { useState, useEffect } from "react";

export function useReactiveMap(map, key) {
  const [value, setValue] = useState(map.get(key));

  useEffect(() => {
    setValue(map.get(key));

    const handler = ({ key: k, value: v }) => {
      if (k === key) {
        setValue(v);
      }
    };

    const unsub = map.on("change", handler);

    return unsub;
  }, [map, key]);

  return value;
}
```

---

## Full Reactive Hook (Whole Map)

Watches entire map, not a single key:

```jsx
export function useReactiveMapAll(map) {
  const [snapshot, setSnapshot] = useState(() => Object.fromEntries(map.store));

  useEffect(() => {
    const update = () => {
      setSnapshot(Object.fromEntries(map.store));
    };

    const unsub = map.on("change", update);

    const unsub2 = map.on("clear", update);

    return () => {
      unsub();
      unsub2();
    };
  }, [map]);

  return snapshot;
}
```

---

## Component Example

```jsx
import { useReactiveMap } from "./useReactiveMap";

import { userMap } from "./userMap";

export default function UserView() {
  const sudhir = useReactiveMap(userMap, "sudhir");

  return (
    <div>
      <h3>Sudhir</h3>

      <pre>{JSON.stringify(sudhir, null, 2)}</pre>
    </div>
  );
}
```

---

## Trigger Change

Anywhere in the app:

```js
userMap.set("sudhir", { role: "Architect" });
```

UI updates automatically:

```txt
{
  "role": "Architect"
}
```

---

## Reactive Snapshot Example

```jsx
import { useReactiveMapAll } from "./hooks";

import { userMap } from "./userMap";

export default function AllUsers() {
  const users = useReactiveMapAll(userMap);

  return (
    <ul>
      {Object.entries(users).map(([id, data]) => (
        <li key={id}>
          {id} — {data.role}
        </li>
      ))}
    </ul>
  );
}
```

---

# 4. Data Flow Diagram

```txt
Component
   ↓
useReactiveMap()
   ↓
map.on("change")
   ↓
Handler updates state
   ↓
Component rerenders
```

---

# 5. Why This is Powerful

## Benefits

✅ Global reactive state

✅ No Redux needed

✅ No Context API needed

✅ Multiple components auto-sync

✅ Similar to MobX / Firebase behaviour

✅ Extremely lightweight

---

# 6. Real-Life Examples

### Notifications

```js
notifications.set("id123", { message: "New order" });
```

Any component using:

```js
useReactiveMap(notifications, "id123");
```

updates instantly.

---

### Chat App

```js
messages.set("id-9", {
  user: "Sudhir",
  text: "Hi",
});
```

Chat UI receives update.

---

### Live Config Store

```js
config.set("theme", "dark");
```

All components using theme update automatically.

---

# 7. Optimizations

✅ Debounced updates for high-frequency changes

✅ Selective listeners using key namespacing

✅ Batching multiple updates

✅ Weak subscribers for memory safety

✅ Wildcard support

✅ Persistence via localStorage

---

# 8. Senior React Interview Answer

> A reactive map should be extended with an event system that emits `set`, `update`, `delete`, `clear`, and `change` events on every mutation. Consumers subscribe using `on()`, which returns an unsubscribe function to guarantee correct cleanup and avoid memory leaks. In React, we integrate this using a custom hook that reads the initial value from the map and subscribes to the `change` event. Whenever the map is updated externally, the hook updates local state via `useState`, causing the component to re-render automatically. This forms the foundation of a lightweight reactive state store similar to MobX or Firebase — perfect for chat systems, notifications, live configs, and event-driven UIs.

# ReactiveMap Advanced Patterns

### Multiple Listeners • Best Practices • Error Handling

These are the **three most common Senior Frontend interview follow-ups** after implementing a ReactiveMap in large-scale React applications.

---

# 1. Handling Multiple Event Listeners for the Same Event

## Why?

Multiple parts of an app may care about the same event:

```txt
User Component  → listens for "set"
Chat Component  → listens for "set"
Analytics       → listens for "set"
Logger          → listens for "set"
```

All must be notified.

---

## Approach

Use `Set` internally.

Each event gets its own set of callbacks.

```txt
Event → Set<Callback>
```

---

## Storage Design

```js
this.listeners = new Map();
```

Example:

```txt
{
  set    → Set{cb1, cb2, cb3},
  update → Set{cb4},
  delete → Set{cb5}
}
```

---

## Register Listener

```js
on(event, callback) {

  if (
    !this.listeners.has(
      event
    )
  ) {

    this.listeners.set(
      event,
      new Set()
    );
  }

  this.listeners
    .get(event)
    .add(callback);

  return () =>
    this.off(
      event,
      callback
    );
}
```

---

## Emit To All

```js
emit(event, payload) {

  this.listeners
    .get(event)
    ?.forEach((cb) => cb(payload));
}
```

---

## Example

```js
map.on("set", (data) => console.log("Logger:", data));

map.on("set", (data) => sendAnalytics(data));

map.on("set", (data) => updateUI(data));
```

Now:

```js
map.set("name", "Sudhir");
```

All 3 listeners run.

---

## Prevent Duplicates

Using `Set` automatically prevents duplicates.

```js
map.on("set", handler);
map.on("set", handler); // Ignored
```

Only one instance stored.

---

## Wildcard Listener

Common in enterprise systems.

```js
map.on("*", (event, payload) => {
  console.log("Global:", event, payload);
});
```

Implementation:

```js
emit(event, payload) {

  this.listeners
    .get(event)
    ?.forEach(cb =>
      cb(payload)
    );

  this.listeners
    .get("*")
    ?.forEach(cb =>
      cb(event, payload)
    );
}
```

Useful for:

```txt
Logging
Debugging
Global observability
```

---

# 2. Best Practices for ReactiveMap in Large React Apps

Enterprise apps have thousands of components.

If we misuse subscriptions, we cause:

```txt
Memory leaks
Race conditions
Inconsistent UI
Duplicate side effects
Broken cleanup
```

---

## Best Practice 1: One Map per Domain

Do NOT store everything in one map.

Split:

```txt
userMap
cartMap
notificationsMap
chatMap
configMap
```

Benefits:

✅ Better modularity

✅ Cleaner rerenders

✅ Testability

✅ Debugging clarity

---

## Best Practice 2: Use Singletons

Never create maps inside components:

```jsx
const map = new ReactiveMap(); // ❌ BAD
```

Because component rerenders create new maps.

Instead:

```js
export const userMap = new ReactiveMap();
```

Import globally.

---

## Best Practice 3: Cleanup in useEffect

Always return unsubscribe:

```jsx
useEffect(() => {
  const unsub = userMap.on("change", handler);

  return unsub;
}, []);
```

Prevents:

```txt
Ghost updates
Duplicate listeners
Memory bloat
```

---

## Best Practice 4: Namespace Events

For scoped clarity:

```js
userMap.emit("user.updated", payload);

userMap.emit("user.deleted", payload);
```

Consumer:

```js
userMap.on("user.updated", cb);
```

---

## Best Practice 5: Batch Updates

If updating 100 keys at once, do NOT emit 100 times.

```js
map.batch(() => {
  map.set("a", 1);
  map.set("b", 2);
  map.set("c", 3);
});
```

Implementation:

```js
batch(callback) {

  this.silent = true;

  callback();

  this.silent = false;

  this.emit("change", {
    type: "batch"
  });
}
```

---

## Best Practice 6: Debounced Events

For high-frequency updates like typing:

```js
const emit = debounce(this._emit.bind(this), 100);
```

Improves performance.

---

## Best Practice 7: Persist State

For chats, forms, settings:

```js
map.on("change", () => saveToStorage(map.toJSON()));
```

Ensures survival on refresh.

---

## Best Practice 8: DevTools Logger

Attach logger listener during development:

```js
if (process.env.NODE_ENV !== "production") {
  map.on("*", (event, payload) => {
    console.groupCollapsed("Map Event:", event);

    console.log(payload);

    console.groupEnd();
  });
}
```

---

## Best Practice 9: Split Read + Write Concerns

Read hook:

```jsx
useReactiveMap(map, key);
```

Write helper:

```js
export function updateUser(id, data) {
  userMap.set(id, data);
}
```

Better testability and mocking.

---

## Best Practice 10: Type Safety

For TypeScript:

```ts
class ReactiveMap<T> {
  private store = new Map<string, T>();
}
```

Improves DX.

---

# 3. Error Handling in Callbacks

Real-world callbacks may crash.

Example:

```js
map.on("set", (data) => {
  updateUI(data); // may throw
});
```

If one callback fails:

```txt
❌ Other callbacks blocked
❌ App may crash
❌ Silent bugs
❌ Broken subscribers
```

---

## Bad Implementation

```js
this.listeners.get(event)?.forEach((cb) => cb(payload));
```

If any callback throws, others may not run.

---

## Robust Emit

Wrap each callback in try/catch:

```js
emit(event, payload) {

  const callbacks =
    this.listeners.get(
      event
    );

  if (!callbacks) return;

  callbacks.forEach(cb => {

    try {
      cb(payload);
    } catch (error) {
      this.handleError(
        error,
        event,
        cb
      );
    }
  });
}
```

---

## Add Error Handler API

```js
handleError(
  error,
  event,
  callback
) {

  if (this.onError) {
    this.onError(
      error,
      event,
      callback
    );
  } else {
    console.error(
      "ReactiveMap error:",
      error,
      "in event:",
      event
    );
  }
}
```

---

## Attach Custom Error Handler

```js
map.onError = (error, event) => {
  reportToSentry(error);

  console.warn("Event failed:", event);
};
```

---

## Example: One Bad Handler Doesn't Break Others

```js
map.on("set", () => {
  throw new Error("Crash");
});

map.on("set", (data) => {
  console.log("Still works!", data);
});
```

Result:

```txt
Still works!
ReactiveMap error: Error: Crash
```

---

## Async Callbacks

Wrap:

```js
try {
  await cb(payload);
} catch (error) {
  handleError(error);
}
```

Prevents unhandled promise rejections.

---

## Retry Failed Callbacks (Optional)

```js
async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
    }
  }
}
```

---

# Full Enterprise-Grade Architecture

```txt
ReactiveMap
   │
   ├── Store (Map)
   │
   ├── Listeners
   │     ├── Multiple per event
   │     ├── Deduplicated
   │     ├── Wildcard support
   │     └── Namespaced
   │
   ├── Emit Layer
   │     ├── try/catch
   │     ├── Error hook
   │     └── Async support
   │
   ├── Batch Mode
   │
   ├── Debounced Emissions
   │
   ├── Persistence
   │
   ├── DevTools Logger
   │
   └── React Integration
         ├── Custom Hooks
         └── Subscription Cleanup
```

---

# Senior React Interview Answer

> A ReactiveMap should support multiple listeners per event by storing callbacks in a `Set` to avoid duplicates and O(n) iteration. For large React apps, best practices include splitting maps by domain, using singleton instances, always returning an unsubscribe function, using namespaced events, batching updates, and adding a dev-mode wildcard logger. Error safety is critical because a single crashing listener can break the entire event bus — so each callback is wrapped in try/catch and dispatched through a centralized error handler that can be plugged into Sentry, custom loggers, or metrics tools. This design produces a lightweight, safe, and enterprise-grade reactive state store similar to those used in MobX, Zustand internals, RxJS-based state, and Firebase-style real-time systems.
