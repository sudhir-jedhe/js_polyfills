### **Reconciliation in React**

**Reconciliation** is the process by which React updates the DOM (Document Object Model) based on changes in the component's state or props. It’s how React determines which parts of the UI need to be updated when data changes.

The goal of reconciliation is to efficiently update the user interface, minimizing the number of changes required and optimizing performance. React achieves this by utilizing a **diffing algorithm** that compares the previous and new virtual DOM trees.

### **How Does React's Reconciliation Work?**

React maintains a **Virtual DOM**, which is a lightweight representation of the real DOM. The real DOM can be slow to update because it has to modify the actual HTML on the page. By using a virtual DOM, React can quickly perform computations to figure out what has changed, and then it applies those changes to the real DOM in an optimized manner.

Here’s how reconciliation works step-by-step:

1. **Virtual DOM Tree Creation**:
   - When the state or props of a component change, React creates a new Virtual DOM tree that reflects the updated UI.

2. **Diffing the Virtual DOM**:
   - React compares the new Virtual DOM tree with the previous one (known as the **"old virtual DOM"**). This comparison helps identify the differences, which is known as **"diffing."**

3. **Efficient Updates**:
   - React identifies the minimal set of changes needed to update the actual DOM. Rather than updating the entire DOM, React updates only the parts that have changed, ensuring efficiency.

4. **Reconciliation Algorithm**:
   - React uses an optimized diffing algorithm based on **two assumptions**:
     1. **Elements of the same type** will be updated efficiently by comparing their props.
     2. **Children of the same parent** will be re-ordered or replaced as needed, but React will keep the same components in place when possible.

   The diffing algorithm helps React make efficient decisions about which updates need to happen, based on:
   - **Keys**: When a list of elements is rendered dynamically (like with `map`), React relies on the `key` prop to uniquely identify each item. The `key` helps React understand which items have changed, been added, or removed.

   - **Element Types**: If two elements of different types are encountered (e.g., `<div>` vs. `<span>`), React will discard the old subtree and build a new one.

5. **Batching Updates**:
   - React batches DOM updates to optimize performance. Instead of re-rendering the DOM after every change, React groups updates together and performs them in one batch, ensuring fewer reflows and repaints.

### **Why is Reconciliation Important?**

Reconciliation is critical because it allows React to efficiently manage state and ensure that only the necessary changes are made to the DOM. This minimizes performance bottlenecks and enables React to render complex UIs smoothly. React’s diffing algorithm is the heart of this optimization process.

### **Key Concepts Related to Reconciliation**

1. **Virtual DOM**:
   - React creates a virtual representation of the real DOM. When an update occurs, React compares the current virtual DOM to the new one and calculates the minimal number of changes needed to reflect the new UI in the real DOM.

2. **Keys in Lists**:
   - Keys are crucial in React when rendering lists of elements. They help React identify which items have changed, been added, or removed. Without keys, React will have to re-render the entire list, which can be inefficient.
   - Example of using keys:
     ```jsx
     const items = ["Apple", "Banana", "Cherry"];
     return (
       <ul>
         {items.map((item, index) => (
           <li key={index}>{item}</li> // Key helps React track changes in the list
         ))}
       </ul>
     );
     ```
   - A better approach is to use unique, consistent keys (like IDs from your data) rather than array indices, which can change when items are added or removed.

3. **Pure Components**:
   - A **PureComponent** is a type of React component that implements the `shouldComponentUpdate` lifecycle method with a shallow prop and state comparison. If the props or state haven't changed, React will skip re-rendering that component.
   - This optimization helps reduce unnecessary re-renders during reconciliation.

4. **Reconciliation and Performance**:
   - Reconciliation plays a significant role in optimizing React app performance. If React identifies a change in the state or props, it will update the affected parts of the UI without performing a full page refresh. This makes React apps highly performant, even with frequent UI updates.

### **Example of Reconciliation:**

Let’s consider an example where we have a list of items and add or remove items dynamically.

#### Initial List:

```jsx
import React, { useState } from "react";

const App = () => {
  const [items, setItems] = useState(["Apple", "Banana", "Cherry"]);

  const addItem = () => {
    setItems([...items, "Grapes"]);
  };

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={item}>{item}</li> // Using item as the key
        ))}
      </ul>
    </div>
  );
};

export default App;
```

In this example:

- React uses reconciliation to update the UI when the `addItem` function is called. It will efficiently render the new list and append the new item (`'Grapes'`) without re-rendering the entire list.
- When React encounters an item change (such as adding `'Grapes'`), it will use the `key` (the unique `item` string in this case) to identify which element has changed and apply the update.

