### Key Concepts of Arrow Functions and `this` in JavaScript

1. **Arrow Functions and `this`**:
   - Arrow functions have no **own `this`** context. Instead, they inherit `this` from the surrounding lexical context (where the arrow function was defined).
   - This makes them different from regular functions, which have their own `this` (i.e., when called within a specific context, `this` refers to the object the method was called on).

---

### The Example Breakdown:

#### 1. **Regular Function (`function() {}`) with `this`**:
In this case, a regular function is used as an event listener:

```javascript
const toggleElements = document.querySelectorAll('.toggle');
toggleElements.forEach(el => {
  el.addEventListener('click', function() {
    this.classList.toggle('active'); // `this` refers to the clicked element (the DOM element)
  });
});
```

- Here, `this` inside the regular function refers to the element that was clicked (`el`), because the `this` context is dynamically set when the function is invoked (via the `addEventListener` callback).

---

#### 2. **Arrow Function with `this`**:
Now, when we use an arrow function, we face an issue:

```javascript
const toggleElements = document.querySelectorAll('.toggle');
toggleElements.forEach(el => {
  el.addEventListener('click', () => {
    this.classList.toggle('active'); // `this` refers to the global object (Window)
    // Error: Cannot read property 'toggle' of undefined
  });
});
```

- In the above example, `this` does **not** refer to the clicked element. Instead, it refers to the global context (`Window`), because arrow functions inherit `this` from the surrounding context in which they were defined.
- Since the global `this` (`window` in browsers) does not have a `classList` property, the code throws an error: `"Cannot read property 'toggle' of undefined"`.

---

#### 3. **Correct Usage with `e.currentTarget`**:
To ensure that we correctly target the clicked element, we can use the `currentTarget` property of the event object (`e`), which always refers to the element to which the event handler is attached:

```javascript
const toggleElements = document.querySelectorAll('.toggle');
toggleElements.forEach(el => {
  el.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active'); // works correctly
  });
});
```

- `e.currentTarget` refers to the element that the event listener is attached to (`el`), which is the correct element for toggling the class. This avoids the issue caused by the incorrect `this` context in the arrow function.

---

### Conclusion:
- **Arrow functions**: `this` inside an arrow function refers to the **lexical context**, so it will inherit `this` from the surrounding scope where the function is defined.
- **Regular functions**: `this` is dynamically set based on how the function is called. In an event listener, it will refer to the element that fired the event.

In event handling, to avoid issues with `this`, use **regular functions** or access the correct context using **`e.currentTarget`** inside an arrow function.


# Arrow Functions (ES6)

An **Arrow Function** is a shorter way to write functions in JavaScript. It was introduced in **ES6** and is commonly used in React applications. Examples of arrow functions are present in internal React training materials and interview preparation documents. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/Aug22AdvTrack-ReactSession/Shared%20Documents/General/Day1_React.zip?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/GEMS_NodeUIReactBatchSep21/Shared%20Documents/General/React.js/Day1_react.zip?web=1)

## Syntax

### Normal Function

```javascript
function add(a, b) {
  return a + b;
}
```

### Arrow Function

```javascript
const add = (a, b) => {
  return a + b;
};
```

***

# Single Expression Return

When there is only one expression:

```javascript
const add = (a, b) => a + b;

console.log(add(10, 20));
```

Output:

```text
30
```

***

# No Parameters

```javascript
const display = () => {
  console.log("Hello");
};

display();
```

Similar examples are shown in the React training material. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/Aug22AdvTrack-ReactSession/Shared%20Documents/General/Day1_React.zip?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/GEMSJune22Batch-ReactAdvancetraining/Shared%20Documents/General/Day1_React.zip?web=1)

***

# One Parameter

Parentheses are optional.

```javascript
const square = num => num * num;

console.log(square(5));
```

Output:

```text
25
```

***

# Multiple Parameters

```javascript
const multiply = (a, b) => a * b;

console.log(multiply(4, 5));
```

Output:

