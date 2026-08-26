*** copy How does Rollup use Scope Hoisting and AST walking algorithms to eliminate unused exports?.md ***

Rollup was architected from the ground up around **Scope Hoisting** and fine-grained **AST (Abstract Syntax Tree) static analysis**.

Unlike older bundlers (like Webpack v1–v3) that wrapped every file in an isolated closure/function registry (`__webpack_require__`), Rollup flattens all module scopes into a **single, unified top-level scope** and performs full-program symbol tree-shaking before generating bytecode or minifying.

---

### 1. The Core Pipeline: From Files to a Single Flat Scope

Rollup's optimization process runs through three primary architectural phases:

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│ 1. AST Construction   │      │ 2. Symbol Graph & Walk │      │ 3. Scope Hoisting &    │
│    & Scope Analysis    │ ───► │    (Tree-Shaking)      │ ───► │    Code Generation     │
│ • Acorn parses files   │      │ • Mark root entrypoints│      │ • Deconflict names     │
│ • Build Scope Trees    │      │ • Trace references     │      │ • Flatten into 1 scope │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘

```

---

### 2. Step 1: AST Construction & Custom Scope Trees

Rollup parses every JavaScript module into an AST (using **Acorn**). For each module, Rollup attaches an internal metadata wrapper called **`Module`**:

1. **`Scope` Tree Creation:** Rollup builds a custom hierarchical scope tree (`ModuleScope`, `FunctionScope`, `BlockScope`) that mirrors the AST.
2. **`Variable` Instances:** Every declared identifier (`var`, `let`, `const`, `function`, `class`, `import`) is wrapped in a Rollup internal **`Variable`** (or `ExportVariable` / `ImportBinding`) instance.
3. **`ExpressionStatement` Binding:** Every statement in the AST maintains a link to the variables it reads from and writes to.

---

### 3. Step 2: AST Walking & Reference Tracking Algorithm

Rollup's tree-shaking is a **liveness-propagation algorithm** (similar to Mark-and-Sweep in garbage collection).

```
[ Root Entry Point Exports ]  (Initially marked "Included")
            │
            ▼
[ Trace AST References ] ──► Marks required variables as "Included"
            │
            ▼
[ Check Side Effects ]   ──► Statement has mutations / I/O?
                               ├─► YES: Mark statement as "Included"
                               └─► NO:  Leave statement unmarked (Dead Code)

```

#### How the Walk Operates

1. **1. Seeding Live Roots:**
Rollup begins at the entry point module (e.g., `index.js`). All exports and top-level side effects in the entry module are marked as **`included: true`**.

2. **2. Propagating References (include()):**
When a variable is marked `included`, Rollup calls `variable.include()`. This triggers a traversal to the statement where that variable was declared and initialized, marking the producing statement as `included`.

3. **3. Side-Effect Detection:**
Rollup walks the AST nodes of all statements. A statement is automatically included if it contains **unavoidable runtime side effects**, such as:

* Reassigning an outer/global variable (`window.user = 'active'`).
* Calling a function whose body contains unknown mutations (unless marked `/* @__PURE__ */`).
* Mutating an object/array property whose origin cannot be statically proven local and unexported.

1. **4. Dropping Unmarked Nodes:**
Any AST statement or `Variable` that remains `included: false` after the graph walk finishes is completely omitted during the final string rendering phase.

---

### 4. Step 3: Scope Hoisting (Module Flattening)

Once dead code is stripped, Rollup merges all surviving statements from all modules into a **single, flat top-level scope**.

#### How Scope Hoisting Works

Instead of emitting wrapper functions (`function(module, exports) { ... }`), Rollup inlines variables side-by-side:

```javascript
// utils.js
export const add = (a, b) => a + b;
export const unusedMultiply = (a, b) => a * b;

// main.js
import { add } from './utils.js';
console.log(add(2, 3));

```

#### Rollup Output (Single Flattend Scope)

```javascript
// Dead code (unusedMultiply) is dropped during AST walk.
// No runtime wrapper or require function needed!
const add = (a, b) => a + b;

console.log(add(2, 3));

```

#### Variable Deconfliction (Renaming)

If multiple modules declare a variable with the same name, Rollup's Scope Hoisting engine renames them deterministically during the render pass:

```javascript
// file-a.js: let count = 1;
// file-b.js: let count = 2;

// Output:
let count$1 = 1;
let count = 2;

```

---

### 5. Why Scope Hoisting Beats Function Wrappers

| Feature                   | Legacy Module Wrappers (Webpack v1–v3)                        | Rollup Scope Hoisting                                    |
| ------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| **Runtime Overhead**      | Extra function calls for every module (`__webpack_require__`) | **Zero overhead** (plain linear execution)               |
| **Bundle Size**           | Bloated with boilerplate closures & module maps               | **Minimal size** (pure JavaScript code)                  |
| **V8 Engine Inlining**    | Harder for V8 TurboFan to optimize across function wrappers   | **V8 optimizes aggressively** across flat lexical scopes |
| **Circular Dependencies** | Handled via cached export objects                             | Handled via live variable bindings                       |

---

### Why Rollup Can Tree-Shake What Other Compilers Miss

Because Rollup tracks variable references at the AST node level rather than just tracking module file boundaries:

1. **Unused object properties and assignments** are removed if the target object never escapes.
2. **Unused function arguments and dead branches** inside functions are eliminated during the AST tree walk.
3. If an imported function is called inside an unused function, the entire chain is pruned recursively.
