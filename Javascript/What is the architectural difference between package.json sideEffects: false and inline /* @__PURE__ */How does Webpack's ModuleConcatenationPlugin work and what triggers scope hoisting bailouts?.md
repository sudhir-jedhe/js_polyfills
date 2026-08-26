*** copy How does Webpack's ModuleConcatenationPlugin work and what triggers scope hoisting bailouts?.md ***

Webpack’s **`ModuleConcatenationPlugin`** (commonly referred to as **Scope Hoisting**, enabled automatically in production mode via `optimization.concatenateModules: true`) optimizes output bundles by merging multiple ECMAScript Modules into a single closure, rather than wrapping every file in an isolated function (`__webpack_require__`).

---

### How ModuleConcatenationPlugin Works

In legacy Webpack (v1–v3), every imported module was wrapped in its own function closure inside the bundle:

```javascript
// Legacy Webpack (Without Scope Hoisting)
{
  "./src/math.js": function(module, __webpack_exports__, __webpack_require__) {
     __webpack_exports__["add"] = (a, b) => a + b;
  },
  "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
     var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/math.js");
     console.log((0, _math__WEBPACK_IMPORTED_MODULE_0__["add"])(1, 2));
  }
}

```

#### The Scope Hoisting Transformation

With `ModuleConcatenationPlugin`, Webpack analyzes the module graph to form **Concatenation Clusters** (groups of modules that can safely coexist in the same scope) and inlines them into a single function closure:

```javascript
// With Scope Hoisting (ModuleConcatenationPlugin)
(function() {
  // src/math.js inlined:
  const math_add = (a, b) => a + b;

  // src/index.js inlined:
  console.log(math_add(1, 2));
})();

```

---

### Internal Compilation Pipeline

```
1. Module Graph Analysis
   └─► Identify valid ES Modules and static import/export edges.

2. Cluster Formation
   └─► Group eligible dependent modules into `ConcatenatedModule` roots.

3. Identifier Deconfliction & Renaming
   └─► Rewrite variable names (e.g., `count` -> `math_count`, `utils_count`)
       to prevent variable collision within the merged closure.

4. Emission
   └─► Generate a single runtime wrapper function containing all cluster code.

```

---

### Scope Hoisting Bailouts (What Prevents Concatenation)

When Webpack cannot statically guarantee that module execution order and variable scoping will remain deterministic, it triggers a **bailout**. When a bailout occurs, Webpack falls back to wrapping the module in a standard `__webpack_require__` isolated function.

---

### Common Bailout Triggers

| Bailout Trigger                                  | Why Webpack Bails Out                                                                                                                            | Example                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Non-ESM / CommonJS Dependencies**              | `require()` and `module.exports` are dynamic runtime operations; exports cannot be statically verified at build time.                            | Using `require('./math')` or importing a CommonJS npm package.                                        |
| **Dynamic `import()` Boundaries**                | Dynamic imports define code-split chunks loaded asynchronously at runtime, breaking synchronous closure inlining.                                | `const mod = await import('./chart.js');`                                                             |
| **`import * as ns` Namespace Escapes**           | If the module namespace object is passed into an external function or iterated over dynamically, the module cannot be flattened.                 | `Object.keys(mathNamespace)` or `log(mathNamespace)`                                                  |
| **Circular Dependencies with TLA or Re-exports** | Circular dependency graphs that cannot determine a strict linear evaluation order prevent single-scope inlining.                                 | Module A and Module B circularly importing each other's live bindings across chunks.                  |
| **Importing Non-Static Re-exports**              | Re-exporting from unknown/dynamic targets obscures the export shape.                                                                             | `export * from 'some-cjs-package'`                                                                    |
| **Shared Multi-Chunk Modules**                   | When a module is imported across multiple asynchronous entrypoints/chunks, inlining it into one would cause duplicate code across split bundles. | Common utility imported by both `pageA.chunk.js` and `pageB.chunk.js` without SplitChunks extraction. |
| **Use of `eval()` or Global Mutation**           | Lexical scopes containing dynamic `eval()` cannot guarantee variable isolation after hoisting.                                                   | `eval("var injected = 1")` inside module body.                                                        |

---

### Inspecting Bailouts in Your Build

You can view the exact reasons why Webpack failed to concatenate specific modules by enabling optimization stats or using the CLI:

#### In `webpack.config.js`

```javascript
module.exports = {
  mode: 'production',
  stats: {
    optimizationBailout: true, // Logs detailed bailout explanations
  },
};

```

#### Example Output in Terminal

```text
[./src/analytics.js] (concatenated)
[./src/legacy-utils.js] 
  Module is not an ECMAScript module
[./src/heavy-component.js] 
  Cannot concat with ./src/app.js: Imported by dynamic import()
[./src/helpers.js] 
  Cannot concat with ./src/main.js: The module namespace object is accessed directly

```

---

### Best Practices to Maximize Scope Hoisting

* **Use Pure ESM:** Ensure third-party libraries provide standard `module` or `exports` ESM entrypoints in their `package.json`.
* **Avoid Namespace Object Passing:** Instead of `import * as Utils from './utils'` followed by passing `Utils` as an argument, use named imports (`import { format } from './utils'`).
* **Configure Babel / TypeScript:** Set `"modules": false` in `@babel/preset-env` and `"module": "ESNext"` in `tsconfig.json` so Babel/TypeScript do not downlevel ESM `import`/`export` to CommonJS `require()` before Webpack processes them.
