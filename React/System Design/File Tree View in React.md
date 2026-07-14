# File Tree View in React

## System Design + Complete Working Code

This is one of the **most asked React interview questions**, especially at the Senior Developer level.

Examples of real systems that use this pattern:

```txt
VS Code
Google Drive
Notion
GitHub
Windows Explorer
Figma
Slack Channels
```

---

# Requirements

✅ Recursive folder + file structure

✅ Add Folder / Add File

✅ Rename Node

✅ Delete Node

✅ Expand / Collapse Folder

✅ Nested Support (infinite depth)

✅ Reusable Component

✅ Optional: Drag & Drop, Icons, Search

---

# 1. Data Structure

```js
{
  id: "1",
  name: "root",
  type: "folder",
  children: [
    {
      id: "2",
      name: "public",
      type: "folder",
      children: []
    },
    {
      id: "3",
      name: "index.js",
      type: "file"
    }
  ]
}
```

Each node has:

```txt
id
name
type  → "folder" | "file"
children (only for folders)
```

---

# 2. Component Structure

```txt
App
│
└── FileTree
     │
     └── FileNode
           │
           ├── Folder
           │    ├── Toggle
           │    ├── Name
           │    └── FileNode (recursive)
           │
           └── File
                └── Name
```

---

# 3. System Design Flow

```txt
Root Structure
      │
      ▼
FileTree (renders root node)
      │
      ▼
FileNode
   ├── If folder → render children
   ├── If file → render as leaf
   ├── Add File
   ├── Add Folder
   ├── Rename
   └── Delete
```

---

# 4. Full Code

## App.jsx

```jsx
import { useState } from "react";
import FileNode from "./FileNode";
import "./styles.css";

const initialData = {
  id: "root",
  name: "my-project",
  type: "folder",
  children: [
    {
      id: "public",
      name: "public",
      type: "folder",
      children: [],
    },
    {
      id: "src",
      name: "src",
      type: "folder",
      children: [
        {
          id: "index.js",
          name: "index.js",
          type: "file",
        },
        {
          id: "app.js",
          name: "App.js",
          type: "file",
        },
      ],
    },
  ],
};

export default function App() {
  const [tree, setTree] = useState(initialData);

  return (
    <div className="container">
      <h1>File Tree View</h1>

      <FileNode node={tree} setTree={setTree} parent={null} />
    </div>
  );
}
```

---

## FileNode.jsx (Recursive Component)

```jsx
import { useState } from "react";

export default function FileNode({ node, setTree, parent }) {
  const [isOpen, setIsOpen] = useState(true);

  const [renaming, setRenaming] = useState(false);

  const [newName, setNewName] = useState(node.name);

  const isFolder = node.type === "folder";

  // Add File / Folder
  function handleAdd(type) {
    const name = prompt(`Enter ${type} name`);

    if (!name) return;

    const newNode = {
      id: Date.now().toString(),
      name,
      type,
      ...(type === "folder" ? { children: [] } : {}),
    };

    setTree((prevTree) =>
      updateNode(prevTree, node.id, (target) => ({
        ...target,
        children: [...(target.children || []), newNode],
      })),
    );

    setIsOpen(true);
  }

  // Rename Node
  function handleRename() {
    setTree((prevTree) =>
      updateNode(prevTree, node.id, (target) => ({
        ...target,
        name: newName,
      })),
    );

    setRenaming(false);
  }

  // Delete Node
  function handleDelete() {
    if (!parent) {
      alert("Cannot delete root");
      return;
    }

    setTree((prevTree) => deleteNode(prevTree, node.id));
  }

  return (
    <div
      className="tree-node"
      style={{
        marginLeft: parent ? 20 : 0,
      }}
    >
      <div className="node-row">
        {isFolder ? (
          <button className="toggle" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? "▼" : "▶"}
          </button>
        ) : (
          <span className="dot">•</span>
        )}

        {renaming ? (
          <>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <button onClick={handleRename}>Save</button>
          </>
        ) : (
          <span
            className={isFolder ? "folder-name" : "file-name"}
            onDoubleClick={() => setRenaming(true)}
          >
            {isFolder ? "📁 " : "📄 "}
            {node.name}
          </span>
        )}

        <div className="actions">
          {isFolder && (
            <>
              <button onClick={() => handleAdd("file")}>+ File</button>

              <button onClick={() => handleAdd("folder")}>+ Folder</button>
            </>
          )}

          <button onClick={handleDelete}>✕</button>
        </div>
      </div>

      {isOpen &&
        isFolder &&
        node.children?.map((child) => (
          <FileNode
            key={child.id}
            node={child}
            setTree={setTree}
            parent={node}
          />
        ))}
    </div>
  );
}
```

---

## Utility Functions

Place inside `FileNode.jsx` or a helper file.