### **Why Not Use Array Indices as Keys?**

Using array indices as keys is not recommended for dynamic lists because:

1. **Reordering**: If the list is reordered (e.g., items are removed or added at different positions), React will not be able to match the new list to the correct components efficiently. This can lead to unnecessary re-renders or incorrect UI states.
2. **State Loss**: If components are reused and the index is used as the key, React might associate the wrong state with the wrong element.

For example, if items in a list change order, using indices can cause React to re-render elements unnecessarily, or worse, reuse DOM elements incorrectly.

### **Summary of Key Points:**

- **Reconciliation** is the process of determining how the DOM should be updated when the component’s state or props change.
- **Virtual DOM** helps React efficiently compare the old and new DOM trees.
- **Keys** are crucial for efficient reconciliation, especially in dynamic lists, as they help React identify which items changed, were added, or removed.
- React's **diffing algorithm** minimizes the number of DOM updates required, which improves performance.
- **PureComponent** can help optimize rendering by preventing unnecessary re-renders.

By understanding and leveraging the reconciliation process, React can efficiently update the UI and optimize performance, even for large or frequently changing applications.

# React Fiber Reconciliation Explained with Examples

## What is Reconciliation?

Reconciliation is React's process of comparing:

```text
Previous UI Tree
        VS
Next UI Tree
```

and finding the minimum set of changes needed to update the DOM efficiently.

React Fiber is the reconciliation engine that enables this process while supporting interruptible rendering, priority lanes, and concurrent features. React processes work using Fiber nodes, a Work-In-Progress tree, and Commit phases. 【1-984537】【2-171f38】【3-fe4ec0】

---

# Example 1: Text Update

## Previous Render

```jsx
function App() {
  return <h1>Hello</h1>;
}
```

Virtual Tree:

```text
App
 └── h1
      └── "Hello"
```

---

## Next Render

```jsx
function App() {
  return <h1>Welcome</h1>;
}
```

New Tree:

```text
App
 └── h1
      └── "Welcome"
```

---

## Reconciliation Result

React sees:

```text
Same Element Type
h1 === h1
```

Therefore:

```text
Reuse Existing DOM Node
```

Only update:

```text
Text Content
```

DOM Work:

```html
<h1>Hello</h1>

↓

<h1>Welcome</h1>
```

No node recreation.

---

# Example 2: Different Element Types

## Previous

```jsx
<div>Hello</div>
```

## Next

```jsx
<span>Hello</span>
```

React sees:

```text
div ≠ span
```

Result:

```text
Delete old subtree
Create new subtree
```

DOM Operations:

```text
Delete <div>
Create <span>
```

State is lost because React treats it as a completely different tree.

---

# Example 3: Component Update

## Previous

```jsx
<UserCard name="Sudhir" />
```

## Next

```jsx
<UserCard name="John" />
```

React sees:

```text
Same Component Type
UserCard === UserCard
```

Result:

```text
Reuse Fiber
Reuse Component Instance
Update Props
```

Only affected children are re-rendered.

---

# Example 4: List Reconciliation Without Keys

## Previous

```jsx
["A", "B", "C"];
```

Rendered:

```jsx
<li>A</li>
<li>B</li>
<li>C</li>
```

---

## Next

```jsx
["X", "A", "B", "C"];
```

React compares position-by-position:

```text
A → X
B → A
C → B
Add C
```

Result:

```text
4 updates
```

Expensive.

---

# Example 5: List Reconciliation With Keys

```jsx
{
  items.map((item) => <Item key={item.id} item={item} />);
}
```

Previous:

```text
1:A
2:B
3:C
```

Next:

```text
4:X
1:A
2:B
3:C
```

React recognises:

```text
1 already exists
2 already exists
3 already exists
```

Only:

```text
Insert 4
```

This preserves:

```text
Component State
Input Focus
DOM Nodes
```

---

# How Fiber Actually Performs Reconciliation

## Step 1: Update Scheduled

```js
setState(...)
```

Creates:

```text
Update Object
```

assigned to a Lane.

---

## Step 2: Create Work-In-Progress Tree

React maintains two trees:

```text
Current Tree
```

Currently visible.

```text
Work-In-Progress Tree
```

Being built. 【1-984537】【4-1922c5】

---

## Step 3: beginWork()

React walks down the tree.

Example:

```text
App
├── Header
└── Main
     ├── Sidebar
     └── List
```

