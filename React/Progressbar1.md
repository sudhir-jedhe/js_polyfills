*** copy Progressbar1.md ***

An accessible, customizable React Progress Bar component built with ARIA attributes (`role="progressbar"`), animated transitions, and auto-clamping values.

---

### Component Implementation

```tsx
import React from 'react';

interface ProgressBarProps {
  value: number; // Current value (0 - 100)
  min?: number;
  max?: number;
  label?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  min = 0,
  max = 100,
  label = 'Progress',
  color = '#2563eb',
  height = 20,
  showPercentage = true,
}) => {
  // Clamp value strictly between min and max
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = Math.round(((clampedValue - min) / (max - min)) * 100);

  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif' }}>
      {/* Accessible Label & Percentage Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#334155',
        }}
      >
        <span>{label}</span>
        {showPercentage && <span>{percentage}%</span>}
      </div>

      {/* Progress Track Container */}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        style={{
          height: `${height}px`,
          width: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
        }}
      >
        {/* Animated Progress Fill */}
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: color,
            borderRadius: 'inherit',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: percentage > 15 ? '8px' : '0px',
            color: '#ffffff',
            fontSize: `${Math.max(height - 8, 10)}px`,
            fontWeight: 'bold',
          }}
        />
      </div>
    </div>
  );
};

```

---

### Interactive Demo Example

```tsx
import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';

export const ProgressDemo = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '40px auto',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <ProgressBar value={progress} label="File Upload" color="#10b981" />
      <ProgressBar value={progress} label="Processing" color="#8b5cf6" height={12} />

      {/* Manual Controls */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={() => setProgress((p) => Math.max(p - 10, 0))}
          style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          -10%
        </button>
        <button
          onClick={() => setProgress((p) => Math.min(p + 10, 100))}
          style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          +10%
        </button>
        <button
          onClick={() => setProgress(0)}
          style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

```

---

### Accessibility Checklist

* **`role="progressbar"`**: Identifies the element as a progress bar to assistive technologies.
* **`aria-valuenow`**: Exposes the current numeric progress.
* **`aria-valuemin` & `aria-valuemax**`: Defines the bounds (0 and 100 by default).
* **`aria-label`**: Assigns a readable description for screen readers.
