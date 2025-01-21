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


const curry = (fn) => {
  const args = [];

  const curried = (...newArgs) => {
    args.push(...newArgs);

    if (args.length < fn.length) {
      return curried;
    } else {
      return fn(...args);
    }
  };

  return curried;
};

// Example usage:
const sum = (a, b, c, d) => a + b + c + d;

const curriedSum = curry(sum);
const result = curriedSum(1)(2)(3)(4); // 1 + 2 + 3 + 4 = 10
console.log(result);  // Output: 10





```js
function curriedSum(a) {
  let sum = a;
  
  function addNext(b) {
    if (b === undefined) {
      return sum;
    }
    sum += b;
    return addNext;
  }
  
  return addNext;
}

// Test the curriedSum function
console.log(curriedSum(1)(2)(3)(4)()); // Should output 10

// Let's break it down step by step
const step1 = curriedSum(1);
console.log(step1()); // 1

const step2 = step1(2);
console.log(step2()); // 3

const step3 = step2(3);
console.log(step3()); // 6

const step4 = step3(4);
console.log(step4()); // 10

// We can also use it with different numbers of arguments
console.log(curriedSum(5)(10)(15)()); // 30
console.log(curriedSum(2)(4)(6)(8)(10)()); // 30
```




// 1. Basic Currying
const basicCurry = (a) => (b) => (c) => a + b + c;
console.log("1. Basic Currying:", basicCurry(1)(2)(3)); // 6

// 2. Partial Application
const partialAdd = (a) => (b) => (c) => a + b + c;
const add5 = partialAdd(5);
const add5and10 = add5(10);
console.log("2. Partial Application:", add5and10(15)); // 30

// 3. Variadic Currying
function variadicCurry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = variadicCurry(sum);
console.log("3. Variadic Currying:", 
  curriedSum(1)(2)(3),      // 6
  curriedSum(1, 2)(3),      // 6
  curriedSum(1)(2, 3),      // 6
  curriedSum(1, 2, 3)       // 6
);

// 4. Infinite Currying
const infiniteCurry = (fn) => {
  const next = (...args) => {
    return (x) => {
      if (x === undefined) {
        return fn(...args);
      }
      return next(...args, x);
    };
  };
  return next();
};

const infiniteSum = infiniteCurry((args) => args.reduce((a, b) => a + b, 0));
console.log("4. Infinite Currying:", infiniteSum(1)(2)(3)(4)(5)()); // 15

// 5. Object-Oriented Currying
const objectCurry = (obj, fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(obj, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
};

const person = {
  name: "John",
  greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

const curriedGreet = objectCurry(person, person.greet);
console.log("5. Object-Oriented Currying:", curriedGreet("Hello")("!")); // Hello, John!

// 6. Lazy Evaluation
const lazyCurry = (fn) => {
  const args = [];
  return function curried(arg) {
    args.push(arg);
    if (args.length === fn.length) {
      const result = fn.apply(this, args);
      args.length = 0; // Reset args for next use
      return result;
    } else {
      return curried;
    }
  };
};

const lazySum = lazyCurry((a, b, c) => a + b + c);
console.log("6. Lazy Evaluation:", lazySum(1)(2)(3)); // 6

// 7. Currying with Default Parameters
const defaultCurry = (a = 0) => (b = 0) => (c = 0) => a + b + c;
console.log("7. Currying with Default Parameters:", 
  defaultCurry(1)(2)(3),  // 6
  defaultCurry(1)(2)(),   // 3
  defaultCurry(1)()()     // 1
);

// 8. Currying with Placeholders
const _ = Symbol('placeholder');
function advancedCurry(fn) {
  return function curried(...args) {
    const complete = args.length >= fn.length && !args.slice(0, fn.length).includes(_);
    if (complete) return fn.apply(this, args);
    return function(...newArgs) {
      const res = args.map(arg => arg === _ && newArgs.length ? newArgs.shift() : arg);
      return curried.apply(this, res.concat(newArgs));
    }
  };
}

const curriedDivide = advancedCurry((a, b) => a / b);
console.log("8. Currying with Placeholders:", 
  curriedDivide(10, 2),    // 5
  curriedDivide(_, 2)(10), // 5
  curriedDivide(10)(2),    // 5
  curriedDivide(_)(10)(2)  // 5
);