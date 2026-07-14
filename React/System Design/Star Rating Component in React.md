# Star Rating Component in React

## System Design + Complete Interview-Ready Code

Rating components are one of the most common **React machine coding interview questions**.

Used in:

```txt
Amazon
Flipkart
Zomato
Google Play
Netflix
YouTube (Thumbs)
```

Interviewers ask this because it covers:

✅ React fundamentals

✅ Reusability

✅ Controlled + Uncontrolled

✅ Event handling

✅ Accessibility

✅ Custom hover behavior

✅ Half-star support

✅ Read-only mode

✅ Custom size/color

---

# 1. Requirements

## Basic

✅ 5-star rating

✅ Hover preview

✅ Click to set rating

✅ Reset rating

✅ Read-only mode

## Advanced (Bonus)

✅ Half-star support

✅ Custom icon

✅ Custom max (10 stars)

✅ Accessibility

✅ Keyboard support

✅ Async submit rating

---

# 2. Component Structure

```txt
StarRating
   │
   ├── Star (individual)
   │
   ├── Value state
   ├── Hover state
   ├── ReadOnly flag
   └── onChange callback
```

---

# 3. Data Model

```jsx
<StarRating
  value={3}
  onChange={fn}
  max={5}
  size={24}
  readOnly={false}
  allowHalf={false}
/>
```

---

# 4. Base Component (Full Star)

```jsx
import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 24,
  readOnly = false,
}) {
  const [hover, setHover] = useState(0);

  const displayValue = hover || value;

  function handleClick(starIndex) {
    if (readOnly) return;

    onChange(starIndex);
  }

  function handleMouseEnter(starIndex) {
    if (readOnly) return;

    setHover(starIndex);
  }

  function handleMouseLeave() {
    if (readOnly) return;

    setHover(0);
  }

  return (
    <div className="star-rating" role="group" aria-label="Star rating">
      {Array.from({ length: max }, (_, index) => {
        const starIndex = index + 1;

        const filled = starIndex <= displayValue;

        return (
          <span
            key={starIndex}
            role="button"
            aria-label={`${starIndex} star`}
            aria-pressed={filled}
            tabIndex={0}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                handleClick(starIndex);
              }
            }}
            style={{
              fontSize: size,
              cursor: readOnly ? "default" : "pointer",
              color: filled ? "#facc15" : "#e5e7eb",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
```

---

# 5. Usage Example

```jsx
import { useState } from "react";
import StarRating from "./StarRating";

export default function App() {
  const [rating, setRating] = useState(0);

  return (
    <div className="container">
      <h2>Rate this product</h2>

      <StarRating value={rating} onChange={setRating} />

      <p>Your rating: {rating}</p>
    </div>
  );
}
```

---

# 6. CSS

```css
.container {
  padding: 20px;
  font-family: Arial;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star-rating span:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

# 7. How It Works

```txt
User Hovers Star 3
      │
      ▼
setHover(3)
      │
      ▼
displayValue = 3
      │
      ▼
Stars 1,2,3 → filled
Stars 4,5   → empty

User Clicks Star 3
      │
      ▼
onChange(3)
      │
      ▼
value = 3

Mouse Leaves
      │
      ▼
setHover(0)
      │
      ▼
displayValue = 3
```

---

# 8. Advanced Feature: Half-Star Support

Interviewers often ask for **half-star support**.

Approach:

Split each star into two halves:

```txt
Left Half → 0.5
Right Half → 1.0
```

---

## Half Star Star Component

```jsx
function Star({ index, value, hover, onSelect }) {
  const filledFull = (hover || value) >= index;

  const filledHalf =
    (hover || value) >= index - 0.5 && (hover || value) < index;

  return (
    <span className="star-wrapper">
      <span
        className="star-left"
        onMouseEnter={() => onSelect(index - 0.5, "hover")}
        onClick={() => onSelect(index - 0.5, "click")}
      />

      <span
        className="star-right"
        onMouseEnter={() => onSelect(index, "hover")}
        onClick={() => onSelect(index, "click")}
      />

      <span
        className={`star ${
          filledFull ? "full" : filledHalf ? "half" : "empty"
        }`}
      >
        ★
      </span>
    </span>
  );
}
```

---

## CSS

```css
.star-wrapper {
  position: relative;
  display: inline-block;
  font-size: 32px;
}

