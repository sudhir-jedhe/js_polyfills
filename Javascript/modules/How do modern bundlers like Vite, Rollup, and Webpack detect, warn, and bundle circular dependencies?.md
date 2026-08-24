Modern bundlers must convert a dependency graph containing cycles (loops) into executable, flat chunk files without entering infinite compilation loops or breaking JavaScript runtime semantics.

Here is how **Rollup/Vite** and **Webpack** analyze, warn about, and package circular dependencies.

---

### 1. Detection: Graph Traversal & Cycle Detection

During the build analysis phase, bundlers parse entry files into Abstract Syntax Trees (ASTs), extract `import`/`export` statements, and construct a **Directed Dependency Graph**.

```
[Module A] ──imports──► [Module B] ──imports──► [Module C]
     ▲                                                │
     └────────────────────imports─────────────────────┘
                     (Cycle Detected)

```

#### The Graph Algorithm: Depth-First Search (DFS) with Three Colors

Bundlers detect cycles using standard DFS graph coloring:

1. **White (Unvisited):** Module has not been processed yet.
2. **Gray (Visiting):** Module is currently being parsed, and its imports are being traversed recursively.
3. **Black (Visited):** Module and all its children have been fully parsed.

> **Cycle Trigger:** If a DFS traversal encounters a module currently marked as **Gray (Visiting)**, the bundler has found a back-edge in the directed graph, confirming a **Circular Dependency**.

---

### 2. Warning Mechanisms

* **Rollup & Vite (Production Build):** Rollup prints a build-time warning by default whenever it detects a circular dependency cycle:
```text
(!) Circular dependency
src/moduleA.js -> src/moduleB.js -> src/moduleC.js -> src/moduleA.js

```


*(In Vite development mode with esbuild/native ESM, Vite relies on the browser's native ESM resolution or prints HMR cycle warnings).*
* **Webpack:** Webpack does **not** warn about circular dependencies by default because the ECMAScript spec technically permits cycles. To track and block them in Webpack, developers use plugins like `circular-dependency-plugin`.

---

### 3. Bundling Strategy: How Bundlers Emit Code for Cycles

When producing a single combined bundle or chunk, a bundler cannot simply concatenate files in a linear order because Module A needs Module B, and Module B needs Module A.

#### A. Webpack: Module Function Registry & Dynamic Cache

Webpack wraps every module inside a factory function within a central module registry (`__webpack_modules__`) and uses a runtime cache (`__webpack_require__`):

```javascript
// Webpack's generated bundle structure (simplified)
var __webpack_modules__ = {
  "./src/moduleA.js": (module, exports, __webpack_require__) => {
    /* Module A code */
    var _moduleB = __webpack_require__("./src/moduleB.js");
  },
  "./src/moduleB.js": (module, exports, __webpack_require__) => {
    /* Module B code */
    var _moduleA = __webpack_require__("./src/moduleA.js");
  }
};

// Webpack Runtime Requester
function __webpack_require__(moduleId) {
  // Check if module is already in cache
  if (__webpack_module_cache__[moduleId]) {
    return __webpack_module_cache__[moduleId].exports;
  }
  
  // 1. Create empty module object in cache immediately
  var module = (__webpack_module_cache__[moduleId] = { exports: {} });
  
  // 2. Execute module function (Circular calls return partial `module.exports`)
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  
  return module.exports;
}

```

* Because Webpack stores the empty `{ exports: {} }` in cache **before** executing the module body, circular `__webpack_require__` calls return the in-progress exports object instead of causing infinite call-stack recursion.

#### B. Rollup / Vite: Scope Hoisting & Live Binding Emulation

Rollup's philosophy is **Scope Hoisting**—it hoists variables into a single flat scope instead of wrapping each file in a function closure:

1. **Ordering:** Rollup topologically sorts the graph and places the module that was encountered first earlier in the chunk.
2. **Variable Renaming (Mangled Identifiers):** Rollup renames identifiers (e.g., `count$1`, `count$2`) to prevent variable collisions in the shared scope.
3. **Live References:** Functions hoisted to the top of the shared chunk remain callable across both modules, preserving native ESM behavior.

```javascript
// Rollup's flat bundle output for circular modules A and B:
// Hoisted functions from Module B:
function getB() {
  return "B says hi";
}

// Module A code:
const a = "Value from A";

// Module B code:
const b = "Value from B";

export { a, b, getB };

```

---

### 4. Why Bundled Cycles Often Break at Runtime (TDZ & Ordering)

Even though bundlers successfully output valid bundle files, circular dependencies frequently fail at runtime with `ReferenceError: Cannot access 'X' before initialization` or `TypeError: undefined is not a function`.

```
Topological Chunk Ordering:
1. Module A Top-level evaluated ──► Requires const `b` (TDZ Error: `b` is uninitialized!)
2. Module B Top-level evaluated ──► Defines const `b`

```

* If **Module A** references a `const` or `class` from **Module B** during module evaluation, and the bundler placed Module A first in the output file, Module B has not executed its initialization line yet.
* **Function declarations** survive this because functions are hoisted to the top of the bundle chunk, but `const`, `let`, and `class` declarations trigger the Temporal Dead Zone.

---

### Summary: Tooling Behavior Matrix

| Bundler         | Cycle Detection Algorithm                  | Default Warning Behavior                | Runtime Output Mechanism                                             |
| --------------- | ------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------- |
| **Rollup**      | DFS with cycle tracking during AST linking | **Warns in console** during build       | **Scope Hoisting** into a single flat closure with renamed variables |
| **Vite (Prod)** | Inherits Rollup's AST graph traversal      | **Warns in console** during build       | Same as Rollup                                                       |
| **Vite (Dev)**  | Native browser ES module graph / esbuild   | HMR warnings on invalid updates         | Native browser HTTP request cycles                                   |
| **Webpack**     | DFS graph compilation pass                 | **Silent by default** (Requires plugin) | **Module Registry Function Map** (`__webpack_require__` cache)       |