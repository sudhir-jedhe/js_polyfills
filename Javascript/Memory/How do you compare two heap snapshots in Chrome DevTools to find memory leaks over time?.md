***  How do you compare two heap snapshots in Chrome DevTools to find memory leaks over time?.md ***

Comparing two (or three) heap snapshots using the **Comparison View** in Chrome DevTools allows you to isolate objects that were allocated during an interaction but failed to be garbage collected.

---

### The 3-Snapshot Testing Workflow

The most reliable way to prove a leak is the **Baseline $\rightarrow$ Action $\rightarrow$ Return to Baseline** technique.

1. **Take Baseline (Snapshot 1):**
Open Chrome DevTools $\rightarrow$ **Memory** tab. Select **Heap snapshot** and click **Take snapshot**.

2. **Perform the Action:**
Execute the user action that you suspect causes a leak (e.g., open a modal, navigate to a page, click a button).

3. **Reset & Force Garbage Collection:**
Reverse the action (e.g., close the modal, navigate back). Click the **Collect Garbage** icon (the trash can in the top-left of DevTools) to ensure unreferenced objects are purged.

4. **Take Post-Action (Snapshot 2):**
Take a second heap snapshot. In a leak-free application, the heap should return close to Snapshot 1's size.

---

### Switching to Comparison View

1. In the left sidebar of the **Memory** tab, select **Snapshot 2**.
2. At the top of the panel, click the perspective dropdown (defaults to **Summary**) and change it to **Comparison**.
3. In the reference dropdown next to it, ensure it says **Snapshot 1** (comparing Snapshot 2 against Snapshot 1).

```
[ Comparison ▼ ]  [ Snapshot 1 ▼ ]  [ Class filter          ]

```

---

### Interpreting the Comparison Columns

The Comparison view highlights the net delta between the two points in time:

| Column         | What It Means                                               | What to Look For                                                                            |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **# Alloc**    | Total number of new objects allocated since Snapshot 1.     | Normal to be high during activity.                                                          |
| **# Freed**    | Total number of objects garbage collected.                  | High values indicate healthy cleanup.                                                       |
| **# Delta**    | **Net change in object count** (`# Alloc` minus `# Freed`). | **Positive delta ($\mathbf{> 0}$)** indicates objects that were created and never released. |
| **Size Delta** | Net bytes added or removed for that constructor.            | Focus on rows with the largest positive byte growth.                                        |

---

### Isolating the Leak

**1. Filter Suspicious Constructors:**

* Sort the table by **# Delta** or **Size Delta** in descending order.
* Use the **Class filter** box to search for common leak culprits:
* `system / Context` (leaked closure scopes)
* `Detached HTML...Element` (DOM nodes removed from page but referenced in JS)
* `Array` or `Object`
* Your custom class/service names (e.g., `UserService`, `Subscription`)

**2. Inspect the Delta Objects:**

* Expand the constructor with a positive delta (e.g., `Detached HTMLDivElement`).
* Select a specific object instance (e.g., `@142951`).

**3. Analyze the Retainers Pane:**

* Look at the bottom **Retainers** window to trace the reference path keeping the object alive:
* **Yellow Highlight:** The selected object.
* **Red Highlight / Edge Labels:** The direct reference path leading back to a **GC Root** (such as `window`, a global Map/Array, an active `setInterval`, or an uncleared event listener).

---

### Quick Filter Alternative: "Objects allocated between Snapshot 1 and 2"

Instead of the full Comparison diff, you can change the view mode from **Summary** $\rightarrow$ **Objects allocated between Snapshot 1 and Snapshot 2**.

This view filters out all pre-existing objects from before the interaction, showing *only* the objects created during your test step that are still alive in memory.
