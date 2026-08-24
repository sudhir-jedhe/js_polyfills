`useInsertionEffect` is a specialized Hook introduced in React 18 specifically for **CSS-in-JS library authors** (like styled-components and Emotion). It allows injecting dynamic `<style>` tags or CSS rules into the DOM **before** any layout measurements are read.

---

### The Problem It Solves: Style Invalidation & Forced Reflows

When CSS-in-JS libraries generate styles at runtime, injecting `<style>` tags inside `useEffect` or `useLayoutEffect` causes severe performance bottlenecks:

1. **Inside `useEffect`:** The browser paints first, then styles are injected, causing a visible flash of unstyled content (FOUC).
2. **Inside `useLayoutEffect`:** If user code in a `useLayoutEffect` calls `getBoundingClientRect()`, and a CSS-in-JS library injects dynamic styles inside *its own* `useLayoutEffect`, the browser is forced to recalculate layout and styles multiple times within a single frame (**forced reflow / layout thrashing**).

`useInsertionEffect` resolves this by running before `useLayoutEffect`, ensuring all styles are in the DOM and resolved *before* any layout measurements occur.

---

### Execution Order in the Commit Phase

`useInsertionEffect` runs **synchronously during the Mutation sub-phase**, firing before layout effects and before refs are attached.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. MUTATION PHASE (Synchronous)                             │
│    • DOM nodes inserted / updated / removed                 │
│    • useInsertionEffect cleanup runs                        │
│    • useInsertionEffect setup runs (Inject <style> tags)    │
│    • Ref detachment occurs                                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. LAYOUT PHASE (Synchronous - Blocks Paint)                │
│    • Refs attached / updated (ref.current = DOMNode)        │
│    • useLayoutEffect cleanup runs                           │
│    • useLayoutEffect setup runs (Read DOM measurements)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BROWSER PAINT (Screen updates for the user)              │
│    • Browser computes styles, layout, and paints pixels     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. PASSIVE EFFECT PHASE (Asynchronous - After Paint)        │
│    • useEffect cleanup runs                                 │
│    • useEffect setup runs (Data fetching, subscriptions)    │
└─────────────────────────────────────────────────────────────┘

```

---

### Key Comparison

| Hook                     | Timing                                                               | Access to DOM Refs                          | Primary Use Case                                           |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| **`useInsertionEffect`** | **Synchronous**, before DOM mutations complete / before layout reads | **No** (Refs are `null` / not yet attached) | Injecting runtime CSS `<style>` rules (CSS-in-JS only)     |
| **`useLayoutEffect`**    | **Synchronous**, after DOM mutation, before browser paint            | **Yes** (`ref.current` is fully bound)      | Measuring DOM layout and synchronous position calculations |
| **`useEffect`**          | **Asynchronous**, deferred until after browser paint                 | **Yes** (`ref.current` is fully bound)      | Data fetching, event listeners, subscriptions, logging     |

---

### Constraints & Usage Rules

* **No Ref Access:** `useInsertionEffect` fires before React attaches or updates `ref.current`. Attempting to read a DOM ref inside it will yield `null`.
* **No State Updates:** You cannot schedule state updates (`setState`) inside `useInsertionEffect`.
* **Application Code:** Application developers should avoid `useInsertionEffect`. It is intended strictly for dynamic CSS rule injection in styling libraries:

```javascript
// Example: Typical CSS-in-JS internal implementation
function useCSS(rule) {
  useInsertionEffect(() => {
    if (!isRuleInserted(rule)) {
      const styleTag = document.createElement('style');
      styleTag.textContent = rule;
      document.head.appendChild(styleTag);
    }
  }, [rule]);
}

```
