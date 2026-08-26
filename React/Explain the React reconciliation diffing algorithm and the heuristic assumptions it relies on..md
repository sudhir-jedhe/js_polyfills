*** copy Explain the React reconciliation diffing algorithm and the heuristic assumptions it relies on..md ***

**Reconciliation** is React’s process for comparing two Virtual DOM (Fiber) trees to determine the minimum set of DOM mutations needed to bring the UI up to date.

A state-of-the-art general tree-to-tree transformation algorithm has a computational complexity of $\mathcal{O}(n^3)$, where $n$ is the number of nodes. For a tree of 1,000 elements, this would require 1 billion comparisons per render. To keep rendering near $60\text{ FPS}$, React replaces this with a heuristic $\mathcal{O}(n)$ diffing algorithm.

---

**The Two Fundamental Heuristics**

React's linear-time diffing relies on two assumptions:

1. **Two elements of different types produce fundamentally different trees.**
2. **Dynamic collections of children can be matched across renders using a stable `key` prop.**

---

**How the Diffing Algorithm Works in Practice**

React traverses the current Fiber tree and the new React Element tree concurrently, applying specific rules based on node types and positions:

* **Level-by-Level (Breadth/Depth-First) Comparison**
* React only compares nodes at the exact same depth level. If a node moves to a different parent, React will not attempt to find it elsewhere in the hierarchy; it unmounts the old node and mounts a new one.

* **Elements of Different Types**
* If the root tag or component type changes (e.g., `<a>` $\to$ `<span>`, or `<Counter/>` $\to$ `<Profile/>`), React does not attempt to diff children.
* It completely unmounts the entire old subtree:

1. Triggers cleanup effects (`useEffect` cleanups, `componentWillUnmount`).
2. Destroys all associated local state.
3. Destroys the underlying DOM nodes and mounts a fresh tree from scratch.

* **DOM Elements of the Same Type**
* If the node types match (e.g., `<div className="before" title="stuff" />` $\to$ `<div className="after" title="stuff" />`), React retains the underlying DOM node.
* It only updates the mutated attributes (e.g., patching `className`) without rebuilding the node.
* For CSS styles (`style={{ color: 'red', fontWeight: 'bold' }}` $\to$ `style={{ color: 'green', fontWeight: 'bold' }}`), React only modifies the specific style property that changed (`color`).

* **Component Elements of the Same Type**
* When a component updates, React keeps the underlying component instance and its internal state alive.
* It passes down the new `props` and triggers a re-render lifecycle/effect on the component, diffing the underlying returned elements recursively.

* **Diffing Dynamic Lists of Children**
* **Without Keys:** React iterates over old and new child arrays concurrently by index. If you prepend an item to a list of 1,000 items, React sees all 1,000 indices as changed, causing 1,000 node mutations instead of 1 insertion.
* **With Keys:** React builds a fast hash-map look-up (`key` $\to$ Fiber node). It matches incoming elements against previous Fibers by key, quickly identifying whether a child was inserted, deleted, moved, or updated.

---

**Summary of Diffing Rules**

| Scenario                                               | React Action                               | State Preserved?           |
| ------------------------------------------------------ | ------------------------------------------ | -------------------------- |
| `<div>` $\to$ `<p>`                                    | Destroys old DOM node & creates new one    | **No** (Subtree unmounted) |
| `<Button color="blue"/>` $\to$ `<Button color="red"/>` | Keeps instance; updates props & re-renders | **Yes**                    |
| `<Form key="A"/>` $\to$ `<Form key="B"/>`              | Destroys old instance & mounts new one     | **No**                     |
| Reordered list with keys                               | Reorders existing DOM nodes                | **Yes**                    |
