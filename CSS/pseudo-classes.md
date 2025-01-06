CSS **pseudo-classes** are used to define the special state or condition of an element. They allow you to style elements based on user interactions, document structure, or other criteria. Here’s a comprehensive list of **all CSS pseudo-classes**, categorized by their functionality:

### 1. **User Action Pseudo-Classes**
These pseudo-classes are applied based on user interactions or actions.

- **`:hover`**
  - **Purpose**: Applied when the user hovers over an element (e.g., a link or button).
  - **Example**:
    ```css
    a:hover {
      color: red;
    }
    ```

- **`:active`**
  - **Purpose**: Applied when an element is being activated by the user, such as when a link or button is clicked.
  - **Example**:
    ```css
    button:active {
      background-color: yellow;
    }
    ```

- **`:focus`**
  - **Purpose**: Applied when an element has focus, typically when a user clicks or tabs to an input field or link.
  - **Example**:
    ```css
    input:focus {
      border-color: blue;
    }
    ```

- **`:focus-visible`**
  - **Purpose**: Applied when an element receives focus and should be visually indicated as focused (mainly for accessibility purposes).
  - **Example**:
    ```css
    button:focus-visible {
      outline: 2px solid blue;
    }
    ```

- **`:focus-within`**
  - **Purpose**: Applied to an element when it or any of its descendants receive focus.
  - **Example**:
    ```css
    .form-group:focus-within {
      border-color: green;
    }
    ```

### 2. **Structural Pseudo-Classes**
These pseudo-classes target an element based on its position in the document or its relationship to other elements.

- **`:first-child`**
  - **Purpose**: Applied to the first child element of a parent.
  - **Example**:
    ```css
    p:first-child {
      font-weight: bold;
    }
    ```

- **`:last-child`**
  - **Purpose**: Applied to the last child element of a parent.
  - **Example**:
    ```css
    p:last-child {
      margin-bottom: 0;
    }
    ```

- **`:nth-child(n)`**
  - **Purpose**: Applied to elements based on their position in a parent element. You can use a number, keyword, or formula to select specific children.
  - **Example**:
    ```css
    li:nth-child(2) {
      color: red;
    }
    li:nth-child(odd) {
      background-color: #f0f0f0;
    }
    li:nth-child(3n) {
      color: blue;
    }
    ```

- **`:nth-last-child(n)`**
  - **Purpose**: Similar to `:nth-child()`, but counts elements from the end (last child).
  - **Example**:
    ```css
    li:nth-last-child(1) {
      color: green;
    }
    ```

- **`:only-child`**
  - **Purpose**: Applied to an element if it is the only child of its parent.
  - **Example**:
    ```css
    p:only-child {
      font-size: 20px;
    }
    ```

- **`:only-of-type`**
  - **Purpose**: Applied to an element if it is the only element of its type (tag name) in its parent.
  - **Example**:
    ```css
    p:only-of-type {
      font-weight: bold;
    }
    ```

- **`:empty`**
  - **Purpose**: Applied to elements that have no children (including text nodes).
  - **Example**:
    ```css
    div:empty {
      display: none;
    }
    ```

- **`:root`**
  - **Purpose**: Applied to the root element of the document (`<html>` in HTML).
  - **Example**:
    ```css
    :root {
      font-size: 16px;
    }
    ```

### 3. **State-based Pseudo-Classes**
These pseudo-classes apply based on the state or condition of the element.

- **`:checked`**
  - **Purpose**: Applied to input elements (`<input>`, `<select>`, `<option>`, `<textarea>`) when they are checked or selected.
  - **Example**:
    ```css
    input:checked {
      background-color: #ddd;
    }
    ```

- **`:disabled`**
  - **Purpose**: Applied to form elements that are disabled.
  - **Example**:
    ```css
    input:disabled {
      background-color: lightgray;
    }
    ```

- **`:enabled`**
  - **Purpose**: Applied to form elements that are enabled.
  - **Example**:
    ```css
    input:enabled {
      background-color: white;
    }
    ```

- **`:indeterminate`**
  - **Purpose**: Applied to input elements that are in an indeterminate state, such as checkboxes or radio buttons with an unknown state.
  - **Example**:
    ```css
    input:indeterminate {
      background-color: yellow;
    }
    ```

