# Image Carousel Variants (React)

Image carousel questions are extremely common in Senior React interviews. Interviewers often ask for **multiple variants**, autoplay, swipe support, lazy loading, accessibility, and different transition effects.

***

# 1. Basic Carousel

Features:

```text
✅ Previous
✅ Next
✅ Dots
✅ Loop
```

```jsx
import { useState } from "react";

function Carousel({ images }) {
  const [index, setIndex] =
    useState(0);

  const next = () =>
    setIndex(
      (prev) =>
        (prev + 1) %
        images.length
    );

  const prev = () =>
    setIndex(
      (prev) =>
        (prev -
          1 +
          images.length) %
        images.length
    );

  return (
    <div>
      {images[index]}

      <button
        onClick={prev}
      >
        Prev
      </button>

      <button
        onClick={next}
      >
        Next
      </button>

      <div>
        {images.map(
          (_, i) => (
            <button
              key={i}
              onClick={() =>
                setIndex(i)
              }
            >
              ●
            </button>
          )
        )}
      </div>
    </div>
  );
}
```

***

# 2. Fade Transition

Most commonly asked.

```jsx
{images[index]}
```

CSS

```css
.slide {
  opacity: 0;
  transition:
    opacity 0.5s ease;
}

.slide.active {
  opacity: 1;
}
```

Transition:

```text
Image A
↓ fade out
Image B
↓ fade in
```

***

# 3. Slide Transition

Netflix / Amazon style.

```jsx
<div
  className="track"
  style={{
    transform: `translateX(-${index * 100}%)`,
  }}
>
  {images.map(img => (
    {img}
  ))}
</div>
```

CSS

```css
.wrapper {
  overflow: hidden;
}

.track {
  display: flex;
  transition:
    transform
    400ms ease;
}
```

Effect:

```text
← Image
→ Image
```

***

# 4. AutoPlay Carousel

```jsx
useEffect(() => {
  const timer =
    setInterval(() => {
      next();
    }, 3000);

  return () =>
    clearInterval(timer);
}, []);
```

Features:

```text
Auto Slide Every 3s
```

***

# 5. Pause On Hover

```jsx
const [paused, setPaused] =
  useState(false);

useEffect(() => {
  if (paused) return;

  const timer =
    setInterval(next, 3000);

  return () =>
    clearInterval(timer);
}, [paused]);
```

```jsx
<div
  onMouseEnter={() =>
    setPaused(true)
  }
  onMouseLeave={() =>
    setPaused(false)
  }
/>
```

***

# 6. Infinite Carousel

Clone first and last slides.

```text
5 Slides

Clone Last
1
2
3
4
5
Clone First
```

Then reset:

```jsx
if (
  currentIndex ===
  images.length + 1
) {
  setTimeout(() => {
    setTransition(
      false
    );

    setIndex(1);
  }, 300);
}
```

Used by:

```text
Slick
Swiper
Embla
```

***

# 7. Swipe Carousel

Mobile Interview Favourite

```jsx
const [
  touchStart,
  setTouchStart,
] = useState(0);

const handleTouchStart =
  e => {
    setTouchStart(
      e
        .targetTouches[0]
        .clientX
    );
  };

const handleTouchEnd =
  e => {
    const end =
      e.changedTouches[0]
        .clientX;

    if (
      touchStart -
        end >
      50
    ) {
      next();
    }

    if (
      end -
        touchStart >
      50
    ) {
      prev();
    }
  };
```

***

# 8. Parallax Carousel

Apple-style animation.

```jsx
<div
  style={{
    transform:
      `translateX(${offset}px) scale(1.1)`,
  }}
>
```

Effects:

```text
Image moves slower
than content
```

***

# 9. Coverflow Carousel

Spotify / Apple Music style.

```jsx
transform:
 rotateY(40deg)
 scale(0.8);
```

Centre slide:

```text
Large

Sides smaller
```

***

# 10. 3D Cube Carousel

```css
transform:
 rotateY(90deg);
```

Effects:

```text
Cube rotates
between slides
```

***

