***  How does Agoric's SES (Secure ECMAScript) use Compartments and Object.freeze for deterministic sandboxing?.md ***

***How does Agoric's SES (Secure ECMAScript) use Compartments and Object.freeze for deterministic sandboxing?***

Agoric’s **SES (Secure ECMAScript)**—the foundation of **Hardened JavaScript**—creates secure, deterministic sandboxes inside a single JavaScript engine process (like V8 or Moddable XS).

Instead of isolating code via heavy operating-system processes or WebAssembly runtimes, SES uses the language's native object-capability (OCap) model by combining two primitives:

1. **`lockdown()` (Deep-Freezing Intrinsics):** Removes ambient authority and locks down all shared intrinsic prototypes.
2. **`Compartment` (Isolated Evaluator & Global Lexicon):** Provides isolated execution contexts with independent global variables and module loaders while sharing the frozen, immutable intrinsics.

---

### The SES Sandboxing Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Hardened JS Environment                         │
├────────────────────────────────────────────────────────────────────────┤
│  1. Shared, Frozen Intrinsics (`lockdown()`)                          │
│     • Object.prototype, Array.prototype, Function.prototype           │
│     • Deeply frozen via Object.freeze() — Completely Immutable         │
│     • Prototype pollution is mathematically impossible                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  2. Compartment A (Untrusted Plugin)     3. Compartment B (Host Logic) │
│     ┌────────────────────────────┐          ┌────────────────────────┐ │
│     │ Custom Global Object       │          │ Host Global Object     │ │
│     │ • Math, JSON               │          │ • fetch, process       │ │
│     │ • (No I/O or ambient authority)       │ • Full capabilities    │ │
│     │                            │          │                        │ │
│     │ Evaluator: compartment.evaluate()     │                        │ │
│     └─────────────┬──────────────┘          └───────────┬────────────┘ │
│                   │                                     │              │
│                   ▼                                     ▼              │
│     Shares underlying frozen intrinsics (Zero copy memory overhead)    │
└────────────────────────────────────────────────────────────────────────┘

```

---

### 1. `lockdown()`: Eliminating Covert Channels & Prototype Pollution

Before running untrusted code, SES invokes `lockdown()`. This performs an exhaustive, recursive traversal that modifies the engine's initial state:

#### A. Deep-Freezing All Built-in Intrinsics

`lockdown()` calls `Object.freeze()` on every single intrinsic prototype and constructor (`Object.prototype`, `Array.prototype`, `Promise.prototype`, `Error.prototype`, etc.).

* **Prevents Prototype Pollution:** Malicious code in a sandbox cannot overwrite `Array.prototype.push` or `Object.prototype.toString` to tamper with other sandboxes or the host environment.
* **Eliminates Shared-State Covert Channels:** Objects cannot be used as mutable communication channels across isolated boundaries.

#### B. Taming Non-Deterministic & Ambient Authority Primitives

Standard JavaScript includes built-ins that leak non-determinism or provide implicit I/O:

* **`Date.now()` and `Math.random()`:** Replaced with deterministic or disabled implementations to prevent side-channel timing attacks.
* **`Error.captureStackTrace` / `Error.prototype.stack`:** Redacted to prevent sandboxed code from inspecting the host call stack structure.
* **`Function` Constructor:** Prevented from bypassing the scope chain to execute raw code against the root global object.

```javascript
import 'ses';

// Run once at application boot
lockdown({
  errorTaming: 'safe',
  dateTaming: 'fake',
  mathTaming: 'fake',
});

// Any attempt to pollute prototypes fails:
Array.prototype.customHack = () => {}; 
// ❌ TypeError: Cannot add property customHack, object is not extensible

```

---

### 2. `Compartment`: Fast, Independent Global Namespaces

Once the base environment is frozen, SES allows the creation of arbitrary **`Compartments`**.

A `Compartment` gives sandboxed code its own isolated Global Lexicon and evaluation environment (`evaluate()`), but shares the already-frozen intrinsics directly in memory:

```javascript
const c1 = new Compartment({
  // Attenuated endowments (explicitly injected capabilities)
  console: harden({
    log: (...args) => console.log('[Sandbox A]:', ...args)
  })
});

// Sandboxed execution with zero access to global process/window/fetch
const result = c1.evaluate(`
  const a = 10;
  console.log("Computing in sandbox");
  a * 2;
`);

console.log(result); // 20

```

#### Why Compartments Outperform Traditional VMs / Workers

* **Zero Copy Overhead:** Because `Array.prototype` and `Object.prototype` are immutable, Compartments do not duplicate built-in objects. A thousand compartments share the exact same intrinsic heap structures.
* **Sub-Millisecond Instantiation:** Creating a compartment is as fast as allocating a plain JavaScript object.
* **Synchronous Object Capability (OCap) Interactivity:** Objects and functions can be passed into and out of compartments directly as long as they are **hardened** (`harden(obj)` / `Object.freeze()`).

---

### 3. The `harden()` Function and Object Capabilities (OCap)

SES introduces the **`harden()`** global primitive (a specialized, transitive `deepFreeze`):

* Once an object is `harden()`ed, it is completely immutable and safe to pass across compartment boundaries.
* **Authority must be explicitly passed:** A compartment has access **only** to the capabilities explicitly provided in its global namespace or via function arguments.

```javascript
// Host creates a restricted capability
let balance = 1000;
const readOnlyLedger = harden({
  getBalance: () => balance,
  // deposit() is deliberately omitted!
});

// Pass capability into compartment
const plugin = new Compartment({ ledger: readOnlyLedger });

plugin.evaluate(`
  // Plugin can read:
  const b = ledger.getBalance(); 

  // Plugin CANNOT mutate or steal authority:
  ledger.getBalance = () => 999999; // ❌ TypeError: Cannot assign to read-only property
`);

```

---

### Summary: SES vs. Traditional Sandboxing Approaches

| Mechanism               | SES (Hardened JS + Compartments)         | Web Worker / Node `vm` module             | iframe Sandbox                |
| ----------------------- | ---------------------------------------- | ----------------------------------------- | ----------------------------- |
| **Isolation Model**     | In-process OCap & Prototype Freezing     | OS Thread / V8 `Isolate` Context          | Separate DOM Document         |
| **Prototype Tampering** | 🛡️ **Mathematically impossible** (Frozen) | Vulnerable if references leak across `vm` | Independent (heavy memory)    |
| **Memory Footprint**    | ⚡ **Minimal** (Shared frozen intrinsics) | 🔴 **High** (Clones full standard library) | 🔴 **Heavy** (Full DOM engine) |
| **Execution Overhead**  | Near-native JIT execution speed          | Serialization / IPC cost                  | PostMessage serialization     |
