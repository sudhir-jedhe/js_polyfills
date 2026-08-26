A complete, production-ready Traffic Light simulator in React with customizable timers, manual overrides, and accessible markup.

### 1. Component Code (`TrafficLight.jsx`)

```jsx
import React, { useState, useEffect } from 'react';

const LIGHT_CONFIG = {
  red: {
    duration: 4000,
    next: 'green',
    color: '#ff3b30',
    ariaLabel: 'Red light - Stop',
  },
  yellow: {
    duration: 1000,
    next: 'red',
    color: '#ffcc00',
    ariaLabel: 'Yellow light - Prepare to stop',
  },
  green: {
    duration: 3000,
    next: 'yellow',
    color: '#34c759',
    ariaLabel: 'Green light - Go',
  },
};

export default function TrafficLight({ initialColor = 'red' }) {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setCurrentColor((prev) => LIGHT_CONFIG[prev].next);
    }, LIGHT_CONFIG[currentColor].duration);

    return () => clearTimeout(timer);
  }, [currentColor, isPaused]);

  return (
    <div style={styles.container}>
      <div 
        style={styles.housing} 
        role="region" 
        aria-label="Traffic Light"
        aria-live="polite"
      >
        <span className="sr-only" style={styles.srOnly}>
          {LIGHT_CONFIG[currentColor].ariaLabel}
        </span>

        {Object.keys(LIGHT_CONFIG).map((colorKey) => {
          const isActive = currentColor === colorKey;
          return (
            <div
              key={colorKey}
              style={{
                ...styles.light,
                backgroundColor: isActive
                  ? LIGHT_CONFIG[colorKey].color
                  : '#333333',
                boxShadow: isActive
                  ? `0 0 24px ${LIGHT_CONFIG[colorKey].color}`
                  : 'none',
              }}
            />
          );
        })}
      </div>

      <div style={styles.controls}>
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          style={styles.button}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>

        {Object.keys(LIGHT_CONFIG).map((colorKey) => (
          <button
            key={colorKey}
            onClick={() => {
              setCurrentColor(colorKey);
              setIsPaused(false);
            }}
            style={{
              ...styles.button,
              borderColor: LIGHT_CONFIG[colorKey].color,
            }}
          >
            Force {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '32px',
    fontFamily: 'system-ui, sans-serif',
  },
  housing: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#1c1c1e',
    padding: '20px',
    borderRadius: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '4px solid #2c2c2e',
  },
  light: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  controls: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #555',
    backgroundColor: '#2c2c2e',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '500',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  },
};

```

---

### Key Architectural Choices

* **State Config Mapping:** Instead of multiple `if/else` checks, an object mapping (`LIGHT_CONFIG`) encapsulates transition order (`next`), timing intervals (`duration`), and colors.
* **Clean Cleanup:** The `useEffect` returns a `clearTimeout` cleanup function to prevent memory leaks and race conditions if the component unmounts or state updates manually.
* **Accessibility:** Screen readers are alerted via `aria-live="polite"` and an accessible description instead of relying purely on visual color shifts.

Extend this React traffic light into a 4-way intersection simulation where North/South and East/West coordinate automatically.

Here is an extended 4-way intersection simulation using a deterministic Finite State Machine (FSM). To ensure real-world intersection safety, it includes an **All-Red Clearance** phase between green/yellow switches to prevent collisions.

