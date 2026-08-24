Here is a clean, production-ready architecture and implementation for a **Todo App** supporting full **CRUD** operations and task statuses: `Yet to Start`, `In Progress`, and `Completed`.

---

### 1. Data Model & State Schema

```typescript
export type TodoStatus = 'YET_TO_START' | 'IN_PROGRESS' | 'COMPLETED';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
  updatedAt: number;
}

```

---

### 2. State Management Hook (`useTodos.ts`)

Encapsulates CRUD logic and local persistence using `localStorage`:

```typescript
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app_todos_v1';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 1. CREATE
  const addTodo = (title: string, description: string = '') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status: 'YET_TO_START',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // 2. UPDATE (Content & Title)
  const updateTodo = (id: string, updates: Partial<Pick<Todo, 'title' | 'description'>>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t))
    );
  };

  // 3. UPDATE STATUS (Yet to Start -> In Progress -> Completed)
  const updateStatus = (id: string, nextStatus: TodoStatus) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus, updatedAt: Date.now() } : t))
    );
  };

  // 4. DELETE
  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return { todos, addTodo, updateTodo, updateStatus, deleteTodo };
}

```

---

### 3. Complete Kanban / List UI (React + Tailwind CSS)

This implementation provides:

* **Add form** with modal/inline inputs.
* **Inline editing** for existing items.
* **Status switcher** dropdown or direct progress toggle.
* **Filter tabs / columns** for easy viewing across the three states.

