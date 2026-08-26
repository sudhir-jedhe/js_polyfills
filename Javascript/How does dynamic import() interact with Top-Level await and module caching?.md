*** copy How does dynamic import() interact with Top-Level await and module caching?.md ***

Dynamic `import(specifier)` is an asynchronous operator that triggers the entire ECMAScript module lifecycle (fetch/parse, link, and evaluate) on demand at runtime, returning a Promise that resolves to the module namespace object.

Its interaction with **Top-Level `await` (TLA)** and the engine's internal **Module Map (Module Cache)** follows specific architectural rules:

---

### 1. Interaction with Top-Level `await`

When you dynamically import a module that contains Top-Level `await` (or depends on a submodule containing TLA):

```javascript
// feature.js
console.log('1: Starting initialization...');
const config = await fetchRemoteConfig(); // Top-Level await
console.log('2: Initialization complete.');
export const value = config.data;

// app.js
console.log('App starting');
const moduleNamespace = await import('./feature.js');
console.log('3: Module ready:', moduleNamespace.value);

```

#### How the Promise Resolves

* The Promise returned by `import('./feature.js')` **does not fulfill** when the file finishes downloading or parsing.
* It remains pending until the entire evaluation phase—including all asynchronous Top-Level `await` operations in the target module and its imported dependency tree—completes.
* **Console Order:**

```text
App starting
1: Starting initialization...
2: Initialization complete.
3: Module ready: <data>

```

#### Error Handling and Rejection

If a Top-Level `await` rejects (e.g., network failure during `fetchRemoteConfig()`):

* The Promise returned by `import()` **rejects** with that exact error.
* You can catch and handle module evaluation failures directly:

```javascript
try {
  const mod = await import('./feature.js');
} catch (err) {
  console.error('Failed to evaluate module graph:', err);
}

```

---

### 2. Interaction with Module Caching (The Module Map)

The JavaScript runtime maintains an internal table of loaded modules called the **Module Map**, keyed by the canonical (fully resolved absolute) URL/specifier of the file.

```
                  ┌──────────────────────────────────────────────┐
                  │          Module Map (Internal Cache)         │
                  ├─────────────────────────────┬────────────────┤
                  │ Key: Canonical Specifier    │ Module Record  │
                  ├─────────────────────────────┼────────────────┤
                  │ file:///app/src/db.js       │ [Linked/Ready] │
                  │ file:///app/src/feature.js  │ [Evaluating]   │
                  └─────────────────────────────┴────────────────┘

```

#### The Evaluation Rule: Exactly Once

When `import('./module.js')` is called multiple times:

1. **First Call:** The engine checks the Module Map. Finding no entry, it fetches, parses, instantiates, and executes the module body.
2. **Subsequent Calls:** The engine hits the Module Map, finds the existing Module Record, and returns the **already evaluated module namespace object**. The module body code and Top-Level `await` expressions **never run a second time**.

```javascript
// file: counter.js
console.log('Executing counter module body');
export let count = 0;
export function increment() { count++; }

// file: main.js
const mod1 = await import('./counter.js'); // Logs: "Executing counter module body"
mod1.increment();

const mod2 = await import('./counter.js'); // Does NOT log; returns cached module
console.log(mod2.count); // 1 (Points to the exact same live instance)

console.log(mod1 === mod2); // true

```

---

### 3. Concurrent `import()` Calls on an In-Flight Async Module

If two parts of an application call `import('./async-module.js')` simultaneously while its Top-Level `await` is still pending:

```javascript
// Both calls happen concurrently before async operation finishes
const promise1 = import('./heavy-async-init.js');
const promise2 = import('./heavy-async-init.js');

const [modA, modB] = await Promise.all([promise1, promise2]);
console.log(modA === modB); // true

```

* **Under the Hood:**

1. The first call creates an entry in the Module Map in the `Evaluating` state.
2. The second call detects that the module is already in the map and latches onto the **same internal evaluation Promise (`[[TopLevelCapability]]`)**.
3. The asynchronous operations execute only once; both `import()` promises resolve simultaneously with the same namespace reference.

---

### 4. What Happens if a Module with TLA Rejects?

If a module fails during Top-Level `await` evaluation:

* The module in the Module Map is marked with an **errored evaluation state**.
* Any subsequent `import('./failed-module.js')` calls will **not** retry executing the file; they will immediately reject with the same cached error.

```javascript
// crash.js
throw new Error('Database connection failed');

// app.js
try {
  await import('./crash.js');
} catch (e) {
  console.log('First attempt caught error');
}

// Second attempt does not re-run crash.js; rejects immediately from cache
await import('./crash.js'); // ❌ UnhandledPromiseRejection: Database connection failed

```

---

### Summary of Behaviors

| Scenario                        | Behavior                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **`import()` with TLA**         | Returns a Promise that only resolves when all Top-Level `await` operations in the graph fulfill.          |
| **Top-Level `await` Rejects**   | The `import()` Promise rejects; the error can be caught with `.catch()` or `try...catch`.                 |
| **Repeated `import()` calls**   | Module evaluates once; subsequent calls instantly return the cached Module Namespace from the Module Map. |
| **Concurrent `import()` calls** | Both callers await the single in-flight evaluation Promise.                                               |
| **Failed evaluation cache**     | Errored modules remain cached in an errored state and will reject on all subsequent imports.              |