```jsx
import React, { useState, useEffect, useCallback } from 'react';

// FSM States defining safety clearance and active green/yellow cycles
const INTERSECTION_PHASES = {
  NS_GREEN: {
    northSouth: 'green',
    eastWest: 'red',
    duration: 4000,
    next: 'NS_YELLOW',
    label: 'North-South Flowing',
  },
  NS_YELLOW: {
    northSouth: 'yellow',
    eastWest: 'red',
    duration: 1500,
    next: 'ALL_RED_TO_EW',
    label: 'North-South Slowing',
  },
  ALL_RED_TO_EW: {
    northSouth: 'red',
    eastWest: 'red',
    duration: 1000,
    next: 'EW_GREEN',
    label: 'All-Red Clearance',
  },
  EW_GREEN: {
    northSouth: 'red',
    eastWest: 'green',
    duration: 4000,
    next: 'EW_YELLOW',
    label: 'East-West Flowing',
  },
  EW_YELLOW: {
    northSouth: 'red',
    eastWest: 'yellow',
    duration: 1500,
    next: 'ALL_RED_TO_NS',
    label: 'East-West Slowing',
  },
  ALL_RED_TO_NS: {
    northSouth: 'red',
    eastWest: 'red',
    duration: 1000,
    next: 'NS_GREEN',
    label: 'All-Red Clearance',
  },
};

const COLOR_MAP = {
  red: '#ff3b30',
  yellow: '#ffcc00',
  green: '#34c759',
  off: '#2a2a2c',
};

// Reusable Single Signal Unit
function SignalHead({ activeColor, label, orientation = 'vertical' }) {
  const isHorizontal = orientation === 'horizontal';
  return (
    <div style={styles.signalWrapper}>
      <span style={styles.signalLabel}>{label}</span>
      <div
        style={{
          ...styles.housing,
          flexDirection: isHorizontal ? 'row' : 'column',
        }}
        role="group"
        aria-label={`${label} Traffic Signal`}
      >
        {['red', 'yellow', 'green'].map((color) => {
          const isActive = activeColor === color;
          return (
            <div
              key={color}
              style={{
                ...styles.light,
                backgroundColor: isActive ? COLOR_MAP[color] : COLOR_MAP.off,
                boxShadow: isActive ? `0 0 16px ${COLOR_MAP[color]}` : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Intersection() {
  const [currentPhase, setCurrentPhase] = useState('NS_GREEN');
  const [isPaused, setIsPaused] = useState(false);
  const [pedestrianRequested, setPedestrianRequested] = useState(false);

  const phaseConfig = INTERSECTION_PHASES[currentPhase];

  const advancePhase = useCallback(() => {
    setCurrentPhase((prev) => INTERSECTION_PHASES[prev].next);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(advancePhase, phaseConfig.duration);
    return () => clearTimeout(timer);
  }, [currentPhase, isPaused, phaseConfig.duration, advancePhase]);

  // Request pedestrian cross: triggers immediate yellow if in green phase
  const handlePedestrianButton = () => {
    setPedestrianRequested(true);
    if (currentPhase === 'NS_GREEN') {
      setCurrentPhase('NS_YELLOW');
    } else if (currentPhase === 'EW_GREEN') {
      setCurrentPhase('EW_YELLOW');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>4-Way Intersection Controller</h2>
      <div style={styles.statusBar} aria-live="polite">
        Current State: <strong>{phaseConfig.label}</strong>
      </div>

      {/* Crossroad Layout Grid */}
      <div style={styles.intersectionLayout}>
        {/* North */}
        <div style={{ ...styles.gridCell, gridArea: 'north' }}>
          <SignalHead activeColor={phaseConfig.northSouth} label="North (N)" />
        </div>

        {/* West */}
        <div style={{ ...styles.gridCell, gridArea: 'west' }}>
          <SignalHead
            activeColor={phaseConfig.eastWest}
            label="West (W)"
            orientation="horizontal"
          />
        </div>

        {/* Central Junction Box */}
        <div style={{ ...styles.gridCell, gridArea: 'center' }}>
          <div style={styles.junctionBox}>
            <div style={styles.roadMarking} />
          </div>
        </div>

        {/* East */}
        <div style={{ ...styles.gridCell, gridArea: 'east' }}>
          <SignalHead
            activeColor={phaseConfig.eastWest}
            label="East (E)"
            orientation="horizontal"
          />
        </div>

        {/* South */}
        <div style={{ ...styles.gridCell, gridArea: 'south' }}>
          <SignalHead activeColor={phaseConfig.northSouth} label="South (S)" />
        </div>
      </div>

      {/* Simulation Controls */}
      <div style={styles.controls}>
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          style={styles.button}
        >
          {isPaused ? '▶ Resume Timer' : '⏸ Pause Cycle'}
        </button>

        <button
          onClick={handlePedestrianButton}
          style={{
            ...styles.button,
            backgroundColor: pedestrianRequested ? '#ff9500' : '#2c2c2e',
          }}
        >
          🚸 Crosswalk Request
        </button>

        <button
          onClick={() => {
            setCurrentPhase('NS_GREEN');
            setIsPaused(false);
          }}
          style={styles.button}
        >
          Reset to N/S Green
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    backgroundColor: '#121214',
    color: '#f5f5f7',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: '12px',
  },
  header: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  statusBar: {
    fontSize: '0.95rem',
    color: '#86868b',
  },
  intersectionLayout: {
    display: 'grid',
    gridTemplateAreas: `
      ".     north ."
      "west  center east"
      ".     south ."
    `,
    gridTemplateColumns: '130px 100px 130px',
    gridTemplateRows: '150px 100px 150px',
    gap: '8px',
    alignItems: 'center',
    justifyItems: 'center',
  },
  gridCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  junctionBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#242426',
    border: '2px dashed #444',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadMarking: {
    width: '12px',
    height: '12px',
    backgroundColor: '#ffcc00',
    borderRadius: '50%',
    opacity: 0.6,
  },
  signalWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  signalLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a1a1a6',
  },
  housing: {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#1c1c1e',
    padding: '10px',
    borderRadius: '14px',
    border: '2px solid #333336',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
  light: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '10px',
  },
  button: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2e',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

```

---

### Core Mechanics

* **Single Source of Truth:** Rather than orchestrating two separate timers for North/South and East/West (which often drift out of sync), the intersection runs on a single 6-step state machine (`INTERSECTION_PHASES`).
* **All-Red Clearance Buffers:** Transitioning between `NS_YELLOW` and `EW_GREEN` involves `ALL_RED_TO_EW`, ensuring cars already in the intersection have a 1-second buffer before the crossing flow begins.
* **Emergency & Event Overrides:** The `handlePedestrianButton` directly updates the FSM to transition the active green direction straight to yellow, avoiding immediate instant cuts to red.

Add animated cars or moving vehicles to this 4-way intersection React simulation that stop on red/yellow and pass through on green.

![alt text](image-35.png)