```tsx
import React, { useState } from 'react';
import { useTodos, Todo, TodoStatus } from './useTodos';

const STATUS_CONFIG: Record<TodoStatus, { label: string; badge: string; border: string }> = {
  YET_TO_START: {
    label: 'Yet to Start',
    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    border: 'border-zinc-800',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badge: 'bg-amber-950/60 text-amber-400 border-amber-800',
    border: 'border-amber-800/40',
  },
  COMPLETED: {
    label: 'Completed',
    badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
    border: 'border-emerald-800/40',
  },
};

export default function TodoApp() {
  const { todos, addTodo, updateTodo, updateStatus, deleteTodo } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<TodoStatus | 'ALL'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo(title, description);
    setTitle('');
    setDescription('');
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      updateTodo(id, { title: editTitle });
    }
    setEditingId(null);
  };

  const filteredTodos = todos.filter((t) => (filter === 'ALL' ? true : t.status === filter));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-4xl mx-auto font-sans">
      {/* App Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Board</h1>
          <p className="text-sm text-zinc-400">Manage tasks across progress states</p>
        </div>
        <div className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
          Total: {todos.length} | Done: {todos.filter((t) => t.status === 'COMPLETED').length}
        </div>
      </header>

      {/* 1. CREATE Task Form */}
      <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Description or notes (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-3">
        {(['ALL', 'YET_TO_START', 'IN_PROGRESS', 'COMPLETED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {tab === 'ALL' ? 'All Tasks' : STATUS_CONFIG[tab].label}
          </button>
        ))}
      </div>

      {/* 2, 3, 4. READ, UPDATE, DELETE List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">No tasks in this category.</div>
        ) : (
          filteredTodos.map((todo) => {
            const config = STATUS_CONFIG[todo.status];
            return (
              <div
                key={todo.id}
                className={`bg-zinc-900/90 border ${config.border} p-4 rounded-xl flex items-start justify-between gap-4 transition-all`}
              >
                {/* Left Section: Details / Inline Editing */}
                <div className="flex-1">
                  {editingId === todo.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        className="flex-1 bg-zinc-950 border border-zinc-700 px-2 py-1 text-sm rounded text-zinc-100 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="text-xs bg-zinc-800 px-2.5 py-1 rounded hover:bg-zinc-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            todo.status === 'COMPLETED' ? 'line-through text-zinc-500' : 'text-zinc-200'
                          }`}
                        >
                          {todo.title}
                        </span>
                        <button
                          onClick={() => startEdit(todo)}
                          className="text-[11px] text-zinc-500 hover:text-zinc-300"
                        >
                          Edit
                        </button>
                      </div>
                      {todo.description && (
                        <p className="text-xs text-zinc-400 mt-1">{todo.description}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Section: Status Selector & Actions */}
                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={todo.status}
                    onChange={(e) => updateStatus(todo.id, e.target.value as TodoStatus)}
                    className={`text-xs border px-2.5 py-1 rounded-md font-medium bg-zinc-950 cursor-pointer focus:outline-none ${config.badge}`}
                  >
                    <option value="YET_TO_START">Yet to Start</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-zinc-500 hover:text-red-400 text-sm transition-colors cursor-pointer px-1"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

```

---

### 4. Features Included

1. **Create (`addTodo`)**: Adds new items default-initialized to `YET_TO_START` with a unique ID and timestamps.
2. **Read (`filteredTodos`)**: Filterable by `All`, `Yet to Start`, `In Progress`, and `Completed`.
3. **Update (`updateTodo` & `updateStatus`)**:

* Inline text editing for task title and description.
* State machine dropdown transition across all three valid lifecycle phases.

1. **Delete (`deleteTodo`)**: Fast single-click removal by ID.
2. **Persistence**: Backed by `localStorage` for instant offline state persistence across reloads.

Convert this Todo app into a 3-column drag-and-drop Kanban board with HTML5 drag and drop.

Here is the complete **3-column Kanban Board** implementation using native HTML5 Drag and Drop API (`onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`) with zero third-party drag-and-drop dependencies.

---

### Complete Component (`KanbanBoard.tsx`)

```tsx
import React, { useState, useEffect } from 'react';

export type TodoStatus = 'YET_TO_START' | 'IN_PROGRESS' | 'COMPLETED';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'kanban_todos_v2';

const COLUMNS: { id: TodoStatus; title: string; accent: string; dropBg: string }[] = [
  {
    id: 'YET_TO_START',
    title: 'Yet to Start',
    accent: 'border-zinc-700 text-zinc-300',
    dropBg: 'bg-zinc-800/40 border-zinc-500',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    accent: 'border-amber-600/60 text-amber-400',
    dropBg: 'bg-amber-950/30 border-amber-500',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    accent: 'border-emerald-600/60 text-emerald-400',
    dropBg: 'bg-emerald-950/30 border-emerald-500',
  },
];

export default function KanbanBoard() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<TodoStatus | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // --- CRUD Operations ---
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status: 'YET_TO_START',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTitle('');
    setDescription('');
  };

  const handleUpdateTitle = (id: string) => {
    if (editTitle.trim()) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: editTitle.trim(), updatedAt: Date.now() } : t))
      );
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Native HTML5 Drag & Drop Handlers ---
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTodoId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, status: TodoStatus) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const onDragLeave = (e: React.DragEvent, status: TodoStatus) => {
    // Only reset if leaving the column container itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (activeDropColumn === status) {
      setActiveDropColumn(null);
    }
  };

  const onDrop = (e: React.DragEvent, targetStatus: TodoStatus) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('text/plain') || draggedTodoId;

    if (todoId) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId
            ? { ...todo, status: targetStatus, updatedAt: Date.now() }
            : todo
        )
      );
    }

    setDraggedTodoId(null);
    setActiveDropColumn(null);
  };

  const onDragEnd = () => {
    setDraggedTodoId(null);
    setActiveDropColumn(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kanban Task Board</h1>
            <p className="text-xs text-zinc-400">Drag and drop cards between status lanes</p>
          </div>
          <div className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-400">
            Total Cards: {todos.length}
          </div>
        </header>

        {/* Quick Add Form */}
        <form
          onSubmit={handleAdd}
          className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 mb-6 flex flex-wrap gap-2.5 items-center"
        >
          <input
            type="text"
            placeholder="Card title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 min-w-[200px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500"
          />
          <input
            type="text"
            placeholder="Details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 min-w-[200px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Add to Backlog
          </button>
        </form>

        {/* 3-Column Kanban Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map((column) => {
            const columnTodos = todos.filter((t) => t.status === column.id);
            const isTarget = activeDropColumn === column.id;

            return (
              <div
                key={column.id}
                onDragOver={(e) => onDragOver(e, column.id)}
                onDragLeave={(e) => onDragLeave(e, column.id)}
                onDrop={(e) => onDrop(e, column.id)}
                className={`flex flex-col min-h-[520px] rounded-2xl border p-4 bg-zinc-900/40 transition-all duration-150 ${
                  isTarget ? `${column.dropBg} border-dashed` : 'border-zinc-800/80'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full border ${column.accent}`}
                    />
                    <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                      {column.title}
                    </h2>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">
                    {columnTodos.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3">
                  {columnTodos.map((todo) => {
                    const isDragging = draggedTodoId === todo.id;

                    return (
                      <div
                        key={todo.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, todo.id)}
                        onDragEnd={onDragEnd}
                        className={`bg-zinc-900 border border-zinc-800/90 rounded-xl p-3.5 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:border-zinc-700 ${
                          isDragging ? 'opacity-30 scale-95 border-dashed border-blue-400' : 'opacity-100'
                        }`}
                      >
                        {editingId === todo.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle(todo.id)}
                              className="w-full bg-zinc-950 border border-zinc-700 px-2 py-1 text-sm rounded text-zinc-100 focus:outline-none"
                              autoFocus
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-xs text-zinc-400 px-2 py-0.5 hover:text-zinc-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateTitle(todo.id)}
                                className="text-xs bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded hover:bg-zinc-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm font-medium select-none ${
                                  todo.status === 'COMPLETED'
                                    ? 'line-through text-zinc-500'
                                    : 'text-zinc-200'
                                }`}
                              >
                                {todo.title}
                              </p>
                              <div className="flex items-center gap-1.5 shrink-0 opacity-80 hover:opacity-100">
                                <button
                                  onClick={() => {
                                    setEditingId(todo.id);
                                    setEditTitle(todo.title);
                                  }}
                                  className="text-[11px] text-zinc-500 hover:text-zinc-300"
                                >
                                  ✎
                                </button>
                                <button
                                  onClick={() => handleDelete(todo.id)}
                                  className="text-zinc-500 hover:text-red-400 text-xs transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {todo.description && (
                              <p className="text-xs text-zinc-400 mt-1.5 select-none leading-relaxed">
                                {todo.description}
                              </p>
                            )}

                            <div className="mt-3 pt-2 border-t border-zinc-800/60 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                              <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                              <span className="text-[10px] text-zinc-600">:: drag</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {columnTodos.length === 0 && (
                    <div className="h-32 border border-dashed border-zinc-800/80 rounded-xl flex items-center justify-center text-xs text-zinc-600 select-none">
                      Drop cards here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

```

---

### Key Mechanics

* **State Transfer (`dataTransfer`)**: Stores the `id` payload in `onDragStart` and retrieves it cleanly during `onDrop` without losing component state.
* **Visual Target Feedback**: `activeDropColumn` detects which column is being hovered over during `onDragOver` to render dashed highlight outlines (`dropBg`).
* **Ghosting Prevention**: `isDragging` adds `opacity-30 scale-95` to the active source card, visually distinguishing source from destination.
* **Preserved CRUD**: Cards can still be inline-edited, deleted, or added into the first column (`Yet to Start`).