Checks:

```text
Props Changed?
State Changed?
Context Changed?
```

Determines what needs updating.

---

## Step 4: Reconciliation Decisions

For each Fiber:

```text
Update
Reuse
Insert
Delete
Move
```

React marks the Fiber with flags.

Common flags:

```text
Placement
Update
Deletion
```

These flags tell Commit Phase what to do later. 【1-984537】

---

## Step 5: completeWork()

React traverses back upward.

```text
Collect Effects
Build Effect List
Bubble Flags Up
```

No DOM changes happen yet.

---

## Step 6: Commit Phase

React executes:

```text
Deletion
Placement
Update
```

against the real DOM.

Only now does the screen change. The Commit Phase applies DOM changes synchronously. 【1-984537】【4-1922c5】【3-fe4ec0】

---

# React.memo and Reconciliation

```jsx
const UserCard = React.memo(function UserCard(props) {
  return <div>{props.name}</div>;
});
```

---

Parent Updates:

```jsx
setCounter((c) => c + 1);
```

Props:

```text
name = "Sudhir"
```

unchanged.

React sees:

```text
Previous Props === Next Props
```

Result:

```text
Skip Child Reconciliation
Skip Entire Subtree
```

Huge performance gain.

---

# Reconciliation and Lanes

Consider:

```jsx
setInputValue("r");

startTransition(() => {
  setResults(bigList);
});
```

React assigns:

```text
Input
↓
SyncLane

Search Results
↓
TransitionLane
```

During reconciliation:

```text
High Priority Work First
```

The input update can interrupt the search-results render and run immediately. Priority lanes enable React to process urgent work before lower-priority rendering. 【2-171f38】【3-fe4ec0】

---

# Senior Interview Example

```jsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Sidebar />
      <Counter count={count} />
    </>
  );
}
```

User clicks:

```jsx
setCount(count + 1);
```

React reconciles:

```text
App
↓
Counter needs update

Header unchanged
Sidebar unchanged
```

Result:

```text
Reuse Header Fiber
Reuse Sidebar Fiber
Update Counter Fiber
```

Minimal work.

---

# Most Common Interview Question

## Why Doesn't React Re-render the Entire DOM?

Because reconciliation determines:

```text
What changed
```

and Fiber allows React to:

```text
Reuse Existing Nodes
Skip Clean Subtrees
Prioritise Work
Interrupt Rendering
```

instead of rebuilding everything.

---

# One-Line Interview Answer

```text
React Fiber reconciliation compares the current Fiber tree with a Work-In-Progress tree, determines the minimal set of insertions, updates, deletions, or moves, records those operations as effects during the Render Phase, and then applies them to the DOM during the Commit Phase. Keys, React.memo, and lanes help React minimise work and prioritise updates efficiently.
```

React Fiber Reconciliation with Key-Based List Updates
Why Keys Matter

When React renders a list, reconciliation must determine:

Old List
↓
New List
↓
Which items were:

- Added?
- Removed?
- Moved?
- Updated?

Without keys, React primarily compares items by position.

With keys, React compares items by identity. This allows React to reuse existing Fibers and DOM nodes instead of recreating them. During reconciliation, React builds a Work-In-Progress tree, compares it with the Current tree, and decides whether to reuse, update, insert, move, or delete Fibers.

Example 1: List Without Keys
Initial Render
function TodoList() {
return (
<>
<Todo text="A" />
<Todo text="B" />
<Todo text="C" />
</>
);
}

React sees:

Index 0 → A
Index 1 → B
Index 2 → C

New Render
function TodoList() {
return (
<>
<Todo text="X" />
<Todo text="A" />
<Todo text="B" />
<Todo text="C" />
</>
);
}

React compares by position:

A → X
B → A
C → B
Add C

React thinks:

Update Item 0
Update Item 1
Update Item 2
Insert Item 3

Result:

More work
More DOM updates
Possible state issues

Example 2: List With Keys
Initial Render
const todos = [
{ id: 1, text: "A" },
{ id: 2, text: "B" },
{ id: 3, text: "C" },
];

return todos.map(todo => (
<Todo
    key={todo.id}
    text={todo.text}
  />
));

Fiber Tree:

key=1 → A
key=2 → B
key=3 → C

New Render
const todos = [
{ id: 4, text: "X" },
{ id: 1, text: "A" },
{ id: 2, text: "B" },
{ id: 3, text: "C" },
];

New Tree:

key=4 → X
key=1 → A
key=2 → B
key=3 → C

React matches by key:

