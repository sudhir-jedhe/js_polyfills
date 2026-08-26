*** copy File Explorer.md ***

## Accessible File Explorer Component in React

An accessible file explorer must follow the **WAI-ARIA Treeview Pattern** (`role="tree"`, `role="treeitem"`, and `role="group"`), handle roving `tabIndex`, and support standard keyboard interactions (Arrow keys, Home, End, Enter, Space, and typing letters to focus).

---

### Key ARIA & Accessibility Requirements

* **`role="tree"`**: Placed on the root list container.
* **`role="treeitem"`**: Placed on each selectable node (folder or file).
* **`role="group"`**: Placed on the sub-list container containing children of a folder.
* **`aria-expanded="true|false"`**: Applied strictly to parent nodes (folders) to convey their open/closed state to screen readers.
* **`aria-selected="true|false"`**: Indicates the active/focused item.
* **Roving `tabIndex**`: Only the currently focused node has `tabIndex={0}`; all other items have `tabIndex={-1}` so that Tab moves focus in and out of the widget as a single control.

---

### Implementation

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

export interface FileNode {
  id: string;
  name: string;
  isFolder?: boolean;
  children?: FileNode[];
}

const initialFiles: FileNode[] = [
  {
    id: "src",
    name: "src",
    isFolder: true,
    children: [
      {
        id: "components",
        name: "components",
        isFolder: true,
        children: [
          { id: "Button.tsx", name: "Button.tsx" },
          { id: "Modal.tsx", name: "Modal.tsx" },
        ],
      },
      { id: "App.tsx", name: "App.tsx" },
      { id: "index.tsx", name: "index.tsx" },
    ],
  },
  {
    id: "public",
    name: "public",
    isFolder: true,
    children: [{ id: "favicon.ico", name: "favicon.ico" }],
  },
  { id: "package.json", name: "package.json" },
  { id: "tsconfig.json", name: "tsconfig.json" },
];

export const FileExplorer: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    src: true,
  });
  const [focusedId, setFocusedId] = useState<string>("src");
  const [selectedId, setSelectedId] = useState<string>("src");
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  // Flatten visible nodes to calculate linear keyboard navigation
  const getVisibleNodes = (): FileNode[] => {
    const visible: FileNode[] = [];
    const traverse = (nodes: FileNode[]) => {
      for (const node of nodes) {
        visible.push(node);
        if (node.isFolder && expanded[node.id] && node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(initialFiles);
    return visible;
  };

  const toggleFolder = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    itemRefs.current[focusedId]?.focus();
  }, [focusedId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const visibleNodes = getVisibleNodes();
    const currentIndex = visibleNodes.findIndex((n) => n.id === focusedId);
    const currentNode = visibleNodes[currentIndex];

    if (!currentNode) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (currentIndex < visibleNodes.length - 1) {
          setFocusedId(visibleNodes[currentIndex + 1].id);
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (currentIndex > 0) {
          setFocusedId(visibleNodes[currentIndex - 1].id);
        }
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (currentNode.isFolder) {
          if (!expanded[currentNode.id]) {
            toggleFolder(currentNode.id);
          } else if (currentNode.children && currentNode.children.length > 0) {
            setFocusedId(currentNode.children[0].id);
          }
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (currentNode.isFolder && expanded[currentNode.id]) {
          toggleFolder(currentNode.id);
        } else {
          // Move focus to parent folder if inside a subfolder
          const parent = findParentNode(initialFiles, currentNode.id);
          if (parent) setFocusedId(parent.id);
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        if (visibleNodes.length > 0) setFocusedId(visibleNodes[0].id);
        break;
      }
      case "End": {
        e.preventDefault();
        if (visibleNodes.length > 0) {
          setFocusedId(visibleNodes[visibleNodes.length - 1].id);
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        setSelectedId(currentNode.id);
        if (currentNode.isFolder) toggleFolder(currentNode.id);
        break;
      }
      default: {
        // Character search navigation
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase();
          const match = visibleNodes
            .slice(currentIndex + 1)
            .concat(visibleNodes.slice(0, currentIndex))
            .find((n) => n.name.toLowerCase().startsWith(char));
          if (match) setFocusedId(match.id);
        }
        break;
      }
    }
  };

  const findParentNode = (nodes: FileNode[], targetId: string): FileNode | null => {
    for (const node of nodes) {
      if (node.children?.some((child) => child.id === targetId)) return node;
      if (node.children) {
        const found = findParentNode(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const renderTree = (nodes: FileNode[], level = 1) => {
    return nodes.map((node) => {
      const isExpanded = !!expanded[node.id];
      const isFocused = focusedId === node.id;
      const isSelected = selectedId === node.id;

      return (
        <li
          key={node.id}
          role="treeitem"
          aria-level={level}
          aria-expanded={node.isFolder ? isExpanded : undefined}
          aria-selected={isSelected}
          tabIndex={isFocused ? 0 : -1}
          ref={(el) => (itemRefs.current[node.id] = el)}
          onClick={(e) => {
            e.stopPropagation();
            setFocusedId(node.id);
            setSelectedId(node.id);
            if (node.isFolder) toggleFolder(node.id);
          }}
          style={{
            paddingLeft: `${level * 16}px`,
            paddingTop: "4px",
            paddingBottom: "4px",
            cursor: "pointer",
            outline: isFocused ? "2px solid #3b82f6" : "none",
            backgroundColor: isSelected ? "#e2e8f0" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            userSelect: "none",
            borderRadius: "4px",
          }}
        >
          <span>{node.isFolder ? (isExpanded ? "📂" : "📁") : "📄"}</span>
          <span>{node.name}</span>

          {node.isFolder && isExpanded && node.children && (
            <ul
              role="group"
              style={{ listStyle: "none", padding: 0, margin: 0, width: "100%" }}
            >
              {renderTree(node.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div style={{ width: "320px", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px" }}>
      <h3 id="treehead" style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
        Files & Directories
      </h3>
      <ul
        role="tree"
        aria-labelledby="treehead"
        onKeyDown={handleKeyDown}
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {renderTree(initialFiles)}
      </ul>
    </div>
  );
};

```

---

### Supported Keyboard Controls

| Key                  | Action                                                                        |
| -------------------- | ----------------------------------------------------------------------------- |
| **Down Arrow**       | Moves focus to the next visible node.                                         |
| **Up Arrow**         | Moves focus to the previous visible node.                                     |
| **Right Arrow**      | Opens an expandable folder; if already open, moves to its first child.        |
| **Left Arrow**       | Closes an open folder; if closed or a file, moves focus to its parent folder. |
| **Enter / Space**    | Selects the active file or toggles folder open/close state.                   |
| **Home / End**       | Jumps focus to the very first or last visible node in the entire tree.        |
| **Type-ahead (A–Z)** | Jumps focus to the next matching node starting with the typed letter.         |
