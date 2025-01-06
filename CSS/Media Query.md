### **What is a Media Query?**

A **media query** in CSS is a powerful tool used to apply different styles based on the **device characteristics**, such as the **width**, **height**, **orientation**, **resolution**, or even the **color scheme** of the device. It helps make your website responsive, ensuring it adapts to various screen sizes and devices, such as mobile phones, tablets, and desktops.

Media queries are essential for creating **responsive web design**, allowing developers to define rules that apply to different devices or screen sizes. For example, you might want to change the layout, font size, or other styles when the viewport is smaller than a certain width.

---

### **Syntax of a Media Query**

The basic syntax of a media query is as follows:

```css
@media media_type and (condition) {
  /* CSS Rules */
}
```

- **`@media`**: The keyword used to define a media query.
- **`media_type`**: This is optional and defines the type of media you want to target (e.g., `screen`, `print`). If omitted, it defaults to `all`, which targets all devices.
- **`condition`**: The condition (or conditions) within parentheses specifies the device characteristics you want to match (e.g., `max-width`, `min-width`, `orientation`).

---

### **Common Media Query Conditions**

Here are some common conditions used in media queries:

1. **Width and Height**:
   - **`min-width`**: The minimum width of the viewport or device.
   - **`max-width`**: The maximum width of the viewport or device.
   - **`min-height`**: The minimum height of the viewport.
   - **`max-height`**: The maximum height of the viewport.

   Example:
   ```css
   @media (min-width: 768px) {
     /* Styles for devices with a width of at least 768px */
   }

   @media (max-width: 600px) {
     /* Styles for devices with a width of 600px or less */
   }
   ```

2. **Orientation**:
   - **`orientation`**: This refers to the orientation of the device screen — whether it is in **portrait** or **landscape** mode.
   
   Example:
   ```css
   @media (orientation: portrait) {
     /* Styles for portrait orientation */
   }

   @media (orientation: landscape) {
     /* Styles for landscape orientation */
   }
   ```

3. **Device Resolution**:
   - **`min-resolution`**: The minimum resolution of the device.
   - **`max-resolution`**: The maximum resolution of the device.

   Example:
   ```css
   @media (min-resolution: 192dpi) {
     /* Styles for high-resolution screens (e.g., Retina displays) */
   }
   ```

4. **Aspect Ratio**:
   - **`aspect-ratio`**: The ratio of the width to the height of the viewport or device.
   
   Example:
   ```css
   @media (min-aspect-ratio: 16/9) {
     /* Styles for devices with a 16:9 aspect ratio or larger */
   }
   ```

5. **Color Scheme**:
   - **`prefers-color-scheme`**: This targets the user's system preference for light or dark mode.

   Example:
   ```css
   @media (prefers-color-scheme: dark) {
     /* Styles for dark mode */
   }

   @media (prefers-color-scheme: light) {
     /* Styles for light mode */
   }
   ```

---

### **Basic Examples of Media Queries**

#### Example 1: **Basic Responsive Layout**

This example shows how to change the layout based on the screen width (desktop vs. mobile):

```css
/* Default styles (for desktop or larger screens) */
body {
  font-size: 18px;
  background-color: #f0f0f0;
}

/* Styles for mobile devices (up to 768px wide) */
@media (max-width: 768px) {
  body {
    font-size: 16px;
    background-color: #ffffff;
  }
}
```

- **Default styles** apply to all screens unless overridden by a media query.
- **Mobile-specific styles** are applied only if the screen width is **768px or less** (i.e., tablets and mobile devices).

#### Example 2: **Switching Layouts Between Columns**

This example shows how to change a multi-column layout to a single column layout on smaller screens:

```css
/* Default: Two-column layout for larger screens */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* For screens smaller than 600px, use a single column layout */
@media (max-width: 600px) {
  .container {
    grid-template-columns: 1fr; /* Single column */
  }
}
```

- **Grid Layout**: For larger screens, it uses a two-column layout.
- **Mobile Layout**: For screens 600px wide or smaller, the layout switches to a single column.

#### Example 3: **Media Queries for Print Styles**

You can use media queries to apply specific styles for when a document is printed:

```css
@media print {
  body {
    font-size: 12pt;
  }
  
  .no-print {
    display: none;
  }
}
```

- **`@media print`**: This targets print-specific styles.
- **`.no-print`**: Hides any elements that are not meant to be printed, such as navigation links or advertisements.

---

### **Advanced Usage: Combining Multiple Conditions**

You can also combine multiple conditions within a single media query using **`and`**, **`or`**, or **`not`** operators.

#### Example 1: **Combining Conditions with `and`**

```css
@media (min-width: 768px) and (max-width: 1024px) {
  /* Styles for devices with width between 768px and 1024px */
}
```

#### Example 2: **Using `not` to Exclude Conditions**

```css
@media not all and (max-width: 600px) {
  /* Styles for all devices except those with a width of 600px or less */
}
```

---

### **Best Practices for Using Media Queries**

1. **Mobile-first Design**:
   - It’s recommended to design for smaller screens first (mobile-first approach). This means you write the base styles for mobile devices, and then use media queries to adjust the design for larger screens.
   
   Example:
   ```css
   /* Mobile first: Default styles for small screens */
   body {
     font-size: 14px;
   }
   
   /* Styles for tablets and larger screens */
   @media (min-width: 768px) {
     body {
       font-size: 16px;
     }
   }
   
   @media (min-width: 1024px) {
     body {
       font-size: 18px;
     }
   }
   ```

2. **Use `em` or `rem` for Media Queries**:
   - When writing media queries, consider using `em` or `rem` units for breakpoints, rather than `px`. This makes the layout more flexible and scalable based on the user’s font size settings.
   
   Example:
   ```css
   @media (min-width: 48em) { /* 768px (16px base font size) */
     /* Styles for devices with width of at least 768px */
   }
   ```

3. **Optimize for Different Devices**:
   - Make sure to test your website on multiple devices and screen sizes. Use the responsive mode in browser developer tools to simulate different devices.
   - Consider targeting **`min-width`** for mobile-first designs and **`max-width`** for desktop-first designs.

---

### **Conclusion**

Media queries are essential for creating responsive websites that adapt to different screen sizes, devices, and user preferences. They allow you to apply styles conditionally based on a variety of factors such as device width, height, resolution, orientation, and color scheme. By using media queries effectively, you can ensure that your website provides an optimal experience for users across all devices.

To summarize:
- **Mobile-first approach**: Start with styles for small screens, then add media queries for larger screens.
- **Common breakpoints**: Design for common devices like mobile phones (up to 600px), tablets (768px), and desktops (1024px+).
- **Test thoroughly**: Always test your website on multiple devices to ensure it looks great everywhere.