```text
20
```

***

# Returning an Object

Use parentheses.

```javascript
const getUser = () => ({
  id: 1,
  name: "Sudhir"
});

console.log(getUser());
```

***

# Arrow Function and `this`

## Normal Function

```javascript
const person = {
  name: "Sudhir",

  greet: function () {
    console.log(this.name);
  }
};

person.greet();
```

Output:

```text
Sudhir
```

***

## Arrow Function

```javascript
const person = {
  name: "Sudhir",

  greet: () => {
    console.log(this.name);
  }
};

person.greet();
```

Output:

```text
undefined
```

### Why?

Arrow functions:

```text
❌ Do not have their own this
✅ Inherit this from parent scope
```

***

# React Example

### Event Handler

```jsx
function App() {

  const handleClick = () => {
    console.log("Button Clicked");
  };

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

***

### Array Mapping

```jsx
const users = [
  "Sudhir",
  "John",
  "Apoorva"
];

users.map(user =>
  console.log(user)
);
```

***

# Arrow Function vs Normal Function

| Feature            | Arrow Function | Normal Function |
| ------------------ | -------------- | --------------- |
| Short Syntax       | ✅              | ❌               |
| Own `this`         | ❌              | ✅               |
| Constructor        | ❌              | ✅               |
| Arguments Object   | ❌              | ✅               |
| Best for Callbacks | ✅              | ✅               |

***

# Common Interview Questions

### Can Arrow Functions Be Constructors?

```javascript
const Person = (name) => {
  this.name = name;
};

new Person("Sudhir");
```

Output:

```text
TypeError
```

Because:

```text
Arrow functions cannot be used with new.
```

***

### Do Arrow Functions Have `arguments`?

```javascript
const test = () => {
  console.log(arguments);
};
```

Output:

```text
ReferenceError
```

Use rest parameters instead:

```javascript
const test = (...args) => {
  console.log(args);
};
```

***

# Senior React Interview Answer

```javascript
const add = (a, b) => a + b;
```

**Arrow functions** are ES6 functions with shorter syntax. They differ from regular functions because they don't create their own `this`, `arguments`, `super`, or `new.target`. They are heavily used in React for event handlers, callbacks, array methods (`map`, `filter`, `reduce`), and hooks because of their concise syntax and lexical `this` binding. [\[UI_Intervi..._Questions \| Word\]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Shubham S...made(5yrs) \| Word\]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/_layouts/15/Doc.aspx?sourcedoc=%7BCF2D6BE2-3E27-4256-BA5E-4149EB4E2EAB%7D&file=Shubham%20S%20Nemade%285yrs%29.doc&action=default&mobileredirect=true&DefaultItemOpen=1)


Arrow functions are a very common interview topic and are explicitly listed in the internal interview preparation material, along with questions about `this`, higher-order functions, and array methods. [\[UI_Intervi..._Questions \| Word\]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# What is an Arrow Function?

Arrow functions were introduced in ES6 as a concise way to write functions.

### Traditional Function

```javascript
function add(a, b) {
  return a + b;
}
```

### Arrow Function

```javascript
const add = (a, b) => {
  return a + b;
};
```

### Short Form

```javascript
const add = (a, b) => a + b;

console.log(add(10, 20));
```

Output:

```text
30
```

***

# Arrow Functions and `this` Binding

The most important difference:

```text
Normal Function
✅ Has its own this

Arrow Function
❌ Does not have its own this
✅ Uses lexical this
```

***

## Example: Normal Function

```javascript
const user = {
  name: "Sudhir",

  greet: function () {
    console.log(this.name);
  }
};

user.greet();
```

Output:

```text
Sudhir
```

Because:

```javascript
this === user
```

***

## Example: Arrow Function

```javascript
const user = {
  name: "Sudhir",

  greet: () => {
    console.log(this.name);
  }
};

