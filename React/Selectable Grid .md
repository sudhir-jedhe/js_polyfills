*** copy Selectable Grid .md ***

A Selectable Grid allows users to drag a 2D bounding selection box across matrix cells to select rectangular ranges.

---

### Component Implementation

```tsx
import React, { useState, useRef, useCallback } from 'react';

interface Position {
  row: number;
  col: number;
}

interface SelectableGridProps {
  rows?: number;
  cols?: number;
}

export const SelectableGrid: React.FC<SelectableGridProps> = ({
  rows = 10,
  cols = 10,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const startCellRef = useRef<Position | null>(null);

  const calculateSelectionRange = useCallback(
    (start: Position, end: Position) => {
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);

      const selected: number[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          selected.push(r * cols + c + 1);
        }
      }
      return selected;
    },
    [cols]
  );

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    startCellRef.current = { row, col };
    setSelectedCells([row * cols + col + 1]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !startCellRef.current) return;
    const currentPos = { row, col };
    const newSelected = calculateSelectionRange(startCellRef.current, currentPos);
    setSelectedCells(newSelected);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    startCellRef.current = null;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '30px auto',
        fontFamily: 'sans-serif',
        userSelect: 'none',
      }}
      onMouseUp={handleMouseUp}
    >
      <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>Selectable Grid</h2>

      <div
        role="grid"
        aria-label="Selectable 2D Grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 40px)`,
          gap: '4px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const cellNumber = r * cols + c + 1;
            const isSelected = selectedCells.includes(cellNumber);

            return (
              <div
                key={cellNumber}
                role="gridcell"
                aria-selected={isSelected}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #94a3b8',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? '#3b82f6' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {cellNumber}
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
        Selected Count: <strong>{selectedCells.length}</strong>
      </div>
    </div>
  );
};

```

---

### Core Mechanics

* **2D Matrix Coordinates**: Maps 1D index positions to 2D $(r, c)$ coordinates via $\text{index} = r \times \text{cols} + c + 1$.
* **Range Bounding Box Calculation**: Computes $\min/\max$ bounds for both rows and columns between `startCellRef` and the active hover cell to select all enclosed cells in $O(\Delta r \times \Delta c)$.
* **Global Mouse-Up Handler**: Attaching `onMouseUp` on the outer wrapper ensures the selection stops cleanly even if released outside a specific cell.
