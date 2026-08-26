*** copy Searchable react tree view.md ***

A complete, searchable **Tree View (File/Folder Explorer)** in React featuring recursive rendering, text-search highlighting, auto-expanding ancestor folders when matches are found, and item selection.

---

### 1. Searchable Tree Component (`SearchableTree.jsx`)

```jsx
import React, { useState, useMemo } from 'react';

// Sample Recursive Folder/File Dataset
const INITIAL_TREE_DATA = [
  {
    id: '1',
    name: 'src',
    children: [
      {
        id: '2',
        name: 'components',
        children: [
          { id: '3', name: 'Button.jsx' },
          { id: '4', name: 'Navbar.jsx' },
          { id: '5', name: 'Modal.jsx' },
        ],
      },
      {
        id: '6',
        name: 'hooks',
        children: [
          { id: '7', name: 'useDebounce.js' },
          { id: '8', name: 'useLocalStorage.js' },
        ],
      },
      { id: '9', name: 'App.jsx' },
      { id: '10', name: 'index.js' },
    ],
  },
  {
    id: '11',
    name: 'public',
    children: [
      { id: '12', name: 'favicon.ico' },
      { id: '13', name: 'robots.txt' },
    ],
  },
  { id: '14', name: 'package.json' },
  { id: '15', name: 'README.md' },
];

// Highlight matching search tokens in text
function HighlightedText({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} style={styles.highlight}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

// Recursive Tree Node Component
function TreeNode({
  node,
  searchQuery,
  expandedIds,
  onToggle,
  selectedId,
  onSelect,
}) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(node.id);
    }
    onSelect(node);
  };

  return (
    <div style={styles.nodeWrapper}>
      <div
        onClick={handleClick}
        style={{
          ...styles.nodeRow,
          backgroundColor: isSelected ? '#e0e7ff' : 'transparent',
        }}
      >
        <span style={styles.icon}>
          {hasChildren ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>

        <span style={styles.label}>
          <HighlightedText text={node.name} query={searchQuery} />
        </span>
      </div>

      {/* Render children recursively if expanded */}
      {hasChildren && isExpanded && (
        <div style={styles.childrenContainer}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              searchQuery={searchQuery}
              expandedIds={expandedIds}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchableTree() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState(() => new Set(['1', '2']));
  const [selectedNode, setSelectedNode] = useState(null);

  // Filter tree recursively and gather ancestor IDs to auto-expand
  const { filteredTree, matchingAncestorIds } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return { filteredTree: INITIAL_TREE_DATA, matchingAncestorIds: new Set() };

    const matchingIds = new Set();

    function filterNodes(nodes) {
      return nodes
        .map((node) => {
          const isDirectMatch = node.name.toLowerCase().includes(q);
          let filteredChildren = [];

          if (node.children) {
            filteredChildren = filterNodes(node.children);
          }

          const hasMatchingChildren = filteredChildren.length > 0;

          if (isDirectMatch || hasMatchingChildren) {
            if (hasMatchingChildren) {
              matchingIds.add(node.id);
            }
            return {
              ...node,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    const filtered = filterNodes(INITIAL_TREE_DATA);
    return { filteredTree: filtered, matchingAncestorIds: matchingIds };
  }, [searchQuery]);

  // Combine manual toggles with auto-expanded search branches
  const currentExpandedIds = useMemo(() => {
    if (!searchQuery.trim()) return expandedIds;
    return new Set([...expandedIds, ...matchingAncestorIds]);
  }, [expandedIds, matchingAncestorIds, searchQuery]);

  const handleToggle = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Project Explorer</h3>

      {/* Search Input */}
      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search files or folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={styles.clearBtn}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tree View Body */}
      <div style={styles.treeContainer}>
        {filteredTree.length === 0 ? (
          <div style={styles.emptyNotice}>No matching files or directories found.</div>
        ) : (
          filteredTree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              searchQuery={searchQuery}
              expandedIds={currentExpandedIds}
              onToggle={handleToggle}
              selectedId={selectedNode?.id}
              onSelect={(n) => setSelectedNode(n)}
            />
          ))
        )}
      </div>

      {/* Footer Info */}
      <div style={styles.footer}>
        Selected: <strong>{selectedNode ? selectedNode.name : 'None'}</strong>
      </div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: '380px',
    margin: '30px auto',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#0f172a',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '1.1rem',
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: '16px',
  },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '8px 30px 8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.88rem',
    outline: 'none',
  },
  clearBtn: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  treeContainer: {
    maxHeight: '350px',
    overflowY: 'auto',
    border: '1px solid #f1f5f9',
    borderRadius: '6px',
    padding: '8px',
  },
  nodeWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  nodeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  icon: {
    fontSize: '1rem',
    lineHeight: 1,
  },
  label: {
    fontSize: '0.9rem',
    color: '#334155',
  },
  highlight: {
    backgroundColor: '#fef08a',
    color: '#854d0e',
    padding: '0 2px',
    borderRadius: '2px',
  },
  childrenContainer: {
    marginLeft: '18px',
    paddingLeft: '6px',
    borderLeft: '1px solid #e2e8f0',
  },
  emptyNotice: {
    padding: '16px',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  footer: {
    marginTop: '12px',
    fontSize: '0.8rem',
    color: '#64748b',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '8px',
  },
};

```

---

### Core Mechanics

* **Recursive Subtree Filtering:** The `filterNodes` function preserves non-matching parent folders if any of their nested children match the query, preventing branches from being chopped off.
* **Auto-Expansion via Set Union:** Matches collect parent IDs into `matchingAncestorIds`. During active search, `currentExpandedIds` combines manual user clicks with matched ancestor branches so results are immediately visible without manual folder expanding.
* **Non-Destructive Highlighting:** `HighlightedText` uses a case-insensitive regular expression split `RegExp('(' + query + ')', 'gi')` to wrap only the matched portion in a `<mark>` tag while preserving original casing.