```js
export function updateNode(currentNode, targetId, updater) {
  if (currentNode.id === targetId) {
    return updater(currentNode);
  }

  if (!currentNode.children) return currentNode;

  return {
    ...currentNode,
    children: currentNode.children.map((child) =>
      updateNode(child, targetId, updater),
    ),
  };
}

export function deleteNode(currentNode, targetId) {
  if (!currentNode.children) return currentNode;

  return {
    ...currentNode,
    children: currentNode.children
      .filter((child) => child.id !== targetId)
      .map((child) => deleteNode(child, targetId)),
  };
}
```

---

## styles.css

```css
.container {
  width: 500px;
  margin: 20px auto;

  padding: 16px;
  background: #f9fafb;

  border-radius: 8px;
  border: 1px solid #ddd;
}

.tree-node {
  margin: 4px 0;
}

.node-row {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 6px;

  border-radius: 4px;

  transition: background 0.2s;
}

.node-row:hover {
  background: #e5e7eb;
}

.toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.dot {
  width: 12px;
  color: #6b7280;
}

.folder-name {
  font-weight: 600;
  cursor: pointer;
}

.file-name {
  cursor: pointer;
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.actions button {
  background: transparent;
  border: 1px solid #ddd;

  border-radius: 4px;

  cursor: pointer;

  padding: 2px 6px;
  font-size: 12px;
}

.actions button:hover {
  background: #f3f4f6;
}
```

---

# 5. How It Works

## Add File

```txt
Click "+ File"
      ↓
Prompt Name
      ↓
Create Node
      ↓
Append to children[]
      ↓
Render Tree
```

---

## Add Folder

Same as above but:

```txt
type: "folder"
children: []
```

---

## Rename

```txt
Double Click Name
      ↓
Show Input
      ↓
Update Node
```

---

## Delete

```txt
Click ✕
      ↓
Recursive Filter
      ↓
Remove Node
```

---

## Expand / Collapse

```txt
Click ▶ or ▼
      ↓
Toggle isOpen
      ↓
Show/Hide Children
```

---

# 6. Recursive Data Update Diagram

```txt
Root
├── Src
│   ├── App.js  ✕ Delete
│   └── Index.js
└── Public
```

Deleting `App.js`:

Recursively traverse tree.

Filter children where `id === "App.js"`.

Return new immutable tree.

---

# 7. Extensions For Senior Interview

## ✅ Drag and Drop

Use:

```txt
dnd-kit
```

---

## ✅ Search

Filter nodes:

```txt
Match Name
Highlight
Auto-Expand Path
```

---

## ✅ Icons

Use:

```txt
Lucide
React Icons
```

---

## ✅ Context Menu

Right-click:

```txt
Rename
Delete
Duplicate
Copy Path
```

---

## ✅ Virtualization

For huge trees:

```txt
react-window
```

Render only visible rows.

---

## ✅ Persistence

Save to:

```txt
LocalStorage
IndexedDB
Backend API
```

---

## ✅ Multiple Selection

Ctrl + Click / Shift + Click.

---

# 8. Complexity Analysis

## Add / Rename / Delete

Traverse tree:

```txt
O(n)
```

Where:

```txt
n = number of nodes
```

## Render

```txt
O(n)
```

---

# 9. Senior React Interview Answer

> I would model the file tree as a recursive JSON object where each folder contains a `children` array. Since the structure is recursive, I would build a `FileNode` component that renders itself for its children. All updates (add, rename, delete) are done immutably using recursive helper functions like `updateNode` and `deleteNode`. This design supports unlimited nesting depth, easy state management, and predictable rendering. For production, I would add drag-and-drop using `dnd-kit`, virtualization using `react-window`, and backend persistence with an API. This mirrors real-world implementations used in VS Code, Notion, GitHub, and Google Drive.

# File Tree in React – Advanced Features

### Search + Filter + Persistence in localStorage

These are the **two most common Senior React interview follow-ups** after implementing a basic recursive file tree.

Real applications like **VS Code, Notion, Google Drive, and GitHub** implement both.

---

# 1. Search + Filter in Nested File Tree

## Problem

Filter nested tree:

```txt
my-project
├── public
├── src
│   ├── App.js
│   ├── index.js
│   └── components
│       ├── Button.js
│       └── Card.js
```

User types:

```txt
button
```

Result:

```txt
my-project
└── src
    └── components
        └── Button.js
```

We must:

✅ Match nodes by name

✅ Preserve entire parent path

✅ Auto-expand matched folders

✅ Highlight matched text

---

## 2. Recursive Filter Function

```js
export function filterTree(node, query) {
  if (!query.trim()) return node;

  const lowerQuery = query.toLowerCase();

  // File node
  if (node.type === "file") {
    return node.name.toLowerCase().includes(lowerQuery) ? node : null;
  }

  // Folder node
  const filteredChildren = (node.children || [])
    .map((child) => filterTree(child, query))
    .filter(Boolean);

  const folderMatches = node.name.toLowerCase().includes(lowerQuery);

  if (filteredChildren.length || folderMatches) {
    return {
      ...node,
      children: filteredChildren,
    };
  }

  return null;
}
```

---

