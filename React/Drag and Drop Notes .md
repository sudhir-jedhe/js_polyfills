*** copy Drag and Drop Notes .md ***

A React Drag and Drop Sticky Notes board using pointer events to handle smooth drag movement, bound collision detection, z-index elevation on focus, and local note editing.

---

### Component Implementation

```tsx
import React, { useState, useRef } from 'react';

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  zIndex: number;
}

const NOTE_COLORS = ['#fef08a', '#bbf7d0', '#fed7aa', '#bae6fd', '#fbcfe8'];

const INITIAL_NOTES: Note[] = [
  { id: '1', text: '📌 Review Pull Requests on GitHub', x: 40, y: 50, color: '#fef08a', zIndex: 1 },
  { id: '2', text: '💡 Plan React architecture workshop', x: 280, y: 70, color: '#bae6fd', zIndex: 2 },
  { id: '3', text: '🛒 Grocery shopping after work', x: 120, y: 220, color: '#bbf7d0', zIndex: 3 },
];

export const DragDropNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  
  const boardRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });
  const maxZIndexRef = useRef<number>(4);

  const bringToFront = (id: string) => {
    maxZIndexRef.current += 1;
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, zIndex: maxZIndexRef.current } : n))
    );
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, note: Note) => {
    // Only drag when interacting with the note header/body, not the text input or delete button
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }

    e.preventDefault();
    bringToFront(note.id);
    setActiveNoteId(note.id);

    const noteElement = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: e.clientX - noteElement.left,
      offsetY: e.clientY - noteElement.top,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeNoteId || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    
    // Calculate new position relative to board boundaries
    let nextX = e.clientX - boardRect.left - dragOffsetRef.current.offsetX;
    let nextY = e.clientY - boardRect.top - dragOffsetRef.current.offsetY;

    // Boundary clamping (keeps 200x180 note fully inside board)
    nextX = Math.max(0, Math.min(nextX, boardRect.width - 200));
    nextY = Math.max(0, Math.min(nextY, boardRect.height - 180));

    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, x: nextX, y: nextY } : n))
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeNoteId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback for released targets
      }
      setActiveNoteId(null);
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    maxZIndexRef.current += 1;

    const newNote: Note = {
      id: Date.now().toString(),
      text: newNoteText,
      x: 30 + (notes.length * 20) % 300,
      y: 40 + (notes.length * 20) % 200,
      color: NOTE_COLORS[notes.length % NOTE_COLORS.length],
      zIndex: maxZIndexRef.current,
    };

    setNotes((prev) => [...prev, newNote]);
    setNewNoteText('');
  };

  const updateText = (id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '24px auto', fontFamily: 'sans-serif' }}>
      {/* Control Toolbar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Write a quick note..."
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleAddNote}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#0284c7',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add Note +
        </button>
      </div>

      {/* Drag & Drop Board Area */}
      <div
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'relative',
          width: '100%',
          height: '520px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '2px dashed #cbd5e1',
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            onPointerDown={(e) => handlePointerDown(e, note)}
            tabIndex={0}
            role="region"
            aria-label={`Sticky note: ${note.text}`}
            onFocus={() => bringToFront(note.id)}
            style={{
              position: 'absolute',
              left: `${note.x}px`,
              top: `${note.y}px`,
              width: '200px',
              height: '180px',
              backgroundColor: note.color,
              zIndex: note.zIndex,
              borderRadius: '8px',
              boxShadow: activeNoteId === note.id ? '0 14px 28px rgba(0,0,0,0.2)' : '0 4px 10px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',
              cursor: activeNoteId === note.id ? 'grabbing' : 'grab',
              userSelect: 'none',
              transition: activeNoteId === note.id ? 'none' : 'box-shadow 0.2s ease',
            }}
          >
            {/* Note Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                aria-label="Delete note"
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* Editable Content */}
            <textarea
              value={note.text}
              onChange={(e) => updateText(note.id, e.target.value)}
              onFocus={() => bringToFront(note.id)}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '13px',
                color: '#334155',
                cursor: 'text',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

```

---

### Core Mechanics

* **Pointer Capture (`setPointerCapture`)**: Locks cursor tracking to the moving note, preventing drag interruption if the cursor moves faster than the DOM update cycle.
* **Bounding Rect Clamping**: Restricts $(x, y)$ values strictly within `boardRef.current.getBoundingClientRect()`.
* **Dynamic Stacking Order**: Brings any clicked or focused note to the foreground by continuously incrementing a monotonic `zIndex` counter ref.
