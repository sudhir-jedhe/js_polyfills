Modern JavaScript bundlers and minifiers (such as **Rollup, esbuild, Terser, Webpack, and Vite**) rely on static analysis to eliminate unused code (**tree-shaking**). However, JavaScript's dynamic nature makes it notoriously difficult for a compiler to prove that invoking a top-level function or IIFE has no side effects.

The `/* @__PURE__ */` (or `/*#__PURE__*/`) annotation acts as an explicit instruction from the compiler or author to the bundler: **"If the value resulting from this expression is unused, safe-drop the entire call—it has no runtime side effects."**

---

### The Fundamental Problem: Top-Level Side Effects

Consider what happens when a compiler downlevels an ES6 class or creates a module object using an IIFE:

```javascript
// Input source
export class Button {
  static defaultStyle = 'primary';
}

```

Transpilers (like Babel or TypeScript when targeting older JS versions) compile this into a top-level IIFE:

```javascript
// Compiled output
export var Button = (function () {
  function Button() {}
  Button.defaultStyle = 'primary';
  return Button;
})();

```

#### Why the Bundler Cannot Drop It by Default

If an application never imports or uses `Button`, can the bundler delete that IIFE?

* **No.** To the bundler's static analyzer, `(function() { ... })()` is an opaque function call.
* For all the bundler knows, that function might mutate the global object (`window.x = 1`), access `localStorage`, or throw an error.
* Standard dead-code elimination must assume **any top-level function call produces side effects**. Consequently, the unused code remains in the final production bundle.

---

### How the `/* @__PURE__ */` Annotation Solves It

By placing the annotation immediately before the call expression, the transpiler guarantees to the minifier that evaluating the IIFE produces no side effects outside its return value:

```javascript
// Annotated transpiled output
export var Button = /* @__PURE__ */ (function () {
  function Button() {}
  Button.defaultStyle = 'primary';
  return Button;
})();

```

```
Is `Button` imported/used downstream?
     │
     ├─► YES ──► Keep the IIFE and bundle it normally.
     │
     └─► NO  ──► Is it marked /* @__PURE__ */?
                   │
                   ├─► YES ──► Drop the entire IIFE from the final bundle!
                   └─► NO  ──► Retain the IIFE (must preserve potential side effects).

```

---

### AST-Level Mechanics: How Bundlers Parse It

During the tree-shaking and dead-code elimination phase, tools like **Rollup** and **esbuild** process the AST (Abstract Syntax Tree):

1. **Comment Attachment:** The parser associates leading comments (specifically tokens matching `/@__PURE__|#__PURE__/`) with the adjacent `CallExpression` or `NewExpression` AST node.
2. **Flagging Node:** The AST node is assigned an internal flag (e.g., `isPure = true`).
3. **Reference Counting & Scope Analysis:** The bundler constructs the dependency graph of variable declarations and identifier references.
4. **Pruning Decision:**

* If the declaration's identifier has **zero live consumers**, the bundler checks the right-hand side expression.
* Because `isPure === true`, the bundler skips evaluating the RHS for side effects and prunes the entire `VariableDeclaration` node from the AST.

---

### Key Syntax Rules & Gotchas

#### 1. Placement Matters (Must Immediately Precede the Invocation)

The comment must precede the **call site**, not just the function declaration:

```javascript
// ✅ Correct: Marks the CallExpression as pure
export const Config = /* @__PURE__ */ (() => {
  return { api: 'https://api.example.com' };
})();

// ❌ Incorrect: Attached to the inside of the function, not the call
export const Config = (() => {
  /* @__PURE__ */
  return { api: 'https://api.example.com' };
})();

```

#### 2. False Purity Risks

If you manually attach `/* @__PURE__ */` to a function that **actually has side effects**, those side effects will be deleted if the return value is not consumed:

```javascript
// ⚠️ DANGEROUS: Side effect will be eliminated if `logger` is unused
export const logger = /* @__PURE__ */ (() => {
  window.__GLOBAL_METRICS__ = []; // ❌ Lost if tree-shaken!
  return { log: () => console.log('ready') };
})();

```

---

### Summary of Differences

| Feature                    | Unannotated IIFE                      | IIFE with `/* @__PURE__ */`                      |
| -------------------------- | ------------------------------------- | ------------------------------------------------ |
| **Treated by Analyzer as** | Potential global side effect          | Side-effect-free pure expression                 |
| **When Export is Unused**  | Retained in final bundle (code bloat) | Completely removed by bundler/minifier           |
| **Primary Producers**      | Hand-written legacy code              | TypeScript, Babel, esbuild, SWC, Rollup          |
| **Supported Tools**        | All runtimes                          | Terser, Rollup, Webpack, esbuild, Vite, UglifyJS |
