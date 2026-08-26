*** copy What is the exact difference between async and defer script execution in the browser pipeline?.md ***

The primary difference lies in **when the script executes** and **whether execution pauses HTML parsing**. Both attributes download scripts in the background without blocking the parser, but they handle the execution phase differently.

---

### Visual Pipeline Comparison

```
1. Default (<script>)
HTML Parsing:    [=== Pause ===]─────────►[=== Resume ===]
Network (Fetch):               [=== Fetch ===]
JS Execution:                                 [=== Exec ===]

2. async (<script async>)
HTML Parsing:    [================ Pause =]──────────────►
Network (Fetch): [=== Fetch ===]
JS Execution:                  [=== Exec ===] (Executes immediately when fetched)

3. defer (<script defer>)
HTML Parsing:    [========================================] (Parses completely)
Network (Fetch): [=== Fetch ===]
JS Execution:                                             [=== Exec ===] (Before DOMContentLoaded)

```

---

### Comparison Matrix

| Attribute               | Download Behavior                    | Execution Timing                                            | Execution Order                                                        | Blocks HTML Parser?                                              | Ideal Use Case                                                                   |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Standard `<script>**` | Blocks parsing immediately           | Pauses parser, fetches, executes, then resumes              | Preserved in document order                                            | **Yes** (during download and execution)                          | Rare; only if script must run before any further parsing                         |
| **`<script async>`**    | Downloads asynchronously in parallel | Executes **immediately** the moment it finishes downloading | **Unordered** (whichever script finishes downloading first runs first) | **Yes, but only during execution** (pauses parser while running) | Independent scripts with zero dependencies (Analytics, Ads, Tracking)            |
| **`<script defer>`**    | Downloads asynchronously in parallel | Executes **only after** the HTML document is fully parsed   | **Guaranteed order** (executes in the exact order declared in the DOM) | **No** (executes before `DOMContentLoaded` event)                | Application code, UI frameworks, scripts depending on DOM nodes or other scripts |

---

### Key Behavioral Differences

**1. Parser Interruption**

* **`async`** pauses the HTML parser mid-stream as soon as the file arrives over the network to execute its code. If a small async script finishes downloading while HTML is still parsing, parsing halts immediately.
* **`defer`** never interrupts HTML parsing. It waits until the DOM tree construction is finished, running right before the `DOMContentLoaded` event fires.

**2. Execution Ordering**

* **`async` is non-deterministic.** If you have two scripts:

```html
<script async src="large-library.js"></script>
<script async src="small-dependent-code.js"></script>

```

`small-dependent-code.js` will likely finish downloading first and execute **before** `large-library.js`, causing reference errors (e.g., `Uncaught ReferenceError: $ is not defined`).

* **`defer` preserves document order.** Even if a smaller deferred script downloads first, the browser queues it and executes scripts strictly in the order they appear in the HTML.

**3. Modern JavaScript Modules (`<script type="module">`)**

* Modern ES modules (`type="module"`) are **deferred by default**.
* Adding `async` to a module (`<script type="module" async>`) makes it execute eagerly as soon as the module and all its imports are fetched.

---

### Rule of Thumb

* Use **`defer`** for any script that manipulates the DOM or depends on other scripts (e.g., React bundles, UI libraries, utility code).
* Use **`async`** only for isolated, third-party scripts that have no dependencies and do not modify layout (e.g., Google Analytics, Tag Manager, Hotjar).