1 exists
2 exists
3 exists

Only:

Insert key=4

All other Fibers are reused.

Result:

✅ Less DOM work
✅ State preserved
✅ Better performance

How Fiber Handles This Internally
Old Fiber Tree
App
└── List
├── Fiber(key=1)
├── Fiber(key=2)
└── Fiber(key=3)

New Elements
key=4
key=1
key=2
key=3

React creates a lookup:

{
1: Fiber1,
2: Fiber2,
3: Fiber3
}

Then processes the new list:

key=4 → New Fiber (Placement)

key=1 → Reuse Fiber1

key=2 → Reuse Fiber2

key=3 → Reuse Fiber3

React marks effects such as Placement, Update, and Deletion during reconciliation and applies them later during the Commit Phase.

State Preservation Example
Bad Key
{
users.map((user, index) => (
<Input
      key={index}
      value={user.name}
    />
));
}

Suppose:

0 → John
1 → Mike
2 → Peter

Insert:

0 → David
1 → John
2 → Mike
3 → Peter

React reuses by index:

Input State Mixed Up
Focus Jumps
Cursor Position Lost

Good Key
{
users.map(user => (
<Input
      key={user.id}
      value={user.name}
    />
));
}

Now React matches:

User ID

instead of position.

Benefits:

Correct state preservation
Stable focus
Stable DOM nodes

Reordering Example
Old List
1:A
2:B
3:C

New List
3:C
1:A
2:B

React sees:

key=3 exists
key=1 exists
key=2 exists

Result:

Move Existing Fibers

instead of:

Delete Everything
Recreate Everything

Real Interview Question
Why Not Use Array Index as Key?

Bad:

key={index}

Because:

Index changes when:

- Inserting
- Deleting
- Sorting
- Filtering

React loses identity information.

Result:

Incorrect state
Extra renders
Focus issues
Animation glitches

Teams / Chat App Example

Messages:

{
messages.map(message => (
<Message
      key={message.id}
      message={message}
    />
));
}

New message arrives:

m1
m2
m3
m4

React only creates:

Fiber(m4)

and reuses:

Fiber(m1)
Fiber(m2)
Fiber(m3)

This is critical for high-performance applications such as Teams, Slack, and chat systems because only the new message requires DOM work.

Interview Answer
During Fiber reconciliation, React compares the Current tree with a Work-In-Progress tree. For lists, keys provide stable identity. Instead of matching items by position, React matches them by key, allowing existing Fibers, DOM nodes, and component state to be reused. When a new item is inserted, moved, or removed, React generates Placement, Update, or Deletion effects only for the affected items, resulting in minimal DOM work and better performance.

Sources: React Fiber uses Work-In-Progress trees, effect flags (Placement/Update/Deletion), reconciliation, and priority-based rendering to minimise DOM updates.

# React Reconciliation Without Keys

## How React Matches List Items Without Keys

When keys are missing:

```jsx
{
  items.map((item) => <Row value={item} />);
}
```

React falls back to:

```text
Position-Based Matching
```

instead of:

```text
Identity-Based Matching
```

---

## Initial Render

```jsx
["A", "B", "C"];
```

Tree:

```text
Index 0 → A
Index 1 → B
Index 2 → C
```

---

## Insert New Item At Beginning

```jsx
["X", "A", "B", "C"];
```

React compares:

```text
Old[0] = A
New[0] = X
```

React assumes:

```text
A changed to X
```

Then:

```text
Old[1] = B
New[1] = A

B changed to A
```

Then:

```text
Old[2] = C
New[2] = B

C changed to B
```

Finally:

```text
Insert C
```

Result:

```text
Update Row 0
Update Row 1
Update Row 2
Insert Row 3
```

Much more work than necessary.

---

## Problem With State

Imagine:

```jsx
[<Input value="John" />, <Input value="Mike" />, <Input value="Peter" />];
```

User types into:

```text
Mike's Input
```

Then new item inserted at top.

Without keys:

```text
State shifts positions
```

Possible issues:

```text
Lost Cursor Position
Lost Focus
Wrong Input Values
Broken Animations
```

React interview material in enterprise learning content specifically calls out using index as a key in dynamic lists as a scenario to discuss carefully. 【1-dcc6f2】

---

# React Reconciliation With React.memo

## Normal Behaviour

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Child />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}
```

When Parent renders:

```text
Parent Render
     ↓
Child Render
```

Even if Child props didn't change.

---

## Adding React.memo

```jsx
const Child = React.memo(function Child() {
  console.log("Child Render");

  return <div>Child</div>;
});
```

Now:

```text
Parent Render
       ↓
