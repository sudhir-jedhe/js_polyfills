In HTML and CSS, elements can be categorized into different types based on how they behave in terms of layout. The three main types of display values are:

- **`block`**
- **`inline`**
- **`inline-block`**

Each type affects how elements are rendered on a webpage, and understanding these differences is crucial for layout and styling.

### 1. **Block-level Elements**
   - **Definition**: A **block-level** element takes up the full width of its container (parent element) by default and always starts on a new line. It creates a "block" of space in the layout, stacking elements vertically.
   - **Key Characteristics**:
     - It always starts on a new line.
     - It can have width, height, margin, and padding applied to all four sides (top, right, bottom, left).
     - The width is 100% of its container by default, but you can set a specific width.
   
   - **Examples**:
     ```html
     <div>Div element</div>
     <p>Paragraph element</p>
     <h1>Heading 1</h1>
     <ul>Unordered List</ul>
     <ol>Ordered List</ol>
     <li>List Item</li>
     ```

   - **CSS Properties**:
     ```css
     div {
       display: block;  /* Default value */
       width: 80%;  /* Width is customizable */
       margin: 10px;
       padding: 20px;
     }
     ```

   - **Use Case**: Block-level elements are typically used for structuring the layout and creating larger sections of content.

---

### 2. **Inline Elements**
   - **Definition**: An **inline** element only takes up as much width as necessary to fit its content. It doesn't start on a new line, meaning multiple inline elements can sit next to each other on the same line.
   - **Key Characteristics**:
     - Does not start on a new line.
     - Can only have horizontal padding and margins (left and right), but not vertical (top and bottom).
     - The width and height properties are ignored (i.e., they can't be set explicitly).
     - Inline elements do not disrupt the flow of text and sit inline with surrounding content.

   - **Examples**:
     ```html
     <span>Span element</span>
     <a href="#">Link element</a>
     <strong>Bold text</strong>
     <em>Italic text</em>
     ```

   - **CSS Properties**:
     ```css
     span {
       display: inline; /* Default value */
       color: blue;
       padding-left: 5px;
     }
     ```

   - **Use Case**: Inline elements are used for styling small sections of content within a block-level element, such as text formatting or inline links.

---

### 3. **Inline-block Elements**
   - **Definition**: An **inline-block** element is a hybrid between block-level and inline elements. It behaves like an inline element (sitting on the same line as adjacent elements) but retains the ability to set width and height (like a block-level element).
   - **Key Characteristics**:
     - It behaves like an inline element, meaning it doesn't start on a new line and can sit next to other inline or inline-block elements.
     - It allows you to set width, height, margin, and padding on all sides.
     - It is commonly used for laying out elements like buttons, navigation links, or images that need to be in line but also have specific dimensions.

   - **Examples**:
     ```html
     <div style="display: inline-block;">Inline-block element 1</div>
     <div style="display: inline-block;">Inline-block element 2</div>
     ```

   - **CSS Properties**:
     ```css
     .inline-block-element {
       display: inline-block;
       width: 150px;
       height: 100px;
       background-color: lightgray;
       margin: 5px;
     }
     ```

   - **Use Case**: Inline-block elements are useful when you want to align multiple elements horizontally (like buttons or images) but also want to control their size and spacing.

---

### Comparison of `block`, `inline`, and `inline-block`:

| **Property**           | **Block**                              | **Inline**                            | **Inline-block**                        |
|------------------------|----------------------------------------|---------------------------------------|----------------------------------------|
| **Display Behavior**    | Starts on a new line, takes full width | Stays inline with surrounding content | Stays inline but can have width and height |
| **Width and Height**    | Can set width and height               | Cannot set width or height            | Can set width and height               |
| **Margin/Padding**      | Can apply margins and padding on all sides | Only applies left and right margins/padding | Can apply margins and padding on all sides |
| **Default Use**         | Block-level elements for layout structure | Inline text elements, links, etc.     | Layout elements like buttons or images |
| **Example**             | `<div>`, `<p>`, `<header>`, `<footer>`  | `<span>`, `<a>`, `<strong>`, `<em>`   | `<img>`, `<button>`, `<div> with inline-block` |
| **Usage**               | Used for creating large sections, dividing content | Used for text formatting and links    | Used for elements that need to be inline but have specific size requirements |

---

### Key Differences Between `block`, `inline`, and `inline-block`

1. **New Line**:
   - **Block**: Always starts on a new line (forces a line break).
   - **Inline**: Does not start on a new line and sits next to other inline elements.
   - **Inline-block**: Does not start on a new line but can be sized and styled like a block-level element.

2. **Size Control**:
   - **Block**: You can set both width and height.
   - **Inline**: You cannot set width or height.
   - **Inline-block**: You can set both width and height, like block-level elements, but it will behave like an inline element.

3. **Layout Context**:
   - **Block**: Useful for large sections of content (headers, paragraphs, divs, etc.).
   - **Inline**: Typically used for small pieces of content within a block (e.g., text, links).
   - **Inline-block**: Useful for small, independent elements that need to be placed inline but still require specific size and spacing (e.g., buttons or images).

### Example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .block-element {
            display: block;
            background-color: lightblue;
            padding: 20px;
            margin-bottom: 10px;
        }

        .inline-element {
            display: inline;
            background-color: lightcoral;
            padding: 5px;
            margin-right: 10px;
        }

        .inline-block-element {
            display: inline-block;
            background-color: lightgreen;
            width: 100px;
            height: 50px;
            padding: 10px;
            margin-right: 10px;
        }
    </style>
    <title>Block vs Inline vs Inline-block</title>
</head>
<body>

    <div class="block-element">Block Element</div>
    <div class="block-element">Another Block Element</div>

    <span class="inline-element">Inline Element 1</span>
    <span class="inline-element">Inline Element 2</span>

    <div class="inline-block-element">Inline-block 1</div>
    <div class="inline-block-element">Inline-block 2</div>

</body>
</html>
```

### Explanation of the Example:

- **Block Elements** (`<div>` with class `.block-element`): These take up the full width of the container and force the next block-level element to be on a new line.
- **Inline Elements** (`<span>` with class `.inline-element`): These stay on the same line and only take as much space as needed by their content.
- **Inline-block Elements** (`<div>` with class `.inline-block-element`): These behave like inline elements (i.e., stay on the same line) but also allow you to set width, height, padding, and margin.

---

### Conclusion

- **`block`** elements are used for larger layout components and occupy the entire width of their container.
- **`inline`** elements are used for small pieces of content within larger structures and flow inline with other content.
- **`inline-block`** elements combine the behaviors of both: they stay inline with other elements but can have specific width and height properties.

Understanding these three types of elements is crucial for layout and design in web development.