# 11. Thumbnail Carousel

```text
┌────────────┐
│ Main Image │
└────────────┘

[1][2][3][4]
```

```jsx
{images.map(
  (img, i) => (
    {img} =>
        setIndex(i)
      }
    />
  )
)}
```

***

# 12. Zoom Carousel

E-commerce Product Gallery

```jsx
onMouseMove()
```

```css
transform: scale(2);
```

Used in:

```text
Amazon
Flipkart
Myntra
```

***

# 13. Virtualized Carousel

For 1000+ images.

Render:

```text
Previous
Current
Next
```

Only.

```jsx
const visible =
  images.slice(
    index - 1,
    index + 2
  );
```

***

# 14. Framer Motion Carousel (Senior)

```jsx
<motion.img
  key={index}
  initial={{
    opacity: 0,
    x: 100,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  exit={{
    opacity: 0,
    x: -100,
  }}
/>
```

Features:

```text
Smooth
Physics
Spring Animation
```

***

# Production Features

```text
✅ Keyboard Navigation

✅ Arrow Keys

✅ Accessibility

✅ Lazy Loading

✅ Image Preloading

✅ Autoplay

✅ Pause on Hover

✅ Indicators

✅ Swipe Support

✅ Infinite Loop

✅ Analytics Tracking

✅ Skeleton Loader

✅ Responsive Images

✅ Virtualisation
```

***

# Interview Question

### Difference Between Fade and Slide

```text
Fade
→ opacity animation

Slide
→ translateX animation
```

### Difference Between Infinite and Loop

```text
Loop
→ restart at first slide

Infinite
→ seamless transition
without jump
```

### Senior Architecture

```text
Base Carousel
   ↓
Transitions Strategy
   ↓
Fade
Slide
Cube
Coverflow
Zoom

(Strategy Pattern)
```

This is the approach typically expected in Senior React machine-coding rounds when asked to build a reusable, extensible image carousel with multiple transition variants.
# 🚀 Production-Ready React Image Carousel (Multiple Variants + Transitions)

Features:

```text
✅ Previous / Next
✅ Dots Navigation
✅ Autoplay
✅ Pause On Hover
✅ Keyboard Navigation
✅ Infinite Loop
✅ Fade Transition
✅ Slide Transition
✅ Zoom Transition
✅ Thumbnail Navigation
✅ Touch Swipe Support
✅ Accessibility
✅ Responsive
```

***

# App.jsx

```jsx
import React from "react";
import Carousel from "./Carousel";

const images = [
  "https://picsum.photos/id/1015/1000/500",
  "https://picsum.photos/id/1016/1000/500",
  "https://picsum.photos/id/1018/1000/500",
  "https://picsum.photos/id/1020/1000/500",
  "https://picsum.photos/id/1024/1000/500",
];

export default function App() {
  return (
    <div>
      <h1>Image Carousel Variants</h1>

      <Carousel
        images={images}
        variant="slide"
        autoPlay
        interval={3000}
      />

      {/* Other Variants */}

      {/* <Carousel images={images} variant="fade" /> */}

      {/* <Carousel images={images} variant="zoom" /> */}
    </div>
  );
}
```

***

# Carousel.jsx