user.greet();
```

Output:

```text
undefined
```

Because:

```javascript
Arrow functions do not create their own this.
```

They inherit `this` from the surrounding scope.

***

# Why Arrow Functions are Popular in React

Before arrow functions:

```jsx
class App extends React.Component {

  constructor() {
    super();

    this.handleClick =
      this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this);
  }

  render() {
    return (
      <button
        onClick={this.handleClick}
      >
        Click
      </button>
    );
  }
}
```

***

## With Arrow Functions

```jsx
class App extends React.Component {

  handleClick = () => {

    console.log(this);

  };

  render() {

    return (
      <button
        onClick={this.handleClick}
      >
        Click
      </button>
    );
  }
}
```

No need for:

```javascript
bind(this)
```

because arrow functions inherit the class instance's `this`.

***

# Arrow Functions in React Functional Components

```jsx
function App() {

  const handleClick = () => {

    console.log(
      "Button Clicked"
    );
  };

  return (
    <button
      onClick={handleClick}
    >
      Click
    </button>
  );
}
```

***

# Arrow Functions with Array Methods

Interviewers frequently combine arrow functions with array methods like `map()`, `filter()`, and `reduce()`.

***

## 1. `map()`

Transforms every element.

```javascript
const numbers =
  [1, 2, 3, 4];

const doubled =
  numbers.map(
    num => num * 2
  );

console.log(doubled);
```

Output:

```javascript
[2, 4, 6, 8]
```

***

### React Rendering with `map()`

```jsx
const users = [
  "Sudhir",
  "John",
  "Apoorva"
];

function App() {

  return (

    <ul>

      {users.map(user => (
        <li key={user}>
          {user}
        </li>
      ))}

    </ul>

  );
}
```

***

## 2. `filter()`

Filters elements.

```javascript
const numbers =
  [1, 2, 3, 4, 5];

const even =
  numbers.filter(
    num => num % 2 === 0
  );

console.log(even);
```

Output:

```javascript
[2, 4]
```

***

### React Search Example

```javascript
const users = [
  "Sudhir",
  "John",
  "Sam"
];

const result =
  users.filter(
    user =>
      user.includes("S")
  );

console.log(result);
```

Output:

```javascript
["Sudhir", "Sam"]
```

***

## 3. `reduce()`

Reduces an array to a single value.

```javascript
const nums =
  [1, 2, 3, 4];

const sum =
  nums.reduce(
    (acc, current) =>
      acc + current,
    0
  );

console.log(sum);
```

Output:

```text
10
```

***

## React Example: Total Price

```javascript
const cart = [
  { price: 100 },
  { price: 200 },
  { price: 300 }
];

const total =
  cart.reduce(
    (sum, item) =>
      sum + item.price,
    0
  );

console.log(total);
```

Output:

```text
600
```

***

# Common Interview Question

### Why use Arrow Functions in `map()`?

```javascript
users.map(
  user => user.name
);
```

Benefits:

```text
✅ Short syntax
✅ Readable code
✅ No manual return needed
✅ Common React pattern
```

***

# Arrow Function vs Normal Function

| Feature                                      | Arrow Function | Normal Function |
| -------------------------------------------- | -------------- | --------------- |
| Short Syntax                                 | ✅              | ❌               |
| Own `this`                                   | ❌              | ✅               |
| Needs `bind(this)` in React Class Components | ❌              | ✅               |
| Constructor (`new`)                          | ❌              | ✅               |
| `arguments` object                           | ❌              | ✅               |
| Great for map/filter/reduce                  | ✅              | ✅               |

***

# Senior React Interview Answer

> Arrow functions use lexical `this`, meaning they inherit `this` from the surrounding scope instead of creating their own. This makes them especially useful in React because event handlers don't require manual binding with `bind(this)`. They are also heavily used with array methods such as `map()`, `filter()`, and `reduce()` for rendering lists, filtering data, and transforming state in a concise and readable way. [\[UI_Intervi..._Questions \| Word\]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/RBT_React.js_1st-7thMar23/Shared%20Documents/General/Day2_React.zip?web=1)
