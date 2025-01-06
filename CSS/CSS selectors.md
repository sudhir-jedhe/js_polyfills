CSS selectors are used to select and style HTML elements on a web page. Here is a comprehensive list of various CSS selectors:

### **1. Basic Selectors**
- **Universal Selector (`*`)**: Selects all elements on the page.
  ```css
  * {
    color: red;
  }
  ```
  
- **Type Selector (Element Selector)**: Selects elements of a specific type (HTML tags).
  ```css
  p {
    color: blue;
  }
  ```

- **Class Selector (`.`)**: Selects elements with a specific class.
  ```css
  .my-class {
    color: green;
  }
  ```

- **ID Selector (`#`)**: Selects an element with a specific ID.
  ```css
  #my-id {
    color: yellow;
  }
  ```

- **Descendant Selector**: Selects elements that are descendants of a specific element.
  ```css
  div p {
    color: orange;
  }
  ```

### **2. Combinator Selectors**
- **Child Selector (`>`)**: Selects elements that are direct children of a specific element.
  ```css
  div > p {
    color: purple;
  }
  ```

- **Adjacent Sibling Selector (`+`)**: Selects the element that immediately follows a specified element.
  ```css
  h1 + p {
    color: pink;
  }
  ```

- **General Sibling Selector (`~`)**: Selects all sibling elements that follow a specified element.
  ```css
  h1 ~ p {
    color: teal;
  }
  ```

### **3. Attribute Selectors**
- **[attribute]**: Selects elements that have a specific attribute.
  ```css
  input[type="text"] {
    background-color: lightgray;
  }
  ```

- **[attribute="value"]**: Selects elements with a specific attribute value.
  ```css
  a[href="https://example.com"] {
    color: red;
  }
  ```

- **[attribute^="value"]**: Selects elements whose attribute value starts with a specific value.
  ```css
  a[href^="https"] {
    color: blue;
  }
  ```

- **[attribute$="value"]**: Selects elements whose attribute value ends with a specific value.
  ```css
  img[src$=".png"] {
    border: 1px solid black;
  }
  ```

- **[attribute*="value"]**: Selects elements whose attribute value contains a specific value.
  ```css
  a[href*="example"] {
    font-weight: bold;
  }
  ```

### **4. Pseudo-Classes**
- **`:hover`**: Selects an element when the mouse hovers over it.
  ```css
  button:hover {
    background-color: blue;
  }
  ```

- **`:focus`**: Selects an element when it gets focus (e.g., when clicked or selected).
  ```css
  input:focus {
    border-color: blue;
  }
  ```

- **`:nth-child(n)`**: Selects the nth child of a parent element.
  ```css
  ul li:nth-child(2) {
    color: red;
  }
  ```

- **`:first-child`**: Selects the first child element.
  ```css
  p:first-child {
    font-weight: bold;
  }
  ```

- **`:last-child`**: Selects the last child element.
  ```css
  p:last-child {
    color: green;
  }
  ```

- **`:not(selector)`**: Selects elements that do not match the given selector.
  ```css
  div:not(.my-class) {
    background-color: yellow;
  }
  ```

- **`:nth-of-type(n)`**: Selects the nth element of a given type.
  ```css
  div:nth-of-type(2) {
    background-color: blue;
  }
  ```

### **5. Pseudo-Elements**
- **`::before`**: Inserts content before an element.
  ```css
  p::before {
    content: "Prefix: ";
  }
  ```

- **`::after`**: Inserts content after an element.
  ```css
  p::after {
    content: " - Suffix";
  }
  ```

- **`::first-letter`**: Selects the first letter of an element.
  ```css
  p::first-letter {
    font-size: 2em;
  }
  ```

- **`::first-line`**: Selects the first line of an element.
  ```css
  p::first-line {
    font-weight: bold;
  }
  ```

### **6. Grouping Selectors**
- **Group Selector**: Selects multiple elements to apply the same styles.
  ```css
  h1, h2, h3 {
    font-family: Arial, sans-serif;
  }
  ```

### **7. Other Selectors**
- **`:empty`**: Selects elements that have no children.
  ```css
  div:empty {
    display: none;
  }
  ```

- **`:checked`**: Selects input elements that are checked (e.g., checkboxes, radio buttons).
  ```css
  input:checked {
    background-color: yellow;
  }
  ```

- **`:disabled`**: Selects disabled elements.
  ```css
  input:disabled {
    background-color: gray;
  }
  ```

- **`:enabled`**: Selects enabled elements.
  ```css
  input:enabled {
    background-color: white;
  }
  ```

- **`:required`**: Selects input elements that are required.
  ```css
  input:required {
    border: 2px solid red;
  }
  ```

### **8. Combinator and Grouping Selectors**
- **`(combinator)`**: Selects an element in relation to another.
  ```css
  .parent .child { 
    color: green; 
  }
  ```

---

### **Summary of CSS Selectors**

1. **Basic Selectors**: `*`, element, `.class`, `#id`.
2. **Combinators**: `>`, `+`, `~`.
3. **Attribute Selectors**: `[attr]`, `[attr="value"]`, `[attr^="value"]`, `[attr$="value"]`, `[attr*="value"]`.
4. **Pseudo-Classes**: `:hover`, `:focus`, `:nth-child()`, `:not()`, `:first-child`, `:last-child`, etc.
5. **Pseudo-Elements**: `::before`, `::after`, `::first-letter`, `::first-line`.
6. **Grouping Selectors**: Group multiple selectors for common styling.
7. **Other Selectors**: `:empty`, `:checked`, `:disabled`, `:required`, `:enabled`, etc.

These CSS selectors allow you to target specific HTML elements in a variety of ways, providing fine control over the styling of your web pages.