- **`:valid`**
  - **Purpose**: Applied to form elements that are valid according to their constraints (e.g., required fields, pattern matching).
  - **Example**:
    ```css
    input:valid {
      border-color: green;
    }
    ```

- **`:invalid`**
  - **Purpose**: Applied to form elements that are invalid based on the validation constraints.
  - **Example**:
    ```css
    input:invalid {
      border-color: red;
    }
    ```

- **`:required`**
  - **Purpose**: Applied to form elements that are required to be filled out.
  - **Example**:
    ```css
    input:required {
      border: 2px solid red;
    }
    ```

- **`:optional`**
  - **Purpose**: Applied to form elements that are optional (i.e., not required).
  - **Example**:
    ```css
    input:optional {
      border: 2px solid green;
    }
    ```

### 4. **Link State Pseudo-Classes**
These pseudo-classes are used specifically for styling hyperlinks (`<a>` tags).

- **`:link`**
  - **Purpose**: Applied to links that have not been visited.
  - **Example**:
    ```css
    a:link {
      color: blue;
    }
    ```

- **`:visited`**
  - **Purpose**: Applied to links that have been visited by the user.
  - **Example**:
    ```css
    a:visited {
      color: purple;
    }
    ```

- **`:focus`**
  - **Purpose**: Applied when a link or input element gains focus (e.g., via clicking or tabbing).
  - **Example**:
    ```css
    a:focus {
      outline: 2px solid orange;
    }
    ```

- **`:active`**
  - **Purpose**: Applied when a link or button is clicked and being activated.
  - **Example**:
    ```css
    a:active {
      color: red;
    }
    ```

### 5. **Negation Pseudo-Class**

- **`:not(selector)`**
  - **Purpose**: Applies styles to elements that do **not** match the specified selector.
  - **Example**:
    ```css
    p:not(.special) {
      color: gray;
    }
    ```

### 6. **Miscellaneous Pseudo-Classes**

- **`:lang(language)`**
  - **Purpose**: Applies styles to elements based on their language attribute.
  - **Example**:
    ```css
    p:lang(en) {
      color: blue;
    }
    ```

- **`:before`**
  - **Purpose**: Used in combination with `::before` pseudo-element.
  - **Example**:
    ```css
    p::before {
      content: "⚡";
    }
    ```

- **`:after`**
  - **Purpose**: Used in combination with `::after` pseudo-element.
  - **Example**:
    ```css
    p::after {
      content: "🚀";
    }
    ```

---

### Summary of Key CSS Pseudo-Classes:

| Pseudo-Class         | Description |
|----------------------|-------------|
| `:hover`             | When the user hovers over an element. |
| `:active`            | When the element is being activated (e.g., clicked). |
| `:focus`             | When the element has focus (e.g., input field). |
| `:focus-visible`     | When the element is focused and should be visually indicated (for accessibility). |
| `:focus-within`      | When an element or any of its descendants has focus. |
| `:first-child`       | The first child of an element. |
| `:last-child`        | The last child of an element. |
| `:nth-child(n)`      | Target specific child elements based on a formula or index. |
| `:nth-last-child(n)` | Target specific child elements counting from the end. |
| `:only-child`        | When an element is the only child of its parent. |
| `:only-of-type`

      | When an element is the only element of its type (tag) in its parent. |
| `:empty`             | When an element has no children. |
| `:root`              | The root element (e.g., `<html>` in HTML). |
| `:checked`           | When an input element is checked or selected. |
| `:disabled`          | When an input element is disabled. |
| `:enabled`           | When an input element is enabled. |
| `:indeterminate`     | When an input element is in an indeterminate state. |
| `:valid`             | When an input element is valid based on its constraints. |
| `:invalid`           | When an input element is invalid. |
| `:required`          | When an input element is required. |
| `:optional`          | When an input element is optional. |
| `:link`              | When a link is unvisited. |
| `:visited`           | When a link has been visited. |
| `:not(selector)`     | When an element does not match the specified selector. |
| `:lang(language)`    | When an element has a specific `lang` attribute. |

These pseudo-classes provide a wide variety of ways to style elements based on their state, position, or user interaction.