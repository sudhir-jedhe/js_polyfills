***  Dynamic import() vs static import evaluation.md ***

The primary difference between static `import` and dynamic `import()` is **when and how the module graph is constructed**: static imports build, link, and evaluate the entire dependency graph ahead of execution, whereas dynamic `import()` initiates the module lifecycle asynchronously on demand at runtime.

---

### Core Comparison Matrix

| Feature             | Static `import ... from '...'`                             | Dynamic `import(...)`                                             |
| ------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| **Syntax Type**     | Declaration / Keyword statement                            | Function-like asynchronous operator                               |
| **Placement**       | Top-level scope only (cannot be nested in `if`, functions) | Anywhere expressions are valid (functions, event handlers, loops) |
| **Specifier Type**  | Static string literals only                                | Any expression resolving to a string / template literal           |
| **Timing**          | Resolved & parsed before script evaluation                 | Evaluated on demand at runtime                                    |
| **Execution Model** | Synchronous module graph traversal                         | Returns a `Promise<ModuleNamespace>`                              |
| **Tree-Shaking**    | Fully optimizable at build time                            | Difficult/impossible for bundlers to statically prune             |
| **Code Splitting**  | Bundled together into the main dependency chunk            | Automatically generates separate chunk bundles                    |
| **Error Handling**  | Crashes module graph compilation/loading                   | Caught at runtime via `.catch()` or `try...catch`                 |

---

### 1. Execution Lifecycle Differences

#### Static Import (`import x from './mod.js'`)

* **Parse & Construction Phase:** The engine recursively parses the entire static import graph before executing a single line of application code. If any module fails to fetch or parse, the whole program fails to start.
* **Direct Environment Pointers:** Imports link to live, indirect bindings directly in the target module's `ModuleEnvironmentRecord`.

```javascript
// ❌ SyntaxError: Cannot use import statement inside a function or block
if (condition) {
  import { feature } from './feature.js';
}

```

#### Dynamic Import (`import('./mod.js')`)

* **On-Demand Phase:** Execution only begins when the call site is hit during runtime. The runtime queries the internal **Module Map** (cache); if missing, it fetches, parses, links, and evaluates the submodule in a separate asynchronous task.
* **Namespace Object:** Resolves to a sealed `ModuleNamespace` object representing the module's exports.

```javascript
// ✅ Allowed: Evaluates conditionally only when needed
if (userRequiresAdmin) {
  const adminMod = await import('./adminPanel.js');
  adminMod.renderDashboard();
}

```

---

### 2. Error Handling & Resilience

* **Static Import:** An error in a leaf dependency (e.g., syntax error, top-level exception, or network 404) aborts execution of the entire parent module before it can run.
* **Dynamic Import:** Failures reject the returned promise, allowing isolation and graceful fallbacks:

```javascript
try {
  const analytics = await import('https://analytics.cdn.example/tracker.js');
  analytics.init();
} catch (error) {
  console.warn('Analytics failed to load; continuing offline fallback', error);
}

```

---

### 3. Bundler Behavior: Tree-Shaking vs. Chunking

* **Static Imports enable Tree-Shaking:** Because imports and exports are immutable and known at compile time, bundlers (Vite, Webpack, Rollup, esbuild) trace reachable symbols from entry points and dead-code eliminate unreferenced exports.
* **Dynamic Imports trigger Split Points:** Bundlers split dynamic imports into standalone `.js` chunks that are fetched over the network on demand, reducing initial bundle size and improving First Contentful Paint (FCP).
