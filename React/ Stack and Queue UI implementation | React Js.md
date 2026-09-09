***   Stack and Queue UI implementation | React Js.md ***

An interactive visualizer comparing **Stack (LIFO — Last In, First Out)** and **Queue (FIFO — First In, First Out)** side-by-side with animated insertion/removal, fixed capacity limits, and operation trackers.

### 1. Data Structures Visualizer (`DataStructures.jsx`)

```jsx
import React, { useState } from 'react';

const MAX_CAPACITY = 6;

export default function StackAndQueue() {
  const [stack, setStack] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [queue, setQueue] = useState(['Item A', 'Item B', 'Item C']);
  const [stackInput, setStackInput] = useState('');
  const [queueInput, setQueueInput] = useState('');
  const [log, setLog] = useState('Initialized data structures.');

  // --- Stack Operations (LIFO) ---
  const handlePush = () => {
    if (!stackInput.trim()) return;
    if (stack.length >= MAX_CAPACITY) {
      setLog('Stack Overflow! Maximum capacity reached.');
      return;
    }
    setStack((prev) => [...prev, stackInput.trim()]);
    setLog(`Stack: Pushed "${stackInput.trim()}" to top.`);
    setStackInput('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setLog('Stack Underflow! Stack is empty.');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, -1));
    setLog(`Stack: Popped "${popped}" from top.`);
  };

  const handleStackPeek = () => {
    if (stack.length === 0) return setLog('Stack is empty.');
    setLog(`Stack Peek (Top): "${stack[stack.length - 1]}"`);
  };

  // --- Queue Operations (FIFO) ---
  const handleEnqueue = () => {
    if (!queueInput.trim()) return;
    if (queue.length >= MAX_CAPACITY) {
      setLog('Queue Overflow! Maximum capacity reached.');
      return;
    }
    setQueue((prev) => [...prev, queueInput.trim()]);
    setLog(`Queue: Enqueued "${queueInput.trim()}" at rear.`);
    setQueueInput('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setLog('Queue Underflow! Queue is empty.');
      return;
    }
    const dequeued = queue[0];
    setQueue((prev) => prev.slice(1));
    setLog(`Queue: Dequeued "${dequeued}" from front.`);
  };

  const handleQueuePeek = () => {
    if (queue.length === 0) return setLog('Queue is empty.');
    setLog(`Queue Peek (Front): "${queue[0]}"`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={{ margin: 0 }}>Stack & Queue UI Visualizer</h2>
        <div style={styles.logBox}>
          <strong>Status:</strong> {log}
        </div>
      </header>

      <div style={styles.grid}>
        {/* STACK PANEL */}
        <section style={styles.card}>
          <div style={styles.structureHeader}>
            <h3>Stack (LIFO)</h3>
            <span style={styles.subtext}>Last In, First Out</span>
          </div>

          <div style={styles.controls}>
            <input
              type="text"
              placeholder="Value..."
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              style={styles.input}
            />
            <div style={styles.btnGroup}>
              <button onClick={handlePush} style={styles.btnPrimary}>Push</button>
              <button onClick={handlePop} style={styles.btnDanger}>Pop</button>
              <button onClick={handleStackPeek} style={styles.btnSecondary}>Peek</button>
            </div>
          </div>

          {/* Vertical Stack Visual Container */}
          <div style={styles.stackVisual}>
            <div style={styles.stackTopMarker}>TOP ⬇</div>
            <div style={styles.stackContainer}>
              {stack.length === 0 ? (
                <div style={styles.emptyNotice}>Stack is Empty</div>
              ) : (
                [...stack].reverse().map((item, index) => {
                  const originalIndex = stack.length - 1 - index;
                  const isTop = index === 0;
                  return (
                    <div
                      key={originalIndex}
                      style={{
                        ...styles.element,
                        ...styles.stackElement,
                        backgroundColor: isTop ? '#2563eb' : '#3b82f6',
                        border: isTop ? '2px solid #60a5fa' : 'none',
                      }}
                    >
                      <span>{item}</span>
                      <small style={styles.indexTag}>[{originalIndex}]</small>
                    </div>
                  );
                })
              )}
            </div>
            <div style={styles.stackBaseMarker}>STACK BASE</div>
          </div>
        </section>

        {/* QUEUE PANEL */}
        <section style={styles.card}>
          <div style={styles.structureHeader}>
            <h3>Queue (FIFO)</h3>
            <span style={styles.subtext}>First In, First Out</span>
          </div>

          <div style={styles.controls}>
            <input
              type="text"
              placeholder="Value..."
              value={queueInput}
              onChange={(e) => setQueueInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
              style={styles.input}
            />
            <div style={styles.btnGroup}>
              <button onClick={handleEnqueue} style={styles.btnPrimary}>Enqueue</button>
              <button onClick={handleDequeue} style={styles.btnDanger}>Dequeue</button>
              <button onClick={handleQueuePeek} style={styles.btnSecondary}>Peek</button>
            </div>
          </div>

          {/* Horizontal Queue Visual Container */}
          <div style={styles.queueVisualWrapper}>
            <div style={styles.queueMarkers}>
              <span>⬅ FRONT (Exit)</span>
              <span>REAR (Entry) ⬅</span>
            </div>
            <div style={styles.queueContainer}>
              {queue.length === 0 ? (
                <div style={styles.emptyNotice}>Queue is Empty</div>
              ) : (
                queue.map((item, index) => {
                  const isFront = index === 0;
                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.element,
                        ...styles.queueElement,
                        backgroundColor: isFront ? '#059669' : '#10b981',
                        border: isFront ? '2px solid #34d399' : 'none',
                      }}
                    >
                      <span>{item}</span>
                      <small style={styles.indexTag}>[{index}]</small>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '30px auto',
    padding: '0 16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#0f172a',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logBox: {
    marginTop: '12px',
    padding: '10px 16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    fontSize: '0.9rem',
    border: '1px solid #cbd5e1',
    color: '#334155',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  structureHeader: {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  subtext: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '8px 12px',
    fontSize: '0.9rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
  },
  btnGroup: {
    display: 'flex',
    gap: '8px',
  },
  btnPrimary: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnDanger: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
  },
  stackVisual: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  stackTopMarker: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#2563eb',
  },
  stackContainer: {
    width: '100%',
    minHeight: '260px',
    borderLeft: '4px solid #475569',
    borderRight: '4px solid #475569',
    borderBottom: '4px solid #475569',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '8px',
    gap: '6px',
    borderRadius: '0 0 6px 6px',
    backgroundColor: '#f8fafc',
  },
  stackBaseMarker: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    fontWeight: '600',
  },
  queueVisualWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '16px',
  },
  queueMarkers: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#059669',
  },
  queueContainer: {
    minHeight: '90px',
    borderTop: '4px dashed #475569',
    borderBottom: '4px dashed #475569',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 8px',
    gap: '8px',
    backgroundColor: '#f8fafc',
    overflowX: 'auto',
  },
  element: {
    color: '#ffffff',
    padding: '10px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '500',
    fontSize: '0.85rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  stackElement: {
    width: '100%',
    boxSizing: 'border-box',
  },
  queueElement: {
    minWidth: '90px',
    height: '45px',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '2px',
    flexShrink: 0,
  },
  indexTag: {
    fontSize: '0.7rem',
    opacity: 0.8,
  },
  emptyNotice: {
    margin: 'auto',
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
};

```

---

### Key Structural Concepts

* **Stack Orientation (LIFO):** Displayed vertically with open-top borders. Pushing appends to the array end, and `.reverse()` is rendered top-to-bottom so the most recent item is always visually at the **TOP**.
* **Queue Orientation (FIFO):** Displayed horizontally with dashed pipeline borders. Items enter from the **REAR** (array `.push`) and exit from the **FRONT** (array `[0]` via `.slice(1)`).
* **Bound Protection:** Built-in safeguards check against both **Overflow** (`MAX_CAPACITY = 6`) and **Underflow** (`length === 0`).
