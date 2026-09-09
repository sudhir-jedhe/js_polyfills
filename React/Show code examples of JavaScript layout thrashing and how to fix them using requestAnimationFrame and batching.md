***  Show code examples of JavaScript layout thrashing and how to fix them using requestAnimationFrame and batching.md ***

Layout thrashing occurs when JavaScript repeatedly interleaves **DOM reads** (requesting layout metrics) and **DOM writes** (modifying styles or structure). This forces the browser to recalculate layout synchronously on every iteration instead of waiting to batch changes at the end of the frame.

---

### The Anti-Pattern: Layout Thrashing

In this example, every time `box.offsetWidth` is read after changing `box.style.width`, the browser must immediately run a full synchronous reflow to compute the new geometric width.

```javascript
// ❌ BAD: Read/Write interleaving in a loop (Forces N reflows)
const boxes = document.querySelectorAll('.box');

boxes.forEach((box) => {
  // 1. READ: Forces the browser to flush pending layout changes
  const currentWidth = box.offsetWidth; 

  // 2. WRITE: Invalidates the layout again
  box.style.width = `${currentWidth + 10}px`; 
});

```

* **Pipeline behavior:** `Write -> Read (Forced Reflow) -> Write -> Read (Forced Reflow) ...`

---

### Solution 1: Manual Read/Write Batching

Separate the loop into two distinct phases: read all geometric values first (when layout is clean), then apply all style modifications.

```javascript
//  GOOD: Batch all reads first, then batch all writes (1 reflow)
const boxes = document.querySelectorAll('.box');

// Phase 1: BATCH READS (Clean layout, no recalculation needed)
const newWidths = Array.from(boxes).map((box) => box.offsetWidth + 10);

// Phase 2: BATCH WRITES (Browser queues all updates together)
boxes.forEach((box, index) => {
  box.style.width = `${newWidths[index]}px`;
});

```

* **Pipeline behavior:** `Read -> Read -> Read -> Write -> Write -> Write -> (Single Reflow at frame end)`

---

### Solution 2: Animation Loops with `requestAnimationFrame`

When animating or handling high-frequency events (like scroll or resize), defer the write step to `requestAnimationFrame` (rAF) so updates synchronize directly with the screen refresh cycle.

```javascript
//  GOOD: Measuring in event loop, mutating inside rAF
const boxes = document.querySelectorAll('.box');

function updateLayoutOnScroll() {
  // 1. READ: Measure immediately in the event handler
  const scrollY = window.scrollY;
  const updates = Array.from(boxes).map((box) => {
    return {
      element: box,
      targetTop: box.offsetTop + scrollY * 0.1
    };
  });

  // 2. WRITE: Defer all DOM mutations to the next frame
  requestAnimationFrame(() => {
    updates.forEach(({ element, targetTop }) => {
      element.style.transform = `translateY(${targetTop}px)`;
    });
  });
}

window.addEventListener('scroll', updateLayoutOnScroll, { passive: true });

```

---

### Common Layout-Triggering Properties

Keep these grouped together to avoid accidental flushes:

| Category           | Properties / Methods that Force Synchronous Layout                                           |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Box Metrics**    | `offsetWidth`, `offsetHeight`, `offsetTop`, `offsetLeft`, `clientWidth`, `clientHeight`      |
| **Scroll Metrics** | `scrollTop`, `scrollLeft`, `scrollWidth`, `scrollHeight`                                     |
| **Methods**        | `getBoundingClientRect()`, `getClientRects()`, `getComputedStyle()`, `scrollBy()`, `focus()` |
