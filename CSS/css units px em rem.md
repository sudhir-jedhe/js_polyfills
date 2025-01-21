CSS provides several units of measurement to define dimensions, spacing, and typography in stylesheets. Understanding when to use each unit is crucial for creating flexible, accessible, and responsive designs. Here’s a breakdown of common CSS units and when to use each one:

### 1. **`px` (Pixels)**

- **Definition**: Represents a fixed, absolute measurement based on screen pixels. 
- **When to Use**: 
  - Use `px` when you need precise control over layout elements that should have a fixed size on the screen, regardless of the device or user preferences.
  - It's suitable for non-responsive, pixel-perfect designs.
- **Drawbacks**: 
  - `px` does not scale well on different screen sizes or user settings (like text size adjustments), so it’s less flexible compared to relative units like `em` or `rem`.

```css
div {
  width: 200px; /* Fixed width */
}
```

### 2. **`em` (Relative to Parent Element’s Font Size)**

- **Definition**: Relative to the font-size of the **parent element**. 1em equals the font size of the parent element. If no parent element has a font size set, it defaults to the root font size (`16px` in most browsers).
- **When to Use**: 
  - Use `em` for scalable and responsive designs, especially for text and spacing.
  - Good for **responsive typography** and **spacing**, as it adapts based on the parent element's size.
  - You can control the scaling of elements based on the size of their parent, making it ideal for nested components or layouts.
- **Drawbacks**: 
  - If you nest elements with relative `em` values, the size compounds, and elements can become unexpectedly large or small due to the cumulative effect.
  
```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 2em; /* 2 * 16px = 32px */
}
```

### 3. **`rem` (Relative to Root Element’s Font Size)**

- **Definition**: Stands for "root em." It is **relative to the font size of the root element** (`<html>`), typically `16px` by default.
- **When to Use**: 
  - `rem` is a more predictable and consistent unit than `em` because it always refers to the root font size, regardless of the nesting of elements.
  - It’s best for **global settings**, like setting font sizes, margins, and padding that should scale uniformly across the whole page.
  - Ideal for **responsive design** because you can adjust the font size of the root element, and all other `rem`-based measurements will scale accordingly.
- **Drawbacks**: 
  - Less flexible than `em` for local element scaling since it always refers to the root font size.
  
```css
html {
  font-size: 16px;
}

h1 {
  font-size: 2rem; /* 2 * 16px = 32px */
}
```

### 4. **`%` (Percentages)**

- **Definition**: A relative unit that is a percentage of the **parent element's dimensions**.
- **When to Use**:
  - **Width and height** for fluid layouts, particularly for responsive design.
  - Use for setting the width of a container relative to its parent’s width, or setting padding and margins relative to the element’s dimensions.
  - Works well for **flexible layouts** where elements need to adapt to the size of their parent container.
- **Drawbacks**: 
  - Can be hard to manage for things like fonts because they are based on the parent element’s size, which can lead to unexpected behavior if the parent is resized.

```css
.container {
  width: 80%; /* 80% of the parent element's width */
}
```

### 5. **`vh` (Viewport Height)**

- **Definition**: 1vh is equal to 1% of the height of the viewport (the visible area of the browser window).
- **When to Use**: 
  - Use for creating layouts or sections that are a **percentage of the viewport’s height** (e.g., full-screen sections).
  - Great for **height-based design** and full-page layouts.
- **Drawbacks**: 
  - Can be problematic on mobile devices due to the address bar and browser chrome taking up space.

```css
.fullscreen-section {
  height: 100vh; /* Full height of the viewport */
}
```

### 6. **`vw` (Viewport Width)**

- **Definition**: 1vw is equal to 1% of the viewport’s width.
- **When to Use**: 
  - Use for width-based layouts that adapt to the viewport size.
  - Works well for **fluid typography** or elements that need to adjust relative to the width of the viewport.
- **Drawbacks**: 
  - Like `vh`, `vw` can cause issues with mobile layouts if the browser's chrome interferes with the viewport.

```css
.container {
  width: 50vw; /* 50% of the viewport width */
}
```

### 7. **`ch` (Character Width)**

- **Definition**: Represents the width of the **"0" (zero)** character in the current font.
- **When to Use**:
  - Use for **typography-related layouts** where the width of an element is based on the width of characters.
  - Useful for setting the width of form fields or inputs in a way that fits a specific number of characters.
  
```css
input {
  width: 20ch; /* Enough space for 20 characters */
}
```

### 8. **`ex` (Height of the letter 'x')**

- **Definition**: Represents the height of the lowercase letter **"x"** in the current font.
- **When to Use**:
  - Similar to `ch`, it’s used in typography-related layouts where you need to scale based on character height.
  - Not commonly used compared to `rem`, but can be useful for certain typographic measurements.

```css
p {
  line-height: 2ex; /* Line height based on 'x' height */
}
```

### 9. **`calc()` (Calculation Function)**

- **Definition**: Allows you to perform calculations using different units (e.g., `px`, `em`, `%`) in CSS.
- **When to Use**:
  - Use `calc()` to combine different units and calculate dynamic values, like when you need a width that's a percentage plus a fixed pixel value.
  - Very useful for complex layouts where values need to be based on both relative and absolute measurements.
  
```css
.container {
  width: calc(100% - 50px); /* 100% width minus 50px */
}
```

### 10. **`vw` + `vh` for Fullscreen Layouts**

- **When to Use**: Use `vw` and `vh` for creating full-screen sections or elements that dynamically adjust to the size of the viewport.
  
```css
.hero-section {
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
}
```

---

### When to Use Which Unit:

- **Use `px`** for **fixed layouts** where precise control is needed, such as images, borders, and elements that shouldn't resize with the viewport.
- **Use `em`** when you want elements to scale based on the **parent’s font size**. It’s great for typography and nested layouts.
- **Use `rem`** for global sizing (e.g., font size, margins, and padding) since it’s consistent across the page and scales uniformly.
- **Use `%`** for **fluid layouts** where the size should be relative to the parent element (especially for width, height, margins, and padding).
- **Use `vh` and `vw`** for **full-screen or viewport-relative layouts** (like hero sections or backgrounds that take up the entire screen).
- **Use `calc()`** when you need to perform calculations involving different units (e.g., `calc(50% - 30px)`).
- **Use `ch` and `ex`** for **typography-related layouts**, where character width and height are critical.

### Conclusion:
Each CSS unit has its specific use cases depending on the layout, scalability, and responsiveness needs of the design. A combination of relative units like `em`, `rem`, `%`, and absolute units like `px` often leads to the most flexible and accessible designs. When in doubt, prefer relative units for most layout properties to enhance accessibility and responsiveness.