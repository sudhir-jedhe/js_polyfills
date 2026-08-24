A common frontend interview challenge is the **Grid Lights (or Shape Lights)** component: an interactive $3 \times 3$ grid with a non-interactive center cell where selected cells light up in order and automatically deactivate in reverse sequence (FIFO/LIFO) once all active cells are clicked.

---

### Component Implementation

```tsx
import React, { useState, useRef } from 'react';

// 1 represents an interactive cell, 0 represents an empty/disabled space
const GRID_CONFIG = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

export const GridLights: React.FC = () => {
  const [order, setOrder] = useState<number[]>([]);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Total clickable cells (count all 1s)
  const totalClickableCells = GRID_CONFIG.flat().filter(Boolean).length;

  const deactivateCells = (currentOrder: number[]) => {
    setIsDeactivating(true);

    timerRef.current = setInterval(() => {
      setOrder((origOrder) => {
        const newOrder = origOrder.slice();
        newOrder.pop(); // Remove the last clicked cell (reverse unwinding)

        if (newOrder.length === 0) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setIsDeactivating(false);
        }

        return newOrder;
      });
    }, 300);
  };

  const handleClick = (index: number) => {
    // Ignore clicks if deactivation is running or cell is already active
    if (isDeactivating || order.includes(index)) return;

    const newOrder = [...order, index];
    setOrder(newOrder);

    // Trigger sequential deactivation once all cells are clicked
    if (newOrder.length === totalClickableCells) {
      deactivateCells(newOrder);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        margin: '40px auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Grid Lights</h2>

      <div
        role="grid"
        aria-label="Grid Lights Game"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_CONFIG[0].length}, 80px)`,
          gap: '12px',
        }}
      >
        {GRID_CONFIG.flat().map((value, index) => {
          const isActivated = order.includes(index);

          // Render empty invisible space if config value is 0
          if (value === 0) {
            return <div key={index} aria-hidden="true" />;
          }

          return (
            <button
              key={index}
              type="button"
              aria-label={`Cell ${index + 1}`}
              aria-pressed={isActivated}
              disabled={isActivated || isDeactivating}
              onClick={() => handleClick(index)}
              style={{
                width: '80px',
                height: '80px',
                border: '2px solid #0f172a',
                borderRadius: '8px',
                backgroundColor: isActivated ? '#22c55e' : '#f8fafc',
                cursor: isDeactivating || isActivated ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

```

---

### Key Mechanics

* **State Tracking (`order`)**: Stores the indices of clicked cells in sequential insertion order.
* **Auto-unwinding (`deactivateCells`)**: Uses `setInterval` to pop cells one by one off the stack (`newOrder.pop()`) every 300ms.
* **Interaction Locking (`isDeactivating`)**: Disables user clicks during the reversal phase to prevent state collisions.
* **ARIA Support**: Uses `aria-pressed={isActivated}` and `role="grid"` for assistive tech.
