*** copy What is the purpose of key in prop in react? What is the consequence of using the array indices as a value for key in react?.md ***

The **`key`** prop gives elements inside dynamic lists a stable identity. React uses it during **reconciliation** (the Virtual DOM diffing process) to match incoming elements with existing Fiber nodes, determining whether to reuse, reorder, insert, or destroy a DOM node.

---

**Why React Needs Keys**

Without unique keys, React can only match list items sequentially by their index:

* **With stable keys (e.g., `key={item.id}`):** React tracks items by their unique identity. If an item is added to the top or the list is sorted, React reorders or shifts existing DOM nodes without destroying their internal component state or unmounting them.
* **Without keys (or with unstable keys):** React compares the first element of the new list to the first element of the old list, the second to the second, and so on.

---

**Consequences of Using Array Indices as Keys (`key={index}`)**

Using `key={index}` breaks the assumption of a **stable identity** whenever the list is reordered, filtered, or prepended/inserted into. Because the index is bound to the *position* rather than the *data item*, the key of an item changes whenever its index changes.

```javascript
// Risky pattern:
{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}

```

**1. Uncontrolled / Internal Component State Glitches**
When items shift positions, the DOM node or Fiber instance stays tied to `key=0`, `key=1`, etc. Any internal state maintained inside the child component (like an `<input>` value, checkbox selection, or `useState` toggle) does **not** move with the data.

* *Example:* If you have 3 inputs and delete the first item, the input that had focus or text at index `0` stays attached to the *new* item at index `0`. The user sees their typed text jump to the wrong item.

**2. Broken Animations & CSS Transitions**
Layout transition libraries (like Framer Motion) rely on `key` changes to compute enter/exit animations. When indices are used, the container sees the same set of keys (`0, 1, 2...`) rather than an item leaving and another entering, causing transitions to fail or visually flicker.

**3. Performance Degradation**
When you insert an item at the beginning of an array:

* With unique IDs: React inserts 1 new DOM node at index `0` and leaves the existing nodes alone.
* With array indices: Every existing item receives a new index ($0 \to 1$, $1 \to 2$, etc.). React treats every single node as having changed props, forcing unnecessary re-renders and DOM updates down the entire list tree.

---

**When is Using Index as Key Acceptable?**

Using `key={index}` is safe **only** if all three of the following conditions are met:

1. The list and its items are completely **static** (never reordered, sorted, or filtered).
2. Items are never **added or removed** from the top or middle of the list.
3. The rendered items have **no internal state** (no uncontrolled inputs, no form fields, no local state toggles).

Otherwise, always use a persistent, unique identifier from your data model (such as a database `id` or a UUID).
