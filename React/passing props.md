In React, passing props to components is done by adding attributes to the component when it is used, just like you would with HTML elements. However, there are specific conventions to follow when passing props in JSX.

Let's look at the two examples you provided and clarify which is the correct way to pass props in React.

### Example 1: `<App age=20>`
### Example 2: `<App lang="js">`

### 1. **`<App age=20>`**

This syntax is **incorrect** in JSX, although it is used in plain JavaScript. In JSX, **attributes must be passed in quotes** (unless they are JavaScript expressions, like booleans or `null`/`undefined`).

This would throw an error in React, because the value `20` is not inside quotes, making it ambiguous as JSX expects a string or a valid expression.

### 2. **`<App lang="js">`**

This syntax is **correct**.

In React, **props are passed as attributes** to components in JSX. These attributes should be in the form of a key-value pair, and the value should either be:
- A **string** (e.g., `"js"`)
- A **JavaScript expression** (e.g., `{someVariable}`)
- A **boolean value** (e.g., `true` or `false` for certain props)

So, in your example:
```jsx
<App lang="js" />
```
The `lang` prop is being passed a string value `"js"`, which is the **correct way** to pass props.

### Correct Usage of Props:

#### 1. String props:
```jsx
<App lang="js" />
```

#### 2. JavaScript expressions:
You can also pass dynamic values by using curly braces to embed JavaScript expressions:
```jsx
const language = "js";
<App lang={language} />
```

#### 3. Numeric props:
When passing a numeric value, you can either pass it directly (using curly braces):
```jsx
<App age={20} />
```

#### 4. Boolean props:
For boolean props, you can pass the value `true` or `false` directly, or just use the attribute name (which implicitly sets it to `true`):
```jsx
<App isActive={true} />
<App disabled />
```

### Summary:
- The correct way to pass props in React is to **use quotes for string values** and **curly braces for JavaScript expressions**.
- **`<App lang="js" />`** is the correct way to pass the `lang` prop with the string value `"js"`.
- **`<App age={20} />`** is the correct way to pass the `age` prop with the numeric value `20`.