## Explanation

### File Case

```txt
File name matches?
      ↓
   Return node
```

---

### Folder Case

```txt
Recursively filter children
      ↓
Any child matched?
      ↓
Keep folder + matched children
```

---

### Example

Tree:

```txt
src
├── components
│   ├── Button.js
│   ├── Card.js
```

Query:

```txt
btn
```

Output:

```txt
Nothing
```

Query:

```txt
Btn
```

or

```txt
Button
```

Output:

```txt
src
└── components
    └── Button.js
```

---

## 3. Add Search Bar

```jsx
const [search, setSearch] = useState("");

const filteredTree = useMemo(() => filterTree(tree, search), [tree, search]);
```

---

## 4. Render Filtered Tree

```jsx
<input
  type="text"
  value={search}
  placeholder="Search files..."
  onChange={(e) => setSearch(e.target.value)}
/>;

{
  filteredTree ? (
    <FileNode node={filteredTree} setTree={setTree} parent={null} />
  ) : (
    <p>No results</p>
  );
}
```

---

## 5. Auto-Expand Matched Folders

Inside `FileNode`, force expansion when filtering:

```jsx
const [isOpen, setIsOpen] = useState(true);
```

Auto-expand when search is active:

```jsx
useEffect(() => {
  if (search) {
    setIsOpen(true);
  }
}, [search]);
```

---

## 6. Highlight Match

```jsx
function highlightMatch(name, query) {
  if (!query) return name;

  const index = name.toLowerCase().indexOf(query.toLowerCase());

  if (index === -1) return name;

  return (
    <>
      {name.slice(0, index)}
      <mark>{name.slice(index, index + query.length)}</mark>
      {name.slice(index + query.length)}
    </>
  );
}
```

---

Use like:

```jsx
{
  highlightMatch(node.name, search);
}
```

---

## 7. UI Effect

Query:

```txt
button
```

Result:

```txt
src
└── components
    └── 📄 **Button**.js
```

Only relevant nodes appear.

---

# 8. Optimization: Debounce Search

For large trees:

```jsx
const debouncedSearch = useDebounce(search, 300);
```

Then use debouncedSearch inside `filterTree`.

Avoids expensive recalculations.

---

# 9. Persist Tree in LocalStorage

Chats, notes, or file trees should never disappear on refresh.

---

## Save Tree

```jsx
useEffect(() => {
  localStorage.setItem("file-tree", JSON.stringify(tree));
}, [tree]);
```

---

## Load Tree on Mount

```jsx
const [tree, setTree] = useState(() => {
  const saved = localStorage.getItem("file-tree");

  return saved ? JSON.parse(saved) : initialData;
});
```

---

## Behaviour

```txt
User Adds Folder
      ↓
State Updates
      ↓
useEffect Fires
      ↓
localStorage Updated

Page Refresh
      ↓
Load Existing Tree
      ↓
Restore File System
```

---

## Handle Storage Errors

```jsx
try {
  localStorage.setItem("file-tree", JSON.stringify(tree));
} catch (error) {
  console.warn("Storage limit exceeded");
}
```

---

## Add Reset Button

```jsx
function resetTree() {
  setTree(initialData);

  localStorage.removeItem("file-tree");
}
```

---

## Add Versioning (Optional)

Store structured metadata:

```js
{
  version: 1,
  updatedAt: Date.now(),
  data: tree
}
```

Useful when schema changes.

Example:

```js
localStorage.setItem(
  "file-tree",
  JSON.stringify({
    version: 2,
    data: tree,
  }),
);
```

---

## Persist Only Necessary Data

Do NOT store UI state (like `isOpen`).

Only store:

```txt
id
name
type
children
```

Keeps localStorage clean.

---

# 10. Full Feature Diagram

```txt
User Types → search state
      ↓
Debounce → 300ms
      ↓
Filter Tree (Recursive)
      ↓
Highlight Match
      ↓
Auto Expand Folders
      ↓
Render UI
      ↓
Persist Tree
      ↓
localStorage
```

---

# 11. Interview-Level Optimizations

✅ Memoize filtered tree using `useMemo`

✅ Debounce search input

✅ Virtualize huge trees using `react-window`

✅ Use IndexedDB for large data

✅ Save to API (multi-device sync)

✅ Undo/Redo history

✅ Rename via keyboard (F2)

✅ Cut/Paste behaviour

✅ Recursive delete confirmation

---

# 12. Senior React Interview Answer

> For search, I use a recursive function that returns a filtered version of the tree — including matched files and any parent folders leading to them. Folders auto-expand when a search is active, and matched substrings are highlighted using a helper function. I optimize the pipeline using `useMemo` and debounced input for large trees. For persistence, I hydrate the initial state from `localStorage`, and save updates using a `useEffect` hook. To avoid storing volatile UI state, only the pure tree structure is persisted. For production, I would optionally use IndexedDB for large data or an API-driven backend for multi-device sync — this mirrors the design used in VS Code, Notion, and Google Drive.