```jsx
import React,
{
  useEffect,
  useRef,
  useState,
} from "react";

import "./carousel.css";

export default function Carousel({
  images,
  variant = "slide",
  autoPlay = false,
  interval = 3000,
}) {
  const [index, setIndex] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const touchStart =
    useRef(0);

  const next = () => {
    setIndex(prev =>
      (prev + 1) %
      images.length
    );
  };

  const prev = () => {
    setIndex(prev =>
      (prev -
        1 +
        images.length) %
      images.length
    );
  };

  // Auto Play

  useEffect(() => {
    if (
      !autoPlay ||
      paused
    )
      return;

    const timer =
      setInterval(
        next,
        interval
      );

    return () =>
      clearInterval(timer);
  }, [
    autoPlay,
    paused,
    interval,
  ]);

  // Keyboard

  useEffect(() => {
    const handleKey =
      e => {
        if (
          e.key ===
          "ArrowRight"
        ) {
          next();
        }

        if (
          e.key ===
          "ArrowLeft"
        ) {
          prev();
        }
      };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, []);

  // Swipe

  const handleTouchStart =
    e => {
      touchStart.current =
        e.targetTouches[0]
          .clientX;
    };

  const handleTouchEnd =
    e => {
      const end =
        e.changedTouches[0]
          .clientX;

      const diff =
        touchStart.current -
        end;

      if (diff > 50)
        next();

      if (diff < -50)
        prev();
    };

  return (
    <div
      className="carousel"
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={
        handleTouchEnd
      }
    >
      {/* Slides */}

      {variant ===
      "slide" ? (
        <div
          className="track"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {images.map(
            (
              image,
              i
            ) => (
              {image}
            )
          )}
        </div>
      ) : (
        images.map(
          (
            image,
            i
          ) => (
            {image}
          )
        )
      )}

      {/* Controls */}

      <button
        onClick={prev}
        className="nav prev"
      >
        ❮
      </button>

      <button
        onClick={next}
        className="nav next"
      >
        ❯
      </button>

      {/* Dots */}

      <div className="dots">
        {images.map(
          (_, i) => (
            <button
              key={i}
              className={
                index === i
                  ? "dot active-dot"
                  : "dot"
              }
              onClick={() =>
                setIndex(i)
              }
            />
          )
        )}
      </div>

      {/* Thumbnails */}

      <div className="thumbs">
        {images.map(
          (
            image,
            i
          ) => (
            {image} =>
                setIndex(i)
              }
            />
          )
        )}
      </div>
    </div>
  );
}
```

***

# carousel.css

```css
.carousel {
  position: relative;
  width: 900px;
  margin: auto;
  overflow: hidden;
}

.track {
  display: flex;
  transition:
    transform 500ms ease;
}

.slide-image {
  width: 100%;
  flex-shrink: 0;
}

.overlay-image {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  opacity: 0;
}

.overlay-image.active {
  opacity: 1;
}

/* FADE */

.fade {
  transition:
    opacity 500ms ease;
}

/* ZOOM */

.zoom {
  transform: scale(0.9);
  transition:
    all 500ms ease;
}

.zoom.active {
  transform: scale(1);
}

.nav {
  position: absolute;
  top: 50%;
  font-size: 2rem;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.dots {
  text-align: center;
  margin-top: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 4px;
  border: none;
}

.active-dot {
  background: black;
}

.thumbs {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.thumb {
  width: 80px;
  height: 50px;
  cursor: pointer;
  opacity: 0.5;
}

.active-thumb {
  opacity: 1;
  border: 2px solid blue;
}
```

***

# Supported Variants

## Slide Carousel

```jsx
<Carousel
  images={images}
  variant="slide"
/>
```

Effect:

```text
← Slide Left
→ Slide Right
```

***

## Fade Carousel

```jsx
<Carousel
  images={images}
  variant="fade"
/>
```

Effect:

```text
Image fade out
Image fade in
```

***

## Zoom Carousel

```jsx
<Carousel
  images={images}
  variant="zoom"
/>
```

Effect:

```text
Scale 0.9 → 1
```

***

# Advanced Variants You Can Add

```text
✅ Coverflow (Spotify)

✅ 3D Cube

✅ Netflix Banner

✅ Parallax

✅ Full Screen Modal Carousel

✅ Product Image Zoom

✅ Vertical Carousel

✅ Virtualized Carousel (1000+ images)

✅ Framer Motion Spring Carousel

✅ Gesture Based Mobile Carousel
```

# Interview Topics

```text
Q. Slide vs Fade?
A. translateX vs opacity

Q. Infinite Carousel?
A. Clone first/last slide

Q. Performance?
A. Lazy Loading + Virtualization

Q. Mobile Support?
A. Touch Events + Swipe

Q. Accessibility?
A. Keyboard Navigation + ARIA
```

This is a production-ready reusable carousel component suitable for Senior React machine coding rounds.
