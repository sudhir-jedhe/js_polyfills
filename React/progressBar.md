# Progress Bar Component (React)

### Features Covered

✅ Clamp value (0–100)

✅ Dynamic Width

✅ Dynamic Background Colour

✅ Optional Value Display

✅ Dynamic Text Colour

✅ Accessibility (ARIA)

✅ 4 Progress Bars

✅ Random Button

✅ Console Warning for Invalid Values

✅ Production Ready

***

## Progress.jsx

```jsx
import React from "react";

export default function Progress({
  value,
  showValue = false,
}) {
  let clampedValue = value;

  if (value < 0) {
    console.warn(
      "Progress value cannot be below 0"
    );
    clampedValue = 0;
  }

  if (value > 100) {
    console.warn(
      "Progress value cannot exceed 100"
    );
    clampedValue = 100;
  }

  let bgColor = "bg-red-500";

  if (clampedValue >= 70) {
    bgColor = "bg-green-500";
  } else if (
    clampedValue >= 30
  ) {
    bgColor = "bg-yellow-500";
  }

  const textColor =
    clampedValue > 50
      ? "white"
      : "black";

  return (
    <div
      className="progress-wrapper"
      style={{
        width: "100%",
        height: "30px",
        background:
          "#e5e7eb",
        borderRadius:
          "8px",
        overflow:
          "hidden",
      }}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={
          clampedValue
        }
        className={bgColor}
        style={{
          width: `${clampedValue}%`,
          height: "100%",
          transition:
            "width 0.3s ease",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          background:
            clampedValue >=
            70
              ? "#22c55e"
              : clampedValue >=
                30
              ? "#eab308"
              : "#ef4444",
          color:
            textColor,
          fontWeight:
            "bold",
        }}
      >
        {showValue &&
          `${clampedValue}%`}
      </div>
    </div>
  );
}
```

***

## App.jsx

```jsx
import React, {
  useState,
} from "react";

import Progress from "./Progress";

function randomValue() {
  return Math.floor(
    Math.random() * 101
  );
}

export default function App() {
  const [
    values,
    setValues,
  ] = useState([
    randomValue(),
    randomValue(),
    randomValue(),
    randomValue(),
  ]);

  const generateRandom =
    () => {
      setValues([
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ]);
    };

  return (
    <div
      style={{
        maxWidth:
          "700px",
        margin:
          "40px auto",
      }}
    >
      <h1>
        Progress Bar Demo
      </h1>

      <button
        onClick={
          generateRandom
        }
      >
        Random
      </button>

      <div
        style={{
          marginTop:
            "20px",
          display:
            "flex",
          flexDirection:
            "column",
          gap: "16px",
        }}
      >
        <Progress
          value={values[0]}
          showValue
        />

        <Progress
          value={values[1]}
          showValue
        />

        <Progress
          value={values[2]}
          showValue
        />

        <Progress
          value={values[3]}
          showValue
        />
      </div>
    </div>
  );
}
```

***

# Test Cases Covered

### Clamp Below 0

```jsx
<Progress value={-10} />
```

Result:

```text
0%
console.warn()
```

***

### Clamp Above 100

```jsx
<Progress value={120} />
```

Result:

```text
100%
console.warn()
```

***

### Colour Rules

```text
0 → 29     → bg-red-500

30 → 69    → bg-yellow-500

70 → 100   → bg-green-500
```

***

### Text Colour Rules

```text
value > 50
    white

value <= 50
    black
```

***

### Accessibility

```jsx
role="progressbar"

aria-valuemin="0"

aria-valuemax="100"

aria-valuenow={clampedValue}
```

***

# Senior-Level Enhancements

```text
✅ Animated Progress

✅ useSpring (Framer Motion)

✅ Segmented Progress

✅ Circular Progress

✅ Buffer Progress

✅ Indeterminate Loader

✅ Accessibility Announcements

✅ Theme Support

✅ Custom Color API
```

### Interview Answer

> I clamp the incoming value to avoid invalid states, derive colour and text colour from the clamped value, expose accessibility attributes through WAI-ARIA, and keep the component reusable via a simple API (`value`, `showValue`). The parent component owns the state and updates all progress bars through a random generator, making the Progress component fully presentational and easy to reuse.
