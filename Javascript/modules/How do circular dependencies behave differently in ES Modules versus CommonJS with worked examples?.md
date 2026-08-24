The difference in how circular dependencies behave stems directly from how each module system loads: **CommonJS (CJS)** evaluates files synchronously at runtime and passes around whatever `module.exports` object exists at that exact moment, while **ES Modules (ESM)** use a 3-phase lifecycle (**Parse/Construction $\rightarrow$ Linking $\rightarrow$ Evaluation**) to wire up live reference bindings before running any code.

---

### Core Behavioral Difference

```
COMMONJS (Runtime Execution):
A requires B ──► B runs immediately ──► B requires A ──► A returns partial/incomplete exports

ES MODULES (3-Phase Static Graph):
1. Parse & Build Dependency Graph
2. Link Bindings (Pointers connected in memory before execution)
3. Evaluate Code (Values populated into wired reference slots)

```

---

### 1. CommonJS Circular Dependency (The Stale / Incomplete Copy Problem)

In CommonJS, when module `a.cjs` requires `b.cjs`, execution in `a.cjs` is paused. When `b.cjs` requires `a.cjs` back, Node.js returns the current, **partially evaluated** state of `a.cjs`'s `module.exports` object (which is still an empty object `{}` or missing subsequent properties).

#### Worked Example

```javascript
// a.cjs
console.log('a.cjs: starting');
exports.done = false;

const b = require('./b.cjs');
console.log('a.cjs: b.done =', b.done);

exports.done = true;
console.log('a.cjs: finished');

```

```javascript
// b.cjs
console.log('b.cjs: starting');
exports.done = false;

const a = require('./a.cjs'); // Pauses b.cjs to get a.cjs
console.log('b.cjs: a.done =', a.done);

exports.done = true;
console.log('b.cjs: finished');

```

```javascript
// main.cjs
const a = require('./a.cjs');

```

#### Execution Output

```text
a.cjs: starting
b.cjs: starting
b.cjs: a.done = false       <-- Only sees exports.done before the require('./b') call!
b.cjs: finished
a.cjs: b.done = true
a.cjs: finished

```

#### The Fatal CJS Pitfall: Reassigning `module.exports`

If a module overwrites `module.exports = function/class` instead of mutating `exports.prop`, the circular dependency completely breaks and imports an empty `{}`:

```javascript
// a.cjs
const b = require('./b.cjs');
module.exports = function runA() { return 'A'; };

// b.cjs
const a = require('./a.cjs');
console.log(typeof a); // "object" (returns default {} because runA was not assigned yet!)

```

---

### 2. ES Modules Circular Dependency (Live Reference Resolution)

In ESM, all imports and exports are **linked as memory pointers in Phase 2 (Linking)** *before* Phase 3 (Evaluation) executes a single line of JavaScript.

#### Worked Example

```javascript
// a.mjs
console.log('a.mjs: starting');
import { bDone, getB } from './b.mjs';

export let aDone = false;
export function getA() {
  return 'Function A Result';
}

console.log('a.mjs: bDone during exec =', bDone);
aDone = true;
console.log('a.mjs: finished');

```

```javascript
// b.mjs
console.log('b.mjs: starting');
import { aDone, getA } from './a.mjs';

export let bDone = false;
export function getB() {
  return 'Function B Result';
}

console.log('b.mjs: aDone during exec =', aDone);
console.log('b.mjs: calling getA() =', getA()); // ✅ Works! Functions are hoisted

bDone = true;
console.log('b.mjs: finished');

```

```javascript
// main.mjs
import './a.mjs';

```

#### Execution Output

```text
b.mjs: starting
b.mjs: aDone during exec = undefined   <-- aDone slot is linked, but not yet assigned
b.mjs: calling getA() = Function A Result  <-- Hoisted function works seamlessly!
b.mjs: finished
a.mjs: starting
a.mjs: bDone during exec = true        <-- Reads the live mutated value of bDone
a.mjs: finished

```

---

### 3. The ESM Edge Case: Temporal Dead Zone (TDZ) with `const`/`let`

While hoisted functions resolve without issues across circular ESM dependencies, accessing top-level variables declared with `const` or `let` **at module evaluation time** before their initialization line executes will trigger a TDZ `ReferenceError`:

```javascript
// fileA.mjs
import { bVar } from './fileB.mjs';
export const aVar = 'Value A';
console.log(bVar);

```

```javascript
// fileB.mjs
import { aVar } from './fileA.mjs';
// ❌ ReferenceError: Cannot access 'aVar' before initialization
console.log('Trying to access immediately:', aVar); 
export const bVar = 'Value B';

```

#### The Fix for Circular ESM Data Dependencies

Defer reading the variable until inside a function call (lazy execution) so evaluation can finish first:

```javascript
// fileB.mjs
import { aVar } from './fileA.mjs';

export const bVar = 'Value B';

// Access inside a function rather than at top-level execution
export function logA() {
  console.log('Safely resolved via live binding:', aVar);
}

```

---

### Summary Comparison

| Scenario                                    | CommonJS (CJS)                                                                  | ES Modules (ESM)                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **How circular module is returned**         | Returns a copy of whatever `module.exports` holds at the moment of `require()`. | Returns a live reference binding connected during the static linking phase.      |
| **Calling circular functions**              | Fails if assigned via `module.exports = fn` after the `require()` line.         | **Succeeds** because function declarations are hoisted during the linking phase. |
| **Top-level uninitialized variable access** | Returns `undefined` or partial properties on `{}`.                              | Throws `ReferenceError` (enforces Temporal Dead Zone).                           |
| **Post-evaluation value updates**           | Importer holds stale primitive copies.                                          | Importer reads latest updated values automatically via live binding.             |