Props Changed?
       ↓
No
       ↓
Skip Child
```

React.memo is commonly used to prevent unnecessary child re-renders when props remain unchanged. This is also mentioned in enterprise interview evaluation material discussing React performance optimisation. 【2-f664f2】【3-4072e7】

---

## Example 1: Child Re-render Prevented

```jsx
const UserCard = React.memo(function UserCard({ name }) {
  console.log("render");

  return <h1>{name}</h1>;
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserCard name="Sudhir" />

      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </>
  );
}
```

Button clicked:

```text
Parent Render
```

React checks:

```text
Previous Props
name = "Sudhir"

Next Props
name = "Sudhir"
```

Result:

```text
Skip UserCard Reconciliation
```

---

## Example 2: Props Changed

```jsx
<UserCard name={userName} />
```

Previous:

```text
Sudhir
```

Next:

```text
John
```

React sees:

```text
Props Changed
```

Result:

```text
Render UserCard
Reconcile UserCard Subtree
Commit Updates
```

---

## Example 3: Entire Subtree Skipped

```jsx
const Dashboard = React.memo(function Dashboard() {
  return (
    <>
      <Chart />
      <Table />
      <Filters />
    </>
  );
});
```

Props unchanged:

```text
Dashboard
  ├── Chart
  ├── Table
  └── Filters
```

React skips:

```text
Dashboard
Chart
Table
Filters
```

Entire subtree avoided.

This is why React.memo can be powerful for expensive trees. Enterprise React interview discussions describe React.memo as preventing unnecessary child renders when props are unchanged. 【2-f664f2】【3-4072e7】

---

# React Reconciliation Phases

React's reconciler (Fiber) performs rendering incrementally and then applies DOM changes during Commit. The enterprise React codebase summary describes the reconciler as having a work loop, begin phase, complete phase, and commit phase. 【4-985acd】

---

## Phase 1: Schedule Update

```jsx
setState(...)
```

Creates:

```text
Update Object
```

Scheduler assigns a priority lane.

---

## Phase 2: Render Phase (Reconciliation)

React builds:

```text
Current Tree
       VS
Work-In-Progress Tree
```

This phase:

```text
✅ Can Pause
✅ Can Resume
✅ Can Restart
✅ Can Be Interrupted
```

Fiber architecture supports incremental rendering, pause, abort, reuse, and concurrent rendering. 【4-985acd】【5-233537】

---

### beginWork()

React traverses downward.

Checks:

```text
Props
State
Context
```

Determines:

```text
Reuse?
Update?
Insert?
Delete?
```

---

### completeWork()

React traverses upward.

Builds:

```text
Effect List
Placement Flags
Update Flags
Deletion Flags
```

Effect flags are later used by Commit Phase. 【6-2a9397】

---

## Phase 3: Commit Phase

Cannot be interrupted.

```text
1. Before Mutation
2. Mutation
3. Layout
```

The reconciler documentation in enterprise files describes the Commit Phase as applying DOM changes synchronously. 【4-985acd】【6-2a9397】

---

### Before Mutation

```text
Read DOM
Capture Snapshot
```

Used by:

```js
getSnapshotBeforeUpdate();
```

---

### Mutation Phase

Actual DOM work:

```text
Delete Nodes
Insert Nodes
Update Nodes
```

---

### Layout Phase

React:

```text
Attach Refs
Run useLayoutEffect
```

---

### Browser Paint

```text
User sees UI
```

---

### Passive Effects

```jsx
useEffect();
```

runs after paint.

---

# Complete Flow

```text
setState()
    ↓
Schedule Update
    ↓
Render Phase
    ↓
beginWork()
    ↓
completeWork()
    ↓
Build Effect List
    ↓
Commit Phase
    ↓
Before Mutation
    ↓
Mutation
    ↓
Layout Effects
    ↓
Paint
    ↓
useEffect
```

# 30-Second Interview Answer

```text
Without keys, React reconciles lists by position, which can cause unnecessary updates and state mismatches when items are inserted, removed, or reordered. React.memo optimises reconciliation by performing a shallow prop comparison and skipping entire component subtrees when props haven't changed. Reconciliation itself consists of a Render Phase, where React builds a Work-In-Progress Fiber tree and computes effects, followed by a synchronous Commit Phase that applies DOM mutations, attaches refs, runs useLayoutEffect, paints the UI, and finally executes useEffect.
```
