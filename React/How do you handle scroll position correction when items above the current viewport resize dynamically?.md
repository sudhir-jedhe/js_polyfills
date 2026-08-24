When an item located **above the visible viewport** resizes (e.g., an image loads, text expands, or overscan elements measure larger than their estimated heights), the cumulative offset above the user changes. Without correction, the content underneath is pushed down or pulled up, causing a jarring visual **scroll jump/drift**.

---

### The Anchor Index Principle

To maintain a rock-solid scroll position, implement an **Anchor Node Technique**:

1. **Identify the Anchor Item:** Before applying measurements, find the item currently docked at the very top edge of the viewport (the "Anchor Index").
2. **Track the Anchor's Relative Offset:** Measure how many pixels of that anchor item are hidden above the top edge (`scrollTop - anchor.top`).
3. **Measure & Update:** Let the `ResizeObserver` measure elements and calculate height differences ($\Delta \text{Height}$).
4. **Synchronous Position Adjustment:** In `useLayoutEffect`, calculate the new position of that exact same anchor item and adjust `container.scrollTop` synchronously before paint:

$$\text{scrollTop}_{\text{corrected}} = \text{newAnchorTop} + \text{anchorOffset}$$

---

### Full Implementation

```jsx
import React, { useState, useRef, useLayoutEffect, useCallback, useMemo } from 'react';

const ESTIMATED_HEIGHT = 60;
const OVERSCAN = 3;
const CONTAINER_HEIGHT = 450;

function findStartIndex(positions, targetY) {
  let low = 0;
  let high = positions.length - 1;
  let result = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const itemBottom = positions[mid].top + positions[mid].height;

    if (itemBottom > targetY) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return result;
}

export function ScrollAnchoredVirtualList({ items, renderItem }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const measuredHeights = useRef(new Map());
  const itemElementsRef = useRef(new Map());
  const containerRef = useRef(null);

  // Store anchor data during layout changes
  const anchorRef = useRef({ index: 0, offsetFromTop: 0 });

  const [, setTick] = useState(0);
  const triggerRecompute = useCallback(() => setTick((t) => t + 1), []);

  // 1. Calculate Prefix Sum Positions
  const { positions, totalHeight } = useMemo(() => {
    const pos = new Array(items.length);
    let cumulativeOffset = 0;

    for (let i = 0; i < items.length; i++) {
      const height = measuredHeights.current.get(i) || ESTIMATED_HEIGHT;
      pos[i] = {
        top: cumulativeOffset,
        height,
      };
      cumulativeOffset += height;
    }

    return { positions: pos, totalHeight: cumulativeOffset };
  }, [items.length, items]);

  // 2. Visible Slice Calculation
  const firstVisibleIndex = findStartIndex(positions, scrollTop);
  const startIndex = Math.max(0, firstVisibleIndex - OVERSCAN);

  let endIndex = startIndex;
  let currentBottom = positions[startIndex]?.top || 0;
  const viewportBottom = scrollTop + CONTAINER_HEIGHT;

  while (endIndex < items.length && currentBottom < viewportBottom) {
    currentBottom = positions[endIndex].top + positions[endIndex].height;
    endIndex++;
  }
  endIndex = Math.min(items.length, endIndex + OVERSCAN);

  const visibleSlice = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleSlice.push({
      index: i,
      data: items[i],
      position: positions[i],
    });
  }

  // 3. Measure Elements & Correct Drift
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let deltaAboveViewport = 0;
    const currentScrollTop = container.scrollTop;

    // A. Snapshot the primary visible anchor before resizing changes take effect
    const anchorIndex = findStartIndex(positions, currentScrollTop);
    const anchorOldTop = positions[anchorIndex]?.top || 0;
    const anchorOffset = currentScrollTop - anchorOldTop;

    const observer = new ResizeObserver((entries) => {
      let hasMutated = false;

      for (const entry of entries) {
        const index = Number(entry.target.getAttribute('data-index'));
        if (isNaN(index)) continue;

        const measuredHeight =
          entry.borderBoxSize?.[0]?.blockSize ??
          entry.target.getBoundingClientRect().height;

        const oldHeight = measuredHeights.current.get(index) || ESTIMATED_HEIGHT;
        const diff = measuredHeight - oldHeight;

        if (Math.abs(diff) > 0.5) {
          measuredHeights.current.set(index, measuredHeight);
          hasMutated = true;

          // If this item is positioned strictly ABOVE the visible anchor, accumulate delta
          if (index < anchorIndex) {
            deltaAboveViewport += diff;
          }
        }
      }

      if (hasMutated) {
        // Synchronously adjust scrollTop to cancel out height expansion/shrinkage above
        if (deltaAboveViewport !== 0) {
          container.scrollTop += deltaAboveViewport;
          setScrollTop(container.scrollTop);
        }
        triggerRecompute();
      }
    });

    itemElementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleSlice, positions, triggerRecompute]);

  const handleScroll = (e) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: CONTAINER_HEIGHT,
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid #ddd',
        overflowAnchor: 'none', // Disable browser default to prevent conflicting corrections
      }}
    >
      <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
        {visibleSlice.map(({ index, data, position }) => (
          <div
            key={data.id ?? index}
            data-index={index}
            ref={(el) => {
              if (el) itemElementsRef.current.set(index, el);
              else itemElementsRef.current.delete(index);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${position.top}px)`,
              boxSizing: 'border-box',
            }}
          >
            {renderItem(data, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

### How the Delta Correction Works

```text
       [Item 0: Estimated 60px -> Measured 120px]  (+60px Δ) ──┐
       [Item 1: Measured 60px]                                 │ Resized ABOVE viewport
 ┌───► [Item 2: Anchor Item] ─── (Viewport Top) ───────────────┴─► Shift scrollTop by +60px
 │
 │     [Item 3: Visible content]
 │     [Item 4: Visible content]
 └──── (Viewport Bottom)

```

1. **`index < anchorIndex`**: Only item mutations occurring **above** the current viewport contribute to `deltaAboveViewport`.
2. **`container.scrollTop += deltaAboveViewport`**: Adjusting `scrollTop` by the exact delta offsets the expansion before the screen is painted.
3. **`overflowAnchor: 'none'`**: Disables standard browser scroll anchoring to prevent the browser engine and your virtualizer script from double-compensating.
