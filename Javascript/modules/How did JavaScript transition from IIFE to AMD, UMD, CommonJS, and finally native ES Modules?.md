How did JavaScript transition from IIFE to AMD, UMD, CommonJS, and finally native ES Modules?

JavaScript began without any native concept of modules. As web applications grew from basic scripts into complex systems, the community engineered a succession of patterns and specifications to solve scope isolation, dependency management, and asynchronous loading.

* 1995 – 2008: Global Scripts & IIFE Pattern
JavaScript relied on multiple `<script>` tags loaded in strict document order. To avoid polluting `window` and clobbering variables, developers wrapped code in **Immediately Invoked Function Expressions (IIFE)**, manually passing globals and attaching public interfaces to a single namespace object.

* 2009: CommonJS (CJS) & Server-Side JavaScript
With the launch of Node.js, the community needed a formal module format for servers. **CommonJS** introduced synchronous `require()` and `module.exports`, reading files directly from the local disk filesystem into memory.

* 2010 – 2011: AMD (Asynchronous Module Definition)
Because synchronous `require()` froze web browsers waiting on network requests, AMD (popularized by **RequireJS**) used a `define(['dep1'], function(dep1) { ... })` callback syntax to load module scripts asynchronously over HTTP.

* 2011 – 2014: UMD (Universal Module Definition)
Library authors faced an ecosystem split between Node.js (CommonJS), browsers (AMD), and vanilla `<script>` tags (Globals). **UMD** wrapped code in a boilerplate factory function that inspected the runtime environment to adapt to whichever system was present.

* 2015 – Present: Native ES Modules (ESM / ECMAScript 2015)
TC39 standardized **ES Modules** directly into the JavaScript language with `import` and `export` keywords. ESM unified browser and server environments using a 3-phase static graph lifecycle (*Parse $\rightarrow$ Link $\rightarrow$ Evaluate*), enabling static analysis, live bindings, and compile-time tree-shaking.

---

### Structural Comparison of Each Stage

| Era          | Primary Syntax                 | Loading Mechanism | Target Environment | Major Limitation                                   |
| ------------ | ------------------------------ | ----------------- | ------------------ | -------------------------------------------------- |
| **IIFE**     | `(function(){ ... })()`        | Script Tag Order  | Browser            | Manual script ordering, global namespace pollution |
| **CommonJS** | `const x = require('./x')`<br> |

<br>`module.exports = ...` | **Synchronous** runtime resolution | Node.js (Server) | Blocks the browser main thread over HTTP networks |
| **AMD** | `define(['./x'], function(x) { ... })` | **Asynchronous** script injection | Browser (RequireJS) | Heavy wrapper boilerplate, awkward syntax |
| **UMD** | Runtime environment detection pattern | Dynamic (matches host) | Universal (Browser/Node) | Fragile boilerplate, complex to maintain |
| **ESM** | `import { x } from './x.js'`<br>

<br>`export const y = ...` | **Static graph** (Asynchronous parsing, synchronous execution) | Universal (Native in Browsers & Node.js) | Requires modern tooling / `.mjs` extensions for legacy interop |

---

### Code Evolution of a Single Module

#### 1. IIFE / Namespace Pattern (Pre-2009)

```javascript
// math.js
var App = window.App || {};
App.Math = (function () {
  var factor = 2;
  return {
    double: function (n) { return n * factor; }
  };
})();

```

#### 2. CommonJS (2009)

```javascript
// math.cjs
const factor = 2;
function double(n) { return n * factor; }

module.exports = { double };

```

#### 3. AMD / RequireJS (2010)

```javascript
// math.js
define([], function () {
  var factor = 2;
  return {
    double: function (n) { return n * factor; }
  };
});

```

#### 4. Universal Module Definition (UMD) (2011)

```javascript
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory); // AMD
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(); // CommonJS
  } else {
    root.AppMath = factory(); // Browser Global
  }
}(typeof self !== 'undefined' ? self : this, function () {
  var factor = 2;
  return {
    double: function (n) { return n * factor; }
  };
}));

```

#### 5. ES Modules (ES6 / Modern Standard)

```javascript
// math.js
const factor = 2;
export function double(n) {
  return n * factor;
}

```

---

### Why ES Modules Won

* **Static Graph Construction:** Because `import` and `export` statements must be placed at the top level of a file, tools like Rollup, Vite, and Webpack can traverse the complete dependency graph and strip unused exports (**tree-shaking**) before any code runs.
* **Live Bindings:** Rather than passing around cloned snapshots of values (like CommonJS), ESM links to live pointers in memory, preventing stale primitive bugs across circular dependencies.
* **Top-Level `await`:** Modules can asynchronously fetch resources or establish network connections during the evaluation phase without requiring an enclosing `async` wrapper.

To support dual CommonJS (CJS) and ES Module (ESM) publishing, configure the **`exports`** field in `package.json` with conditional mappings for `import`, `require`, and `types`.

---

### Complete `package.json` Configuration

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",

  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },

  "files": [
    "dist"
  ]
}

```

---

### Key Configuration Rules

1. **Explicit File Extensions:**

* When `"type": "module"` is set at root, all `.js` files are treated as ESM.
* The CommonJS build **must** use the `.cjs` extension (and `.d.cts` for type definitions) so Node.js loads it through the CommonJS loader.

1. **Split `types` under `import` and `require`:**

* To prevent the ["masquerading as CJS" / "are-the-types-wrong" error](https://arethetypeswrong.github.io/), separate ESM types (`.d.ts` or `.d.mts`) from CJS types (`.d.cts`).
* In each conditional block, the **`types` condition must come first**, before `default`.

1. **Legacy Fallback Fields:**

* `main`, `module`, and `types` at the root are ignored by modern Node.js when `exports` is present. They are retained solely as fallbacks for legacy bundlers and older TypeScript resolution modes (`node10` / `classic`).

---

### Exposing Subpath Exports (e.g., `my-library/helpers`)

To allow consumers to import specific subpaths, add nested pattern keys:

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./helpers": {
      "import": {
        "types": "./dist/helpers.d.ts",
        "default": "./dist/helpers.js"
      },
      "require": {
        "types": "./dist/helpers.d.cts",
        "default": "./dist/helpers.cjs"
      }
    }
  }
}

```

---

### The "Dual Package Hazard" (State Duplication)

If a consumer application imports your package using **both** ESM (`import`) and CJS (`require`), Node.js evaluates both physical files independently.

* **The Risk:** Any singleton state, cache objects, or `instanceof` checks will exist twice in memory.
* **The Solution:** Keep the library stateless, or isolate state in a shared CommonJS wrapper module that both entry points access.

---

### Verification Tools

Run manifest audits before publishing to verify that all conditions and type declarations resolve cleanly:

```bash
# 1. Check exports against npm packaging standards
npx publint

# 2. Check types compatibility across TypeScript moduleResolution modes
npx @arethetypeswrong/cli --pack .

```
