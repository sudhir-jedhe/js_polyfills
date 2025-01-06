### Explanation of `call()`, `apply()`, and `bind()`

In JavaScript, the `call()`, `apply()`, and `bind()` methods are used to set the context (`this`) of a function and control the way arguments are passed. Although they are similar, they differ in how they pass arguments and how they invoke the function.

Let's break down each method, including examples:

---

### 1. **Function.prototype.call()**
The `call()` method invokes a function with a specified `this` context and individual arguments.

#### Syntax:
```javascript
func.call(thisArg, arg1, arg2, ...);
```

- **`thisArg`**: The value to use as `this` when calling the function.
- **`arg1, arg2, ...`**: Arguments to pass to the function.

#### Example:
```javascript
function printThisAndData(...data) {
  console.log(this.data, ...data);
}

const obj = { data: 0 };
const data = [1, 2, 3];

printThisAndData.call(obj, data);       // logs: 0 [1, 2, 3]
printThisAndData.call(obj, ...data);    // logs: 0 1 2 3
```

- **Key Point**: `call()` immediately invokes the function, and each argument is passed individually.

---

### 2. **Function.prototype.apply()**
The `apply()` method works similarly to `call()`, but it requires arguments to be passed as an array (or array-like object).

#### Syntax:
```javascript
func.apply(thisArg, [arg1, arg2, ...]);
```

- **`thisArg`**: The value to use as `this` when calling the function.
- **`[arg1, arg2, ...]`**: An array or array-like object of arguments to pass to the function.

#### Example:
```javascript
function printThisAndData(...data) {
  console.log(this.data, ...data);
}

const obj = { data: 0 };
const data = [1, 2, 3];

printThisAndData.apply(obj, data);      // logs: 0 1 2 3
printThisAndData.apply(obj, ...data);   // Throws a TypeError
```

- **Key Point**: `apply()` expects the arguments to be passed as an array, not as individual parameters like `call()`.

---

### 3. **Function.prototype.bind()**
The `bind()` method is different from `call()` and `apply()`. It **does not invoke the function immediately**; instead, it returns a new function with the `this` context bound to the specified value and any initial arguments pre-set. The returned function can be invoked later.

#### Syntax:
```javascript
const boundFunc = func.bind(thisArg, arg1, arg2, ...);
```

- **`thisArg`**: The value to use as `this` when the function is called.
- **`arg1, arg2, ...`**: Arguments to pre-set for the function.

#### Example:
```javascript
function printThisAndData(...data) {
  console.log(this.data, ...data);
}

const obj = { data: 0 };
const data = [1, 2, 3];

const printObjAndData = printThisAndData.bind(obj);

printObjAndData(data);                  // logs: 0 [1, 2, 3]
printObjAndData(...data);               // logs: 0 1 2 3

const printObjTwoAndData = printThisAndData.bind(obj, 2);

printObjTwoAndData(data);               // logs: 0 2 [1, 2, 3]
printObjTwoAndData(...data);            // logs: 0 2 1 2 3
```

- **Key Point**: `bind()` creates a new function that can be invoked later with the specified `this` context and any pre-set arguments.

---

### **Real-life Usage Examples**

Understanding the differences between `call()`, `apply()`, and `bind()` can help in various situations when you need to control the `this` context or pass specific arguments to a function. Here are some practical examples:

---

### Example 1: **Bind a Method to an Object**

You can use `apply()` to create a function that invokes a method at a given key of an object, optionally prepending any additional supplied parameters to the arguments.

#### Code:
```javascript
const bindKey = (context, fn, ...boundArgs) => (...args) =>
  context[fn].apply(context, [...boundArgs, ...args]);

const freddy = {
  user: 'fred',
  greet: function(greeting, punctuation) {
    return greeting + ' ' + this.user + punctuation;
  }
};

const freddyBound = bindKey(freddy, 'greet');
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

- **Explanation**: The `bindKey` function binds the `greet` method of the `freddy` object, ensuring that `this` inside `greet` always refers to `freddy`.

---

### Example 2: **Bind All Object Methods**

You can also bind all methods of an object to the object itself, so that their `this` context is always correctly set.

#### Code:
```javascript
const bindAll = (obj, ...fns) =>
  fns.forEach(fn => {
    const f = obj[fn];
    obj[fn] = function() {
      return f.apply(obj, arguments);
    };
  });

let view = {
  label: 'docs',
  click: function() {
    console.log('clicked ' + this.label);
  }
};

bindAll(view, 'click');
document.body.addEventListener('click', view.click); // Logs 'clicked docs' when clicked
```

- **Explanation**: The `bindAll` function binds all methods specified in the object to the object itself, so that `this` in the methods always refers to the object.

---

### Example 3: **Bind Function Context**

If you need to invoke a function with a specific context and optional pre-set arguments, you can use `apply()` or `bind()`.

#### Code:
```javascript
const bind = (fn, context, ...boundArgs) => (...args) =>
  fn.apply(context, [...boundArgs, ...args]);

function greet(greeting, punctuation) {
  return greeting + ' ' + this.user + punctuation;
}

const freddy = { user: 'fred' };
const freddyBound = bind(greet, freddy);
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

- **Explanation**: The `bind` function ensures that the `greet` function always uses `freddy` as its `this` context, and it allows you to pre-set arguments if needed.

---

### Key Takeaways:

- **`call()`**: Immediately invokes the function with the specified `this` context and individual arguments.
- **`apply()`**: Like `call()`, but expects arguments to be passed as an array.
- **`bind()`**: Returns a new function with the `this` context set and allows you to pre-set arguments, but it doesn't invoke the function immediately.

---

By understanding the distinctions and use cases for `call()`, `apply()`, and `bind()`, you can apply these methods to handle function context management and argument passing more effectively in your JavaScript code.