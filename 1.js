These are classic **JavaScript + React machine coding interview questions**. Here are complete solutions.

***

# 1. Return Sum of Two Numbers

```js
function sum(a, b) {
  return a + b;
}

console.log(sum(10, 20)); // 30
```

### Curried Version

```js
const sum = a => b => a + b;

console.log(sum(10)(20));
```

***

# 2. Convert Hours Into Minutes

```js
function hoursToMinutes(hours) {
  return hours * 60;
}

console.log(hoursToMinutes(2));
// 120
```

***

# 3. Convert Minutes Into Seconds

```js
function minutesToSeconds(minutes) {
  return minutes * 60;
}

console.log(minutesToSeconds(5));
// 300
```

***

# 4. Return Next Integer

```js
function nextNumber(num) {
  return num + 1;
}

console.log(nextNumber(10));
// 11
```

***

# 5. Sum Numbers From 1 to N

### Loop

```js
function sumToN(n) {
  let total = 0;

  for (let i = 1; i <= n; i++) {
    total += i;
  }

  return total;
}

console.log(sumToN(5));
// 15
```

### Mathematical Formula

```js
function sumToN(n) {
  return (n * (n + 1)) / 2;
}

console.log(sumToN(5));
// 15
```

***

# 6. Link Previewer (React)

### Features

```text
✅ URL Input
✅ Fetch Preview Data
✅ Show Title
✅ Description
✅ Image
```

### App.jsx

```jsx
import { useState } from "react";

export default function LinkPreviewer() {
  const [url, setUrl] = useState("");

  const [preview, setPreview] =
    useState(null);

  const fetchPreview = async () => {
    try {
      const response =
        await fetch(
          `/api/preview?url=${encodeURIComponent(
            url
          )}`
        );

      const data =
        await response.json();

      setPreview(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        value={url}
        placeholder="Enter URL"
        onChange={e =>
          setUrl(e.target.value)
        }
      />

      <button
        onClick={fetchPreview}
      >
        Preview
      </button>

      {preview && (
        <div className="card">
          <img
            src={preview.image}
            alt={preview.title}
          />

          <h3>
            {preview.title}
          </h3>

          <p>
            {
              preview.description
            }
          </p>
        </div>
      )}
    </div>
  );
}
```

### Interview Discussion

Real-world version often requires:

```text
Backend Scraper
OpenGraph Metadata
Caching
Error Handling
Skeleton Loading
```

***

# 7. Full Screen Modal (React)

### App.jsx

```jsx
import { useState } from "react";

export default function App() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
      >
        Open Modal
      </button>

      {open && (
        <FullScreenModal
          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}

function FullScreenModal({
  onClose,
}) {
  return (
    <div className="overlay">
      <div className="modal">
        <button
          className="close"
          onClick={onClose}
        >
          ✕
        </button>

        <h1>
          Full Screen Modal
        </h1>

        <p>
          Modal Content
        </p>
      </div>
    </div>
  );
}
```

### CSS

```css
.overlay {
  position: fixed;
  inset: 0;

  background: rgba(
    0,
    0,
    0,
    0.7
  );

  z-index: 999;
}

.modal {
  width: 100vw;
  height: 100vh;

  background: white;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
}
```

***

# React Interview Enhancements

### Link Previewer

```text
✅ Debounce URL Input
✅ Error Handling
✅ Skeleton Loader
✅ Caching
✅ OpenGraph Metadata
✅ Preview Cards
```

### Full Screen Modal

```text
✅ Portal
✅ ESC Close
✅ Focus Trap
✅ Scroll Lock
✅ Animations
✅ Accessibility
✅ Nested Modal Support
```

### Common Follow-up Questions

```text
✅ URL Shortener
✅ Infinite Modal Stack
✅ Lightbox Gallery
✅ Full Screen Image Viewer
✅ YouTube Preview Modal
✅ PDF Preview Modal
✅ Document Viewer Modal
```

These are all popular frontend machine-coding questions asked in React interviews from junior to senior levels.
