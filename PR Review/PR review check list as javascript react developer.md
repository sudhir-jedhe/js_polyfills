A practical, senior-level Pull Request review checklist tailored for JavaScript and React codebases, broken down into static code analysis and dynamic experience verification.

---

### 1. React Architecture & State Management

* **Derived State vs. Sync Effects:** Are values computed on the fly via pure functions or `useMemo` instead of being synced through redundant `useState` + `useEffect` pairs?
* **Initial State Performance:** Are heavy operations in `useState` wrapped in lazy initializer functions (`useState(() => getStoredData())`) to avoid re-running on every render?
* **Component Granularity:** Are large components broken down logically so localized state changes do not force re-renders across the entire view tree?
* **Context Overhead:** Is large, frequently changing state placed in a single React Context without splitting, triggering unnecessary re-renders in consumer components?
* **Clean Cleanup Lifecycles:** Do `useEffect` hooks cleanly teardown event listeners, WebSocket connections, timeouts, intervals, and `AbortController` instances?

---

### 2. JavaScript, Logic & Error Resilience

* **Async Race Conditions:** Are in-flight network requests cancelled or guarded if component props/state change or the component unmounts mid-request?
* **Nullish & Optional Handling:** Are API responses safely accessed via optional chaining (`?.`) and nullish coalescing (`??`), especially for nested arrays/objects?
* **Equality & Reference Stability:** Are objects/arrays used in hook dependency arrays memoized (`useMemo`) or extracted outside the component to prevent infinite loops?
* **Edge Case Handling:** Does the implementation cleanly handle empty arrays `[]`, undefined payloads, loading states, partial network failures, and zero-value numbers (`0`)?
* **Mutation-Free Operations:** Are array and object mutations handled immutably (e.g., using `.map()`, `.filter()`, or `...spread` instead of `.push()`, `.splice()`, or direct property reassignment)?

---

### 3. DOM, Performance & Web Vitals

* **Stable Key Usage:** Are array lists using stable, unique IDs as `key` props instead of array indices (`index`), which break reconciliation during reordering or deletion?
* **Asset Loading & LCP:** Are above-the-fold hero images preloaded or given `fetchpriority="high"` instead of `loading="lazy"`?
* **Bundle Splitting:** Are heavy, non-critical routes, modals, or charts dynamically imported using `React.lazy()` / `import()`?
* **Event Listener Throttling/Debouncing:** Are continuous event streams (e.g., `scroll`, `resize`, real-time text input) properly debounced or throttled to avoid main-thread blocking?

---

### 4. Accessibility (a11y) & UX

* **Keyboard Trapping & Escape:** Can open modals and drawers be closed via the `Esc` key, and is focus retained inside dialog containers?
* **Screen Reader Semantics:** Are interactive elements built using semantic HTML (`<button>`, `<a>`, `<nav>`, `<aside>`) rather than `<div>` with `onClick`?
* **Form Feedback:** Do form inputs have associated `<label>` tags, explicit validation feedback, and appropriate `aria-invalid` or `aria-live` regions for error alerts?
* **Layout Shifts (CLS):** Do images, skeletons, and dynamic banners have defined aspect ratios or dimensional placeholders to prevent layout jumps?

---

### 5. Automated Tests & Operational Hygiene

* **Behavioral Unit Tests:** Do tests assert user-visible behavior (e.g., via React Testing Library querying by role/label) rather than component implementation details or internal state?
* **No Stray Debugging Artifacts:** Are lingering `console.log`, `debugger`, commented-out legacy code, and temporary hardcoded IDs removed?
* **Environment Configuration:** Are API URLs, keys, and feature flags properly referenced from environment variables rather than hardcoded inline?
