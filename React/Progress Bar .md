# Progress Bar with Controls (React + TypeScript)

A common **React Machine Coding / Frontend Interview** question.

## Requirements

✅ Start Progress

✅ Pause Progress

✅ Resume Progress

✅ Reset Progress

✅ Increase Speed

✅ Decrease Speed

✅ Progress Percentage

✅ Smooth Animation

✅ Accessibility

***

## Demo Behaviour

```text
Progress: 0%
        ↓
Start
        ↓
25%
        ↓
Pause
        ↓
Resume
        ↓
100%
        ↓
Completed
```

***

# ProgressBar.tsx

```tsx
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./ProgressBar.css";

const MAX_PROGRESS = 100;

export default function ProgressBar() {
  const [progress, setProgress] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

  const [speed, setSpeed] =
    useState(100);

  const intervalRef =
    useRef<number | null>(null);

  const start = () => {
    if (progress >= MAX_PROGRESS) {
      return;
    }

    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const increaseSpeed = () => {
    setSpeed((prev) =>
      Math.max(20, prev - 20)
    );
  };

  const decreaseSpeed = () => {
    setSpeed((prev) =>
      prev + 20
    );
  };

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      return;
    }

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS) {
          setIsRunning(false);
          return MAX_PROGRESS;
        }

        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed]);

  const isCompleted =
    progress === MAX_PROGRESS;

  return (
    <div className="progress-container">
      <h2>Progress Bar with Controls</h2>

      <div
        className="progress-wrapper"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="progress-label">
        {progress}%
      </div>

      <div className="controls">
        <button
          onClick={start}
          disabled={
            isRunning ||
            isCompleted
          }
        >
          Start
        </button>

        <button
          onClick={pause}
          disabled={!isRunning}
        >
          Pause
        </button>

        <button
          onClick={reset}
        >
          Reset
        </button>

        <button
          onClick={increaseSpeed}
        >
          Faster
        </button>

        <button
          onClick={decreaseSpeed}
        >
          Slower
        </button>
      </div>

      <div className="speed-info">
        Interval: {speed}ms
      </div>

      {isCompleted && (
        <div className="success">
          ✅ Completed
        </div>
      )}
    </div>
  );
}
```

***

# ProgressBar.css

```css
.progress-container {
  width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}

.progress-wrapper {
  width: 100%;
  height: 30px;

  background: #e5e7eb;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563eb;

  transition:
    width 0.1s linear;
}

.progress-label {
  margin-top: 10px;
  font-weight: bold;
}

.controls {
  margin-top: 20px;

  display: flex;
  gap: 10px;
}

button {
  padding: 10px 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
}

.success {
  margin-top: 20px;
  color: green;
  font-weight: bold;
}

.speed-info {
  margin-top: 10px;
}
```

***

# App.tsx

```tsx
import ProgressBar from "./ProgressBar";

function App() {
  return (
    <div>
      <ProgressBar />
    </div>
  );
}

export default App;
```

***

# Advanced Interview Version

## Multi Progress Bars

```tsx
<ProgressBar
  id="upload1"
/>

<ProgressBar
  id="upload2"
/>
```

***

## Controlled Component

```tsx
<ProgressBar
  value={progress}
  onChange={setProgress}
/>
```

***

## Upload Progress

```tsx
axios.post(url, file, {
  onUploadProgress:
    event => {
      const percent =
        Math.round(
          (event.loaded * 100) /
          event.total
        );

      setProgress(percent);
    },
});
```

***

## API Polling Progress

```tsx
GET /job-status
```

Response:

```json
{
  "progress": 75
}
```

UI updates automatically.

***

## Custom Hook

```tsx
const {
  progress,
  start,
  pause,
  reset,
} = useProgress();
```

***

# Senior Frontend Discussion Points

### State Machine

```text
IDLE
 ↓
RUNNING
 ↓
PAUSED
 ↓
RESUMED
 ↓
COMPLETED
```

### Production Enhancements

✅ Determinate & Indeterminate modes

✅ Circular Progress

✅ Upload Progress

✅ Multi-file Progress

✅ Queue Support

✅ React Context

✅ ARIA Accessibility

✅ Animation Optimisation

✅ Web Worker Support

### Complexity

```text
Update Progress : O(1)
Render          : O(1)
Memory          : O(1)
```

### Architecture

```text
Progress Hook
      │
      ▼
Progress Store
      │
      ▼
Progress Component
      │
      ▼
UI Controls
```

This is the level of implementation typically expected in a **Senior React / Frontend Lead machine-coding interview** for a Progress Bar with Controls component.




Absolutely. For interview preparation, I recommend implementing these **6 progress bars completely**, as they cover 90% of React machine-coding rounds:

1. ✅ Linear Progress Bar
2. ✅ Animated Progress Bar
3. ✅ Step Progress Bar (Wizard)
4. ✅ Circular SVG Progress Bar
5. ✅ Indeterminate Progress Bar
6. ✅ Segmented Progress Bar

