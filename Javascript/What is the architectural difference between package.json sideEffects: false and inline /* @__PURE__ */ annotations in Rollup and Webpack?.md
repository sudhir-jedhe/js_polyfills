The architectural difference between `package.json`'s `sideEffects` field and inline `/* @__PURE__ */` annotations lies in **granularity, pipeline stage, and the scope of what gets eliminated**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Module Resolution Stage                         │
│                                                                        │
│   package.json "sideEffects": false                                    │
│   • Macro-level / Module-level optimization                            │
│   • Drops entire files / modules before AST parsing & evaluation       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Code Optimization Stage                         │
│                                                                        │
│   /* @__PURE__ */ Annotation                                           │
│   • Micro-level / AST Expression-level optimization                    │
│   • Drops individual function calls/IIFEs inside a file that is kept   │
└────────────────────────────────────────────────────────────────────────┘

```

---

### Core Comparison Matrix

| Feature                   | `package.json` `"sideEffects"`                            | `/* @__PURE__ */` Annotations                       |
| ------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| **Optimization Scope**    | **Module-level (Macro)**: Entire files                    | **Expression-level (Micro)**: Single AST nodes      |
| **Pipeline Timing**       | Module Graph Construction (Early)                         | AST Dead-Code Elimination (Late)                    |
| **Target Mechanism**      | Skips importing/evaluating whole files                    | Skips executing a specific function call/IIFE       |
| **Author Responsibility** | Package maintainer (package configuration)                | Compilers (TypeScript/Babel) or library authors     |
| **Handling Bare Imports** | `import './polyfill.js'` can be dropped if marked `false` | Ignored (applies only to assigned call expressions) |
| **File Parsing Overhead** | Bundler can bypass building/bundling the file entirely    | File must be parsed into an AST and analyzed        |

---

### 1. `package.json` `"sideEffects"`: Module-Level Tree-Shaking

The `"sideEffects"` property is a declaration about the **entire package or specific files within it**. It informs Webpack and Rollup that the modules do not mutate the global environment (`window`, prototypes, global state) during evaluation.

#### How Bundlers Process It

When an application imports only a single named export from a package:

```javascript
import { add } from 'lodash-es';

```

* **If `sideEffects: true` (default):** The bundler must include and evaluate every internal file imported by `lodash-es` just in case executing top-level code creates a side effect.
* **If `sideEffects: false`:** The bundler skips evaluation and inclusion of every file in the package **except** the specific file that contains the declaration of `add`. Unused files are dropped entirely from the module dependency graph.

#### Glob-Pattern Array Syntax

You can flag specific files (like CSS or polyfills) as having side effects while marking the rest of the package pure:

```json
{
  "name": "my-ui-library",
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills/**"
  ]
}

```

---

### 2. `/* @__PURE__ */`: Expression-Level Tree-Shaking

The `/* @__PURE__ */` comment operates inside a file that **is already included in the bundle**.

When a file cannot be skipped because some of its exports are used, the bundler inspects its AST to prune unused top-level expressions.

#### How Bundlers Process It

```javascript
// ui-kit.js
export const Modal = /* @__PURE__ */ (() => {
  return class Modal {};
})();

export const Tooltip = /* @__PURE__ */ (() => {
  return class Tooltip {};
})();

```

```javascript
// app.js
import { Modal } from 'ui-kit.js';

```

1. Because `Modal` is imported, `ui-kit.js` **must be included** in the bundle (it cannot be skipped via `sideEffects: false`).
2. During the AST traversal phase, the minifier/bundler encounters `Tooltip`.
3. `Tooltip` is unused, but it is initialized by an IIFE call.
4. Because the IIFE has `/* @__PURE__ */`, the bundler drops the `Tooltip` declaration without evaluating the IIFE body.

---

### 3. How They Complement Each Other

Modern production libraries rely on both tools together to achieve optimal minification:

```
Step 1: Module Graph Construction
   └─► `sideEffects: false` eliminates 80 unimported files from a 100-file library.

Step 2: AST Analysis of the 20 Retained Files
   └─► `/* @__PURE__ */` prunes unused top-level IIFEs and class downlevelings inside those 20 files.

```

---

### Summary of Failure Modes

* **If you miss `sideEffects: false`:** Consumers will pull in unused files and runtime polyfills whenever importing any part of your library.
* **If you miss `/* @__PURE__ */`:** Transpiled class declarations, decorators, or higher-order component factories (`hoc(Component)`) will remain trapped in the bundle even if that specific export is never imported.