.star-left,
.star-right {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 2;
  cursor: pointer;
}

.star-left {
  left: 0;
}

.star-right {
  right: 0;
}

.star.full {
  color: #facc15;
}

.star.half {
  background: linear-gradient(to right, #facc15 50%, #e5e7eb 50%);

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.star.empty {
  color: #e5e7eb;
}
```

---

## Usage With Half Stars

```jsx
<StarRating value={3.5} allowHalf />
```

Result:

```txt
★★★½☆
```

---

# 9. Async Rating Submission

Real applications submit rating to server.

Example:

```jsx
async function handleSubmit(newValue) {
  setRating(newValue);

  try {
    await fetch("/api/rate", {
      method: "POST",
      body: JSON.stringify({
        rating: newValue,
      }),
    });
  } catch (error) {
    console.error("Failed to submit rating");
  }
}
```

---

# 10. Extensions

### ✅ Multiple Icons

```jsx
icon={<Heart />}
```

Custom SVG/emoji.

---

### ✅ Custom Max

```jsx
max={10}
```

Netflix-style.

---

### ✅ Read-Only

```jsx
<StarRating value={4.2} readOnly />
```

Great for showing average ratings.

---

### ✅ Persistent Ratings

Save to:

```txt
LocalStorage
Backend API
```

---

### ✅ Animated Star

Use:

```txt
framer-motion
```

---

### ✅ Rating with Tooltips

Hover:

```txt
1 - Bad
2 - Poor
3 - Average
4 - Good
5 - Excellent
```

---

# 11. Complexity

## Time

```txt
Render → O(n)
```

where `n = max`.

## Space

```txt
State → O(1)
```

Extremely lightweight.

---

# 12. Accessibility

✅ `role="button"`

✅ `aria-pressed`

✅ `aria-label`

✅ Keyboard support (Enter / Space)

✅ Focus visible

Users with screen readers can rate too.

---

# 13. Senior React Interview Answer

> I would design a rating component as a reusable, controlled component that accepts `value`, `onChange`, `max`, `size`, `readOnly`, and optional `allowHalf` props. Internal state stores the hovered star to preview ratings before selection. Each star supports mouse and keyboard interactions with proper ARIA labels, `role="button"`, and focus styles. For advanced use, I add half-star support by dividing each star into left and right halves, computing filled state using thresholds like `index - 0.5`. In production, I would extend this with async server submission, custom icons, animated feedback, tooltips, and persistent storage — the exact pattern used in Amazon product ratings, Zomato restaurant ratings, and Google Play reviews.

# Star Rating – Advanced Features

### Half-Star Support • Keyboard Accessibility • Async Submission

These are the **three most common Senior React interview follow-ups** after implementing a basic star rating component.

They convert the component into a **production-grade, accessible, enterprise-ready rating widget** similar to Amazon, Zomato, or Google Play.

---

# 1. Half-Star Support

## Why?

Users expect precise ratings:

```txt
2.5 ★
3.5 ★
4.5 ★
```

Full-star-only widgets feel limited.

---

## Approach

Each star is split into **two halves**:

```txt
Left Half  → +0.5
Right Half → +1.0
```

Hovering or clicking:

```txt
Left  → sets value = index - 0.5
Right → sets value = index
```

---

## Star Sub-Component

```jsx
function Star({ index, value, hover, onSelect, onHover, onLeave, size }) {
  const rating = hover || value;

  const filledFull = rating >= index;

  const filledHalf = rating >= index - 0.5 && rating < index;

  return (
    <span
      className="star-wrapper"
      style={{
        fontSize: size,
      }}
    >
      {/* Left Half */}
      <span
        className="half-hitbox left"
        onMouseEnter={() => onHover(index - 0.5)}
        onMouseLeave={onLeave}
        onClick={() => onSelect(index - 0.5)}
      />

      {/* Right Half */}
      <span
        className="half-hitbox right"
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
        onClick={() => onSelect(index)}
      />

      {/* Star Icon */}
      <span
        className={`star ${
          filledFull ? "full" : filledHalf ? "half" : "empty"
        }`}
      >
        ★
      </span>
    </span>
  );
}
```

---

## Half Star CSS

```css
.star-wrapper {
  position: relative;
  display: inline-block;
  font-size: 32px;
  margin-right: 4px;
}

.half-hitbox {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 2;
  cursor: pointer;
}

.left {
  left: 0;
}

.right {
  right: 0;
}

.star.full {
  color: #facc15;
}

.star.empty {
  color: #e5e7eb;
}

.star.half {
  background: linear-gradient(to right, #facc15 50%, #e5e7eb 50%);

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

---

## Example

Rating = 3.5

```txt
★★★½☆
```

Rating = 2.5

```txt
★★½☆☆
```

Rating = 4

```txt
★★★★☆
```

Perfect for real-world use.

---

# 2. Keyboard Accessibility

Users must be able to rate using:

```txt
Tab      → Focus rating
Arrow →  Increase
Arrow ←  Decrease
Home     → Set 1
End      → Set Max
Space    → Confirm
```

Aligns with:

```txt
WCAG 2.1
ARIA
Screen readers
```

---

## Add Focusable Wrapper

```jsx
<div
  className="star-rating"
  role="slider"
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
```

---

## Keyboard Handler

```jsx
function handleKeyDown(event) {
  if (readOnly) return;

  const step = allowHalf ? 0.5 : 1;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowUp":
      event.preventDefault();

      onChange(Math.min(value + step, max));
      break;

    case "ArrowLeft":
    case "ArrowDown":
      event.preventDefault();

      onChange(Math.max(value - step, 0));
      break;

    case "Home":
      onChange(0);
      break;

    case "End":
      onChange(max);
      break;

    default:
      break;
  }
}
```

---

## Add Focus Style

```css
.star-rating:focus {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
  border-radius: 4px;
}
```

---

## Screen Reader Announcement

```jsx
<span className="sr-only" aria-live="polite">
  {value}
  stars selected
</span>
```

Announces:

```txt
3.5 stars selected
```

---

# 3. Async Rating Submission

Real applications submit ratings to a server.

Examples:

```txt
Amazon Products
Uber Trips
Airbnb Stays
Zomato Restaurants
```

---

## Requirements

✅ Show loading state

✅ Handle errors

✅ Prevent duplicate submissions

✅ Cancel previous request

✅ Rollback if failed

---

## API Function

```jsx
export async function submitRating(productId, rating, signal) {
  const response = await fetch(`/api/rate/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to submit rating");
  }

  return response.json();
}
```

---

## App Component

```jsx
import { useState, useRef } from "react";

import StarRating from "./StarRating";

import { submitRating } from "./api";

export default function App() {
  const [rating, setRating] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  async function handleRatingChange(newValue) {
    const previousRating = rating;

    setRating(newValue);

    setLoading(true);

    setError(null);

    abortRef.current?.abort();

    const controller = new AbortController();

    abortRef.current = controller;

    try {
      await submitRating("product-1", newValue, controller.signal);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);

        // Rollback
        setRating(previousRating);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <StarRating value={rating} onChange={handleRatingChange} allowHalf />

      {loading && <p>Submitting...</p>}

      {error && <p className="error">{error}</p>}

      <p>Rating: {rating}</p>
    </div>
  );
}
```

---

## Async Flow

```txt
User clicks 4.5
      │
      ▼
setRating(4.5)
      │
      ▼
Abort Previous Request
      │
      ▼
Submit Rating API
      │
      ▼
Success → Keep 4.5

Failure → Rollback to previous value
```

---

## Optimistic UI Pattern

Rate immediately.

Then rollback if server rejects.

Used by:

```txt
Amazon
Instagram
Twitter
Uber
```

---

# Advanced Extensions

✅ Prevent multiple rapid clicks (debounce)

✅ Confirm rating before submit

✅ Retry failed requests using exponential backoff

✅ Toast notifications on success/failure

✅ Save rating in localStorage as backup

✅ Provide "already rated" indication

✅ Show total number of reviews

---

# Final Architecture

```txt
Rating Component
      │
      ▼
Half Star Logic
      │
      ▼
Keyboard Support
      │
      ▼
Focus State
      │
      ▼
ARIA Roles
      │
      ▼
onChange Handler
      │
      ▼
Async Submission
      │
      ▼
Abort Controller
      │
      ▼
Optimistic Update
      │
      ▼
Success / Rollback
```

---

# Senior React Interview Answer

> To make the rating component production-ready, I add three critical features. First, half-star support by dividing each star into two clickable halves, allowing precise ratings like 2.5 or 4.5. Second, full keyboard accessibility using `role="slider"`, `aria-valuenow`, focus styles, and Arrow, Home, and End keys, ensuring the widget is usable by screen readers and keyboard-only users. Third, asynchronous submission with optimistic UI updates, request cancellation via AbortController, error rollback, and loading indicators. Combined with debounce protection, retry logic, and toast notifications, this design mirrors real-world rating flows used by Amazon, Zomato, and Airbnb, delivering a fast, accessible, and resilient user experience.

# Star Rating – Reset & Read-Only Mode

## Complete Interview-Ready Implementation

These are two of the most commonly asked **follow-up features** in a React frontend interview after building the star rating component.

---

# 1. Reset Rating

## Why?

Users often want to:

✅ Clear their rating

✅ Change their mind

✅ Undo a click

✅ Start over

Common in:

```txt
Product Reviews
Feedback Forms
Survey Cards
Refund Ratings
Comment Ratings
```

---

## Approach

Add a **Reset button** or allow clicking the same star to reset.

Two Options:

### Option 1: Reset Button

```jsx
<button onClick={() => onChange(0)}>Reset</button>
```

### Option 2: Click Same Star to Reset

If user clicks the currently selected star, reset it to 0.

Very intuitive UX.

Example:

```txt
Current Rating = 3
Click Star 3 → Reset to 0
```

---

## Reset Logic Inside Component

```jsx
function handleClick(newValue) {
  if (readOnly) return;

  if (value === newValue) {
    onChange(0);
  } else {
    onChange(newValue);
  }
}
```

---

## Reset Button UI

```jsx
{
  value > 0 && !readOnly && (
    <button className="reset-btn" onClick={() => onChange(0)}>
      Reset
    </button>
  );
}
```

---

## CSS

```css
.reset-btn {
  background: transparent;
  border: 1px solid #d1d5db;

  padding: 4px 10px;
  border-radius: 6px;

  cursor: pointer;
  color: #374151;

  font-size: 14px;
}

.reset-btn:hover {
  background: #f3f4f6;
}
```

---

## Behaviour

```txt
Value = 4
      ↓
Click Reset
      ↓
Value = 0

Or

Value = 3
      ↓
Click Star 3
      ↓
Value = 0
```

---

## Keyboard Reset

Extend keyboard handler:

```jsx
case "Delete":
case "Backspace":

  onChange(0);
  break;
```

Very useful for accessibility.

---

## Confirm Reset (Optional)

For destructive actions:

```jsx
function handleReset() {
  const confirmed = window.confirm("Reset rating?");

  if (confirmed) {
    onChange(0);
  }
}
```

---

# 2. Read-Only Mode

## Why?

Display existing ratings without user interaction.

Examples:

```txt
Product Cards
Reviews List
Restaurant Ratings
Movie IMDb Rating
Course Rating
User Testimonial
```

Users must **see, not click**.

---

## Approach

Add a `readOnly` prop.

When true:

✅ Hover disabled

✅ Click disabled

✅ Keyboard disabled

✅ Focus visible removed

✅ Cursor changed

✅ Reset button hidden

---

## Read-Only Logic

Already partially built in previous code:

```jsx
if (readOnly) return;
```

---

## Usage Example

```jsx
<StarRating value={4.2} readOnly />
```

Displays:

```txt
★★★★☆
```

Not interactive.

---

## Read-Only Behaviour

```txt
Hover → nothing happens
Click → nothing happens
Keyboard → disabled
Focus → optional
```

---

## Cursor Update

```jsx
style={{
  cursor: readOnly
    ? "default"
    : "pointer"
}}
```

---

## Prevent Focus Ring

```jsx
tabIndex={readOnly ? -1 : 0}
```

Removes tab focus.

---

## Hide Reset Button

```jsx
{
  value > 0 && !readOnly && <button>Reset</button>;
}
```

---

## Prevent Keyboard Handling

```jsx
onKeyDown={
  readOnly
    ? undefined
    : handleKeyDown
}
```

---

## Best Practice: Show Average Rating

Common product-card usage:

```jsx
<StarRating
  value={3.5}
  allowHalf
  readOnly
/>

<p>
  3.5 out of 5 (240 reviews)
</p>
```

---

## Optional Tooltip

Show info on hover in read-only mode:

```jsx
<div title={`Average rating: ${value}`}>
  <StarRating value={value} readOnly />
</div>
```

---

# Full Enhanced Component

```jsx
import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 24,
  readOnly = false,
  allowHalf = false,
  showReset = true,
}) {
  const [hover, setHover] = useState(0);

  const displayValue = hover || value;

  function handleClick(newValue) {
    if (readOnly) return;

    if (value === newValue) {
      onChange(0);
    } else {
      onChange(newValue);
    }
  }

  function handleKeyDown(event) {
    if (readOnly) return;

    const step = allowHalf ? 0.5 : 1;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();

        onChange(Math.min(value + step, max));
        break;

      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();

        onChange(Math.max(value - step, 0));
        break;

      case "Home":
        onChange(0);
        break;

      case "End":
        onChange(max);
        break;

      case "Delete":
      case "Backspace":
        onChange(0);
        break;

      default:
        break;
    }
  }

  return (
    <div
      className="star-rating"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={handleKeyDown}
      style={{
        cursor: readOnly ? "default" : "pointer",
      }}
    >
      {Array.from({ length: max }, (_, index) => {
        const starIndex = index + 1;

        const filled = starIndex <= displayValue;

        return (
          <span
            key={starIndex}
            onMouseEnter={() => !readOnly && setHover(starIndex)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => handleClick(starIndex)}
            style={{
              fontSize: size,
              color: filled ? "#facc15" : "#e5e7eb",
            }}
          >
            ★
          </span>
        );
      })}

      {showReset && !readOnly && value > 0 && (
        <button className="reset-btn" onClick={() => onChange(0)}>
          Reset
        </button>
      )}
    </div>
  );
}
```

---

# Usage Examples

## Editable

```jsx
<StarRating value={rating} onChange={setRating} allowHalf />
```

---

## Read-Only

```jsx
<StarRating value={4.2} readOnly allowHalf />
```

---

## Reset Only

```jsx
<StarRating value={rating} onChange={setRating} showReset />
```

---

# Behaviour Flow

## Reset

```txt
Rating = 4
      ↓
Click Reset OR Press Delete
      ↓
Rating = 0
```

---

## Read-Only

```txt
Rating = 3.5
      ↓
Hover → No effect
Click → No effect
Keyboard → Disabled
```

---

# Senior React Interview Answer

> For a production-ready star rating component, I add two important features. First, a **reset mechanism** that allows the user to clear their rating either by clicking a Reset button, pressing Delete/Backspace on the keyboard, or clicking the same star again — offering intuitive UX consistent with Amazon and Zomato. Second, a **read-only mode** which disables all mouse, click, and keyboard interactions, updates the cursor, removes focus states, and hides the Reset button. This mode is essential for displaying static ratings on product cards or review lists. Combined with half-star support, keyboard accessibility, and async submission, this component becomes a fully accessible, reusable, and production-grade rating widget suitable for enterprise applications.
