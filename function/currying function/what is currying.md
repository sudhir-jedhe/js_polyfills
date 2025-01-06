You've provided a nice example of currying in JavaScript! To expand on it, currying transforms a function that takes multiple arguments into a series of functions that each take one argument. Let's break it down and explain the key concepts:

### 1. **Traditional Function (Non-Curried)**:
```javascript
const multiArgFunction = (a, b, c) => a + b + c;
console.log(multiArgFunction(1, 2, 3)); // 6
```
- This function takes three arguments (`a`, `b`, `c`) and returns their sum. 
- You call it once with all three arguments and get the result.

### 2. **Curried Function**:
```javascript
const curryUnaryFunction = (a) => (b) => (c) => a + b + c;
```
- The function `curryUnaryFunction` is a curried version of `multiArgFunction`.
- It returns a function that accepts the next argument until all arguments have been provided.

### Example Breakdown:
- **Step 1**: `curryUnaryFunction(1)` returns a new function that expects the next argument `b`.
- **Step 2**: `curryUnaryFunction(1)(2)` returns another function that expects the final argument `c`.
- **Step 3**: `curryUnaryFunction(1)(2)(3)` finally computes the result, which is `6`.

### Why Use Currying?
- **Improved Reusability**: You can use a curried function partially. For example, if you only need to provide a specific argument later, you can reuse the curried functions.
- **Functional Composition**: Currying makes it easier to compose functions because you can chain them together and apply each function to a single argument.

### Example of Partial Application (Reusability):
```javascript
const add = (a) => (b) => a + b;

const add5 = add(5);  // `add5` is a function that adds 5 to any number.
console.log(add5(10)); // 15
```
Here, `add5` is a reusable function that adds `5` to any value passed to it.

### Code Summary:
```javascript
const multiArgFunction = (a, b, c) => a + b + c;
console.log(multiArgFunction(1, 2, 3)); // 6

// Curried version of multiArgFunction
const curryUnaryFunction = (a) => (b) => (c) => a + b + c;

console.log(curryUnaryFunction(1)(2)(3)); // 6
```

### Key Takeaways:
- **Currying** makes a function more flexible and reusable.
- A curried function returns a series of functions that take one argument at a time.
- **Partial application** allows you to "pre-fill" some arguments, creating new functions.
