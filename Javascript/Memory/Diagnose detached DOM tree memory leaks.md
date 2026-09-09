***  Diagnose detached DOM tree memory leaks.md ***

A **Detached DOM Tree** occurs when a DOM node is removed from the active document tree (`parent.removeChild(node)` or `element.remove()`), but JavaScript code still holds a reference to that node or any of its child elements.

Because of that reference, the JavaScript Garbage Collector (GC) cannot reclaim the node or any part of its entire sub-tree, leaking memory for all associated elements, listeners, and child data.

---

### Step-by-Step Diagnostic Workflow in DevTools

1. **Take a Heap Snapshot After Node Removal:**
Perform the UI action that creates and removes the DOM element (e.g., opening and closing a modal/flyout). Click the **Collect Garbage** icon (trash can) in the DevTools Memory panel to clean unreferenced items, then click **Take snapshot**.

2. **Filter for Detached Nodes in Summary View:**
In the **Class filter** box at the top, type `Detached`. Chrome DevTools flags unattached DOM trees explicitly (e.g., `Detached HTMLDivElement`, `Detached HTMLButtonElement`, `Detached InternalNode`).

3. **Inspect Retained Size & Retainers Tree:**
Sort by **Retained Size**. Expand a detached element and click on an instance (e.g., `@142951`). Look at the bottom **Retainers** pane to trace which JavaScript variable, event listener, or closure is holding the reference.

---

### Common Detached DOM Leak Scenarios & Fixes

#### 1. Global / Module-Level Variable References

Holding an element reference in a global cache or long-lived array after removing it from the DOM.

```javascript
// LEAK: Reference survives element removal
const cache = [];

function createBanner() {
  const banner = document.createElement("div");
  banner.className = "alert-banner";
  document.body.appendChild(banner);
  
  cache.push(banner); // Pinned in array
}

function removeBanner() {
  const banner = document.querySelector(".alert-banner");
  banner.remove(); // Removed from active DOM, but still pinned in `cache`
}

// FIX: Clean the reference when unmounting/removing
function removeBannerFixed() {
  const banner = document.querySelector(".alert-banner");
  banner.remove();
  const index = cache.indexOf(banner);
  if (index !== -1) cache.splice(index, 1); // Clears JS reference
}

```

---

#### 2. Dangling Event Listeners on Detached Elements

Attaching an event listener on a parent object (like `window` or `document`) that closes over the element, or forgetting to unbind observers.

```javascript
// LEAK: Window resize listener retains detached element via closure
function setupWidget() {
  const widget = document.createElement("div");
  widget.id = "floating-widget";
  document.body.appendChild(widget);

  window.addEventListener("resize", () => {
    // Retains 'widget' in closure scope forever
    widget.style.top = `${window.innerHeight - 50}px`;
  });
}

function teardownWidget() {
  const widget = document.getElementById("floating-widget");
  widget.remove(); // Leaked! The resize listener still retains 'widget'
}

// FIX: Remove the listener with an AbortController or removeEventListener
function setupWidgetFixed() {
  const widget = document.createElement("div");
  const ac = new AbortController();
  
  window.addEventListener("resize", () => {
    widget.style.top = `${window.innerHeight - 50}px`;
  }, { signal: ac.signal });

  return () => {
    widget.remove();
    ac.abort(); // Unbinds listener -> GC reclaims the node
  };
}

```

---

#### 3. Leaf-Node Retention (Whole Tree Leak)

Retaining a reference to **just a single child element** (even a small `<span>` or button) keeps the **entire ancestor and sibling tree** alive in memory.

```javascript
let savedButton;

function renderModal() {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="modal-body">
      <p>Huge table with 5,000 rows...</p>
      <button id="submit-btn">Submit</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Storing only a child button
  savedButton = modal.querySelector("#submit-btn");
}

function closeModal() {
  document.querySelector(".modal-body").parentElement.remove();
}

// Result: Even though modal was removed, retaining 'savedButton' 
// keeps the modal, parent container, and all 5,000 child rows alive!

```

---

### How to Read the Retainers Pane for Detached Trees

When viewing a detached node in the **Retainers** tree, look for:

* **Yellow Nodes:** The selected detached DOM node.
* **Red Nodes:** Nodes that are detached from the document and have direct references preventing garbage collection.
* **Property Edge Names:** Look at edges like `context`, `cache`, `onClick`, or `__reactFiber$` to see whether a closure, third-party library, or framework virtual DOM binding is holding the pointer.
