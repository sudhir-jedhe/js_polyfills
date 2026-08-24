# Box Model Anatomy: Content, Padding, Border, Margin

Every element generates a rectangular box made of four nested layers, from the inside out:

```
┌─────────────────────────────────────┐
│               margin                 │  transparent, outside the visible box, used for spacing between elements
│  ┌─────────────────────────────────┐ │
│  │             border               │ │  visible line around the padding, part of the element's visible box
│  │  ┌─────────────────────────────┐ │ │
│  │  │           padding            │ │ │  transparent, inside the border, background color/image extends into it
│  │  │  ┌─────────────────────────┐ │ │ │
│  │  │  │        content          │ │ │ │  where text/children actually render, sized by width/height
│  │  │  └─────────────────────────┘ │ │ │
│  │  └─────────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## What `width` and `height` actually size

By default (`box-sizing: content-box`), the `width`/`height` properties size **only the content box** — padding and border are added *on top* of that:

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
```
Total rendered width = `200 (content) + 20 + 20 (left/right padding) + 5 + 5 (left/right border) = 250px`. This is the single most common source of "why is my layout 40px wider than I expected" bugs — see the `box-sizing` theory file for the fix.

## Margin is outside the box, and can be negative

Margin is the only layer that can take a **negative** value, which pulls the element (and/or its neighbor, since margins collapse — see the margin-collapsing theory file) closer than it would otherwise sit — commonly used to counteract a parent's padding or to overlap elements deliberately:

```css
.badge { margin-top: -10px; } /* pulls the badge up, overlapping the element above it by 10px */
```

## Background paints into content + padding, not margin

A common quiz point: `background-color`/`background-image` render underneath the content **and** the padding area, right up to the outer edge of the border (by default, `background-clip: border-box`), but never into the margin — margin is always transparent and shows whatever is behind the element in the page.
