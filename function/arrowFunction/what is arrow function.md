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