***

# 1. Linear Progress Bar

```tsx
interface ProgressProps {
  value: number;
}

export default function LinearProgress({
  value,
}: ProgressProps) {
  return (
    <div className="progress">
      <div
        className="fill"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}
```

```css
.progress {
  height: 20px;
  background: #ddd;
  border-radius: 12px;
}

.fill {
  height: 100%;
  background: #2563eb;
}
```

Usage

```tsx
<LinearProgress value={70} />
```

***

# 2. Animated Progress Bar

```tsx
import { useState } from "react";

export default function AnimatedProgress() {
  const [progress, setProgress] =
    useState(0);

  return (
    <>
      <button
        onClick={() =>
          setProgress(
            prev =>
              Math.min(
                prev + 10,
                100
              )
          )
        }
      >
        Increase
      </button>

      <div className="progress">
        <div
          className="fill animated"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </>
  );
}
```

```css
.animated {
  transition:
    width 0.4s ease;
}
```

***

# 3. Step Progress Bar

```tsx
interface Props {
  currentStep: number;
  steps: string[];
}

export default function StepProgress({
  currentStep,
  steps,
}: Props) {
  return (
    <div className="steps">
      {steps.map(
        (
          step,
          index
        ) => (
          <div
            key={step}
            className="step-item"
          >
            <div
              className={`circle ${
                index <=
                currentStep
                  ? "active"
                  : ""
              }`}
            >
              {index + 1}
            </div>

            <p>{step}</p>
          </div>
        )
      )}
    </div>
  );
}
```

Usage

```tsx
<StepProgress
  currentStep={1}
  steps={[
    "Profile",
    "Address",
    "Payment",
    "Confirm",
  ]}
/>
```

```css
.steps {
  display: flex;
  gap: 20px;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ddd;

  display: flex;
  align-items: center;
  justify-content: center;
}

.circle.active {
  background: green;
  color: white;
}
```

***

# 4. Circular SVG Progress Bar

```tsx
interface Props {
  value: number;
}

export default function CircularProgress({
  value,
}: Props) {
  const radius = 50;

  const circumference =
    2 *
    Math.PI *
    radius;

  const strokeOffset =
    circumference -
    (value / 100) *
      circumference;

  return (
    <svg
      width="120"
      height="120"
    >
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#ddd"
        strokeWidth="8"
        fill="none"
      />

      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#2563eb"
        strokeWidth="8"
        fill="none"
        strokeDasharray={
          circumference
        }
        strokeDashoffset={
          strokeOffset
        }
      />

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
      >
        {value}%
      </text>
    </svg>
  );
}
```

Usage

```tsx
<CircularProgress value={75} />
```

***

# 5. Indeterminate Progress Bar

```tsx
export default function LoadingProgress() {
  return (
    <div className="loading-bar">
      <div className="loading-fill" />
    </div>
  );
}
```

```css
.loading-bar {
  height: 4px;
  overflow: hidden;
  background: #ddd;
  position: relative;
}

.loading-fill {
  position: absolute;

  height: 100%;
  width: 30%;

  background: #2563eb;

  animation: loading 1s infinite;
}

@keyframes loading {
  from {
    left: -30%;
  }

  to {
    left: 100%;
  }
}
```

Usage

```tsx
<LoadingProgress />
```

***

# 6. Segmented Progress Bar

```tsx
interface Props {
  total: number;
  completed: number;
}

export default function SegmentedProgress({
  total,
  completed,
}: Props) {
  return (
    <div className="segments">
      {Array.from({
        length: total,
      }).map(
        (_, index) => (
          <div
            key={index}
            className={`segment ${
              index <
              completed
                ? "done"
                : ""
            }`}
          />
        )
      )}
    </div>
  );
}
```

```css
.segments {
  display: flex;
  gap: 6px;
}

.segment {
  width: 40px;
  height: 10px;
  background: #ddd;
}

.segment.done {
  background: #22c55e;
}
```

Usage

```tsx
<SegmentedProgress
  total={10}
  completed={6}
/>
```

***

# Design System Version

A production-ready component would expose:

```tsx
<Progress
  variant="linear"
  value={70}
/>

<Progress
  variant="circular"
  value={70}
/>

<Progress
  variant="step"
  currentStep={2}
  steps={4}
/>

<Progress
  variant="segmented"
  completed={6}
  total={10}
/>

<Progress
  variant="indeterminate"
/>
```

```ts
type ProgressVariant =
  | "linear"
  | "circular"
  | "step"
  | "segmented"
  | "indeterminate";
```

### Most Asked in Senior React Interviews

1. **Linear Progress with Start/Pause/Resume**
2. **Circular SVG Progress**
3. **Step Wizard Progress**
4. **File Upload Progress (Axios `onUploadProgress`)**
5. **Multi-file Progress Manager**
6. **Promise Scheduler + Progress Tracking**

These are the variants interviewers most frequently ask for in React, frontend machine-coding, and system design rounds.
