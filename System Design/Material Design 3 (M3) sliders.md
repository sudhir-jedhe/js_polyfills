Material Design 3 (M3) sliders differ significantly from legacy sliders. Key M3 design tokens and behaviors include:

1. **Thick Track**: A prominent $16\text{px}$ track with rounded ends ($8\text{px}$ radius).
2. **Active vs. Inactive Gap**: A distinct visual stop/gap (usually $4\text{px}\text{–}6\text{px}$) separating the active track, thumb, and inactive track.
3. **Handle / Thumb Shape**: A vertical pill ($4\text{px}\text{–}6\text{px}$ wide, $44\text{px}$ tall) with an optional floating Value Indicator/Tooltip that springs up on drag/hover.
4. **Interactive States**: Smooth hover/focus rings, keyboard step adjustments, and tick marks for discrete modes.

---

### Complete Implementation (React + CSS/Tailwind)

```tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface M3SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showTicks?: boolean;
  formatValue?: (val: number) => string | number;
  label?: string;
}

export const Material3Slider: React.FC<M3SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  disabled = false,
  showTicks = false,
  formatValue = (v) => v,
  label = 'Volume slider',
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const percentage = Math.min(100, Math.max(0, ((currentValue - min) / (max - min)) * 100));

  const updateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const rawRatio = (clientX - rect.left) / rect.width;
      const clampedRatio = Math.max(0, Math.min(1, rawRatio));
      
      const rawVal = min + clampedRatio * (max - min);
      const steppedVal = Math.round((rawVal - min) / step) * step + min;
      const finalVal = Math.min(max, Math.max(min, Number(steppedVal.toFixed(4))));

      if (!isControlled) {
        setInternalValue(finalVal);
      }
      onChange?.(finalVal);
    },
    [min, max, step, disabled, isControlled, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValueFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValueFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Keyboard Accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let nextVal = currentValue;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        nextVal = Math.min(max, currentValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        nextVal = Math.max(min, currentValue - step);
        break;
      case 'PageUp':
        nextVal = Math.min(max, currentValue + step * 10);
        break;
      case 'PageDown':
        nextVal = Math.max(min, currentValue - step * 10);
        break;
      case 'Home':
        nextVal = min;
        break;
      case 'End':
        nextVal = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    if (!isControlled) setInternalValue(nextVal);
    onChange?.(nextVal);
  };

  // Calculate discrete tick marks
  const tickCount = step > 0 && showTicks ? Math.floor((max - min) / step) : 0;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (i * step) / (max - min));

  return (
    <div
      className={`relative flex items-center select-none touch-none w-full h-12 ${
        disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Hidden input for forms & screen readers */}
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        className="sr-only"
      />

      {/* Track Base Container */}
      <div ref={trackRef} className="relative w-full h-4 rounded-full overflow-visible">
        {/* Inactive Track (M3 Surface Container Highest) */}
        <div className="absolute inset-0 bg-[#e6e0e9] dark:bg-[#49454f] rounded-full" />

        {/* Active Track (M3 Primary Fill with Gap offset) */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#6750a4] dark:bg-[#d0bcff] rounded-l-full transition-all duration-75"
          style={{
            width: `calc(${percentage}% - ${percentage > 0 ? 6 : 0}px)`,
          }}
        />

        {/* Optional Discrete Ticks */}
        {showTicks &&
          ticks.map((t, index) => {
            const isFilled = t * 100 <= percentage;
            return (
              <div
                key={index}
                className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full pointer-events-none transition-colors ${
                  isFilled
                    ? 'bg-[#eaddff] dark:bg-[#381e72]'
                    : 'bg-[#49454f] dark:bg-[#cac4d0]'
                }`}
                style={{ left: `${t * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
            );
          })}

        {/* M3 Thumb Pill / Handle Container */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-75"
          style={{ left: `${percentage}%` }}
        >
          {/* Outer Ripple / Hover State Halo */}
          <div
            className={`absolute -inset-2.5 rounded-full pointer-events-none transition-all duration-200 ${
              isDragging
                ? 'bg-[#6750a4]/16 dark:bg-[#d0bcff]/16 scale-125'
                : isHovered
                ? 'bg-[#6750a4]/8 dark:bg-[#d0bcff]/8 scale-100'
                : 'scale-0'
            }`}
          />

          {/* M3 Handle Pill Bar */}
          <div
            className={`w-1.5 h-11 rounded-full shadow-sm transition-all duration-150 ${
              disabled
                ? 'bg-[#1d1b20]/38 dark:bg-[#e6e0e9]/38'
                : 'bg-[#6750a4] dark:bg-[#d0bcff]'
            } ${isDragging ? 'h-12 w-2' : ''}`}
          />

          {/* M3 Floating Value Indicator (Tooltip Badge) */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 px-3 py-1.5 rounded-full bg-[#6750a4] dark:bg-[#d0bcff] text-white dark:text-[#381e72] text-xs font-medium tracking-wide shadow-md pointer-events-none transition-all duration-150 origin-bottom ${
              isDragging || isHovered
                ? 'scale-100 opacity-100 -translate-y-0'
                : 'scale-75 opacity-0 translate-y-2'
            }`}
          >
            {formatValue(currentValue)}
            {/* Tooltip triangle tail */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#6750a4] dark:border-t-[#d0bcff]" />
          </div>
        </div>
      </div>
    </div>
  );
};

```

---

### M3 Specification Breakdown

| Element                 | M3 Token Standard                                                        | Implementation Detail                                                                                |
| ----------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Track Height**        | $16\text{px}$ (`h-4`)                                                    | Rounded full capsule with distinct surface-container tokens.                                         |
| **Thumb Element**       | Vertical Handle Pill ($4\text{px}\text{–}6\text{px} \times 44\text{px}$) | Replaces legacy circular discs with a pill shape that expands slightly on active drag.               |
| **Active/Inactive Gap** | $6\text{px}$ visual separator                                            | Active track width is clamped by `calc(x% - 6px)` so it never collides directly into the thumb pill. |
| **Touch Target**        | $48\text{px} \times 48\text{px}$ minimum                                 | The wrapper utilizes an outer `h-12` bounding area for fluid pointer interaction on mobile devices.  |
| **Value Indicator**     | Floating bubble above thumb                                              | Shows formatted continuous or stepped values on drag/hover with spring-fade transitions.             |

Material Design 3 (M3) sliders differ significantly from legacy sliders. Key M3 design tokens and behaviors include:

1. **Thick Track**: A prominent $16\text{px}$ track with rounded ends ($8\text{px}$ radius).
2. **Active vs. Inactive Gap**: A distinct visual stop/gap (usually $4\text{px}\text{–}6\text{px}$) separating the active track, thumb, and inactive track.
3. **Handle / Thumb Shape**: A vertical pill ($4\text{px}\text{–}6\text{px}$ wide, $44\text{px}$ tall) with an optional floating Value Indicator/Tooltip that springs up on drag/hover.
4. **Interactive States**: Smooth hover/focus rings, keyboard step adjustments, and tick marks for discrete modes.

---

### Complete Implementation (React + CSS/Tailwind)

```tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface M3SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showTicks?: boolean;
  formatValue?: (val: number) => string | number;
  label?: string;
}

export const Material3Slider: React.FC<M3SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  disabled = false,
  showTicks = false,
  formatValue = (v) => v,
  label = 'Volume slider',
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const percentage = Math.min(100, Math.max(0, ((currentValue - min) / (max - min)) * 100));

  const updateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const rawRatio = (clientX - rect.left) / rect.width;
      const clampedRatio = Math.max(0, Math.min(1, rawRatio));
      
      const rawVal = min + clampedRatio * (max - min);
      const steppedVal = Math.round((rawVal - min) / step) * step + min;
      const finalVal = Math.min(max, Math.max(min, Number(steppedVal.toFixed(4))));

      if (!isControlled) {
        setInternalValue(finalVal);
      }
      onChange?.(finalVal);
    },
    [min, max, step, disabled, isControlled, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValueFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValueFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Keyboard Accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let nextVal = currentValue;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        nextVal = Math.min(max, currentValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        nextVal = Math.max(min, currentValue - step);
        break;
      case 'PageUp':
        nextVal = Math.min(max, currentValue + step * 10);
        break;
      case 'PageDown':
        nextVal = Math.max(min, currentValue - step * 10);
        break;
      case 'Home':
        nextVal = min;
        break;
      case 'End':
        nextVal = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    if (!isControlled) setInternalValue(nextVal);
    onChange?.(nextVal);
  };

  // Calculate discrete tick marks
  const tickCount = step > 0 && showTicks ? Math.floor((max - min) / step) : 0;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (i * step) / (max - min));

  return (
    <div
      className={`relative flex items-center select-none touch-none w-full h-12 ${
        disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Hidden input for forms & screen readers */}
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        className="sr-only"
      />

      {/* Track Base Container */}
      <div ref={trackRef} className="relative w-full h-4 rounded-full overflow-visible">
        {/* Inactive Track (M3 Surface Container Highest) */}
        <div className="absolute inset-0 bg-[#e6e0e9] dark:bg-[#49454f] rounded-full" />

        {/* Active Track (M3 Primary Fill with Gap offset) */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#6750a4] dark:bg-[#d0bcff] rounded-l-full transition-all duration-75"
          style={{
            width: `calc(${percentage}% - ${percentage > 0 ? 6 : 0}px)`,
          }}
        />

        {/* Optional Discrete Ticks */}
        {showTicks &&
          ticks.map((t, index) => {
            const isFilled = t * 100 <= percentage;
            return (
              <div
                key={index}
                className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full pointer-events-none transition-colors ${
                  isFilled
                    ? 'bg-[#eaddff] dark:bg-[#381e72]'
                    : 'bg-[#49454f] dark:bg-[#cac4d0]'
                }`}
                style={{ left: `${t * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
            );
          })}

        {/* M3 Thumb Pill / Handle Container */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-75"
          style={{ left: `${percentage}%` }}
        >
          {/* Outer Ripple / Hover State Halo */}
          <div
            className={`absolute -inset-2.5 rounded-full pointer-events-none transition-all duration-200 ${
              isDragging
                ? 'bg-[#6750a4]/16 dark:bg-[#d0bcff]/16 scale-125'
                : isHovered
                ? 'bg-[#6750a4]/8 dark:bg-[#d0bcff]/8 scale-100'
                : 'scale-0'
            }`}
          />

          {/* M3 Handle Pill Bar */}
          <div
            className={`w-1.5 h-11 rounded-full shadow-sm transition-all duration-150 ${
              disabled
                ? 'bg-[#1d1b20]/38 dark:bg-[#e6e0e9]/38'
                : 'bg-[#6750a4] dark:bg-[#d0bcff]'
            } ${isDragging ? 'h-12 w-2' : ''}`}
          />

          {/* M3 Floating Value Indicator (Tooltip Badge) */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 px-3 py-1.5 rounded-full bg-[#6750a4] dark:bg-[#d0bcff] text-white dark:text-[#381e72] text-xs font-medium tracking-wide shadow-md pointer-events-none transition-all duration-150 origin-bottom ${
              isDragging || isHovered
                ? 'scale-100 opacity-100 -translate-y-0'
                : 'scale-75 opacity-0 translate-y-2'
            }`}
          >
            {formatValue(currentValue)}
            {/* Tooltip triangle tail */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#6750a4] dark:border-t-[#d0bcff]" />
          </div>
        </div>
      </div>
    </div>
  );
};

```

---

### M3 Specification Breakdown

| Element                 | M3 Token Standard                                                        | Implementation Detail                                                                                |
| ----------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Track Height**        | $16\text{px}$ (`h-4`)                                                    | Rounded full capsule with distinct surface-container tokens.                                         |
| **Thumb Element**       | Vertical Handle Pill ($4\text{px}\text{–}6\text{px} \times 44\text{px}$) | Replaces legacy circular discs with a pill shape that expands slightly on active drag.               |
| **Active/Inactive Gap** | $6\text{px}$ visual separator                                            | Active track width is clamped by `calc(x% - 6px)` so it never collides directly into the thumb pill. |
| **Touch Target**        | $48\text{px} \times 48\text{px}$ minimum                                 | The wrapper utilizes an outer `h-12` bounding area for fluid pointer interaction on mobile devices.  |
| **Value Indicator**     | Floating bubble above thumb                                              | Shows formatted continuous or stepped values on drag/hover with spring-fade transitions.             |

Here is the complete **Material Design 3 Dual-Thumb Range Slider** component in React.

In M3 Range Sliders:

1. **Active Track**: Spans between Thumb 1 (start) and Thumb 2 (end).
2. **Gaps**: Both thumbs have visual $6\text{px}$ inner/outer gaps against the active and inactive track segments.
3. **Collision / Overlap Handling**: Thumbs cannot cross each other and maintain an optional minimum separation distance (`minDistance`).
4. **Independent Value Tooltips**: Each thumb displays its own floating value indicator on hover/drag.

---

### Complete Component (`Material3RangeSlider.tsx`)

```tsx
import React, { useState, useRef, useCallback } from 'react';

export interface M3RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  minDistance?: number;
  onChange?: (value: [number, number]) => void;
  disabled?: boolean;
  showTicks?: boolean;
  formatValue?: (val: number) => string | number;
  labelStart?: string;
  labelEnd?: string;
}

export const Material3RangeSlider: React.FC<M3RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = [20, 80],
  minDistance = 0,
  onChange,
  disabled = false,
  showTicks = false,
  formatValue = (v) => v,
  labelStart = 'Minimum range slider',
  labelEnd = 'Maximum range slider',
}) => {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const [activeThumb, setActiveThumb] = useState<'start' | 'end' | null>(null);
  const [hoveredThumb, setHoveredThumb] = useState<'start' | 'end' | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValues = isControlled ? controlledValue : internalValue;
  const [startVal, endVal] = currentValues;

  const startPercent = Math.min(100, Math.max(0, ((startVal - min) / (max - min)) * 100));
  const endPercent = Math.min(100, Math.max(0, ((endVal - min) / (max - min)) * 100));

  const getValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const rawRatio = (clientX - rect.left) / rect.width;
      const clampedRatio = Math.max(0, Math.min(1, rawRatio));
      const rawVal = min + clampedRatio * (max - min);
      const steppedVal = Math.round((rawVal - min) / step) * step + min;
      return Math.min(max, Math.max(min, Number(steppedVal.toFixed(4))));
    },
    [min, max, step]
  );

  const updateThumbValue = useCallback(
    (thumb: 'start' | 'end', nextVal: number) => {
      let nextStart = startVal;
      let nextEnd = endVal;

      if (thumb === 'start') {
        nextStart = Math.min(nextVal, endVal - minDistance);
        nextStart = Math.max(min, nextStart);
      } else {
        nextEnd = Math.max(nextVal, startVal + minDistance);
        nextEnd = Math.min(max, nextEnd);
      }

      const nextRange: [number, number] = [nextStart, nextEnd];
      if (!isControlled) {
        setInternalValue(nextRange);
      }
      onChange?.(nextRange);
    },
    [startVal, endVal, minDistance, min, max, isControlled, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const clickVal = getValueFromPointer(e.clientX);
    
    // Choose the closest thumb to the click position
    const distToStart = Math.abs(clickVal - startVal);
    const distToEnd = Math.abs(clickVal - endVal);
    const targetThumb = distToStart <= distToEnd ? 'start' : 'end';

    setActiveThumb(targetThumb);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateThumbValue(targetThumb, clickVal);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeThumb || disabled) return;
    const nextVal = getValueFromPointer(e.clientX);
    updateThumbValue(activeThumb, nextVal);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeThumb) return;
    setActiveThumb(null);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Keyboard controls for accessible slider handles
  const createKeyHandler = (thumb: 'start' | 'end') => (e: React.KeyboardEvent) => {
    if (disabled) return;
    const current = thumb === 'start' ? startVal : endVal;
    let next = current;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - step;
        break;
      case 'PageUp':
        next = current + step * 10;
        break;
      case 'PageDown':
        next = current - step * 10;
        break;
      case 'Home':
        next = thumb === 'start' ? min : startVal + minDistance;
        break;
      case 'End':
        next = thumb === 'end' ? max : endVal - minDistance;
        break;
      default:
        return;
    }

    e.preventDefault();
    updateThumbValue(thumb, next);
  };

  // Tick calculation for discrete slider steps
  const tickCount = step > 0 && showTicks ? Math.floor((max - min) / step) : 0;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (i * step) / (max - min));

  return (
    <div
      className={`relative flex items-center select-none touch-none w-full h-14 ${
        disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Hidden Accessibility Inputs */}
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={labelStart}
        aria-valuemin={min}
        aria-valuemax={endVal - minDistance}
        aria-valuenow={startVal}
        aria-disabled={disabled}
        onKeyDown={createKeyHandler('start')}
        className="sr-only"
      />
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={labelEnd}
        aria-valuemin={startVal + minDistance}
        aria-valuemax={max}
        aria-valuenow={endVal}
        aria-disabled={disabled}
        onKeyDown={createKeyHandler('end')}
        className="sr-only"
      />

      {/* Main Track Capsule */}
      <div ref={trackRef} className="relative w-full h-4 rounded-full overflow-visible">
        {/* Inactive Base Track (M3 Surface Container Highest) */}
        <div className="absolute inset-0 bg-[#e6e0e9] dark:bg-[#49454f] rounded-full" />

        {/* Active Connected Range Track with M3 Pill Gaps */}
        <div
          className="absolute top-0 bottom-0 bg-[#6750a4] dark:bg-[#d0bcff] transition-all duration-75"
          style={{
            left: `calc(${startPercent}% + 6px)`,
            width: `calc(${Math.max(0, endPercent - startPercent)}% - 12px)`,
          }}
        />

        {/* Optional Discrete Ticks */}
        {showTicks &&
          ticks.map((t, index) => {
            const isFilled = t * 100 >= startPercent && t * 100 <= endPercent;
            return (
              <div
                key={index}
                className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full pointer-events-none transition-colors ${
                  isFilled
                    ? 'bg-[#eaddff] dark:bg-[#381e72]'
                    : 'bg-[#49454f] dark:bg-[#cac4d0]'
                }`}
                style={{ left: `${t * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
            );
          })}

        {/* --- START THUMB --- */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-75 z-10"
          style={{ left: `${startPercent}%` }}
          onMouseEnter={() => setHoveredThumb('start')}
          onMouseLeave={() => setHoveredThumb(null)}
        >
          {/* Outer Ripple / Hover Ring */}
          <div
            className={`absolute -inset-2.5 rounded-full pointer-events-none transition-all duration-200 ${
              activeThumb === 'start'
                ? 'bg-[#6750a4]/16 dark:bg-[#d0bcff]/16 scale-125'
                : hoveredThumb === 'start'
                ? 'bg-[#6750a4]/8 dark:bg-[#d0bcff]/8 scale-100'
                : 'scale-0'
            }`}
          />

          {/* M3 Vertical Handle Bar */}
          <div
            className={`w-1.5 h-11 rounded-full shadow-sm transition-all duration-150 ${
              disabled
                ? 'bg-[#1d1b20]/38 dark:bg-[#e6e0e9]/38'
                : 'bg-[#6750a4] dark:bg-[#d0bcff]'
            } ${activeThumb === 'start' ? 'h-12 w-2' : ''}`}
          />

          {/* Floating Value Indicator */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1 rounded-full bg-[#6750a4] dark:bg-[#d0bcff] text-white dark:text-[#381e72] text-[11px] font-medium tracking-wide shadow-md pointer-events-none transition-all duration-150 origin-bottom ${
              activeThumb === 'start' || hoveredThumb === 'start'
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-75 opacity-0 translate-y-2'
            }`}
          >
            {formatValue(startVal)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#6750a4] dark:border-t-[#d0bcff]" />
          </div>
        </div>

        {/* --- END THUMB --- */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-75 z-10"
          style={{ left: `${endPercent}%` }}
          onMouseEnter={() => setHoveredThumb('end')}
          onMouseLeave={() => setHoveredThumb(null)}
        >
          {/* Outer Ripple / Hover Ring */}
          <div
            className={`absolute -inset-2.5 rounded-full pointer-events-none transition-all duration-200 ${
              activeThumb === 'end'
                ? 'bg-[#6750a4]/16 dark:bg-[#d0bcff]/16 scale-125'
                : hoveredThumb === 'end'
                ? 'bg-[#6750a4]/8 dark:bg-[#d0bcff]/8 scale-100'
                : 'scale-0'
            }`}
          />

          {/* M3 Vertical Handle Bar */}
          <div
            className={`w-1.5 h-11 rounded-full shadow-sm transition-all duration-150 ${
              disabled
                ? 'bg-[#1d1b20]/38 dark:bg-[#e6e0e9]/38'
                : 'bg-[#6750a4] dark:bg-[#d0bcff]'
            } ${activeThumb === 'end' ? 'h-12 w-2' : ''}`}
          />

          {/* Floating Value Indicator */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1 rounded-full bg-[#6750a4] dark:bg-[#d0bcff] text-white dark:text-[#381e72] text-[11px] font-medium tracking-wide shadow-md pointer-events-none transition-all duration-150 origin-bottom ${
              activeThumb === 'end' || hoveredThumb === 'end'
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-75 opacity-0 translate-y-2'
            }`}
          >
            {formatValue(endVal)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#6750a4] dark:border-t-[#d0bcff]" />
          </div>
        </div>
      </div>
    </div>
  );
};

```

---

### Key Behavioral Enhancements

* **Smart Click Target Routing**: When tapping anywhere on the track, the slider calculates `distToStart` vs `distToEnd` and binds pointer capture to the closest handle.
* **Dual Gap Offset**: The active segment uses `left: calc(start% + 6px)` and `width: calc((end% - start%) - 12px)` to maintain the Material 3 gap standard on both ends.
* **Collision Constraint**: Ensures `startVal <= endVal - minDistance` so handles never invert positions.
