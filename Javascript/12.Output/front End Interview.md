***copy front End Interview.md***

Front end Interview Questions
=============================

-------
To rock the interview to achieve what you deserve and to improve your concepts about front end technologies, I have consolidated a list of questions and answers. It's a one stop solution for front end interview process.

## Table of Contents

* [JavaScript: Basics and Tricky Questions](#javascript-basics-and-tricky-questions)
* [Algorithm Beginners Level](#javascript-algorithm-beginners-level)
* [Intermediate Level Questions](#javascript-for-intermediate-level-developer)
* [css: Basics and Tricky Questions](#css-basics-and-tricky-questions)
* [DOM related Questions](#javascript-dom-related-questions)
* [html: Basic Questions for Beginners](#html-basic-questions-for-begginers)

### [Angular Interview Questions](https://github.com/khan4019/angular-interview-questions)

An exclusive list of Angular interview Questions are [here](https://github.com/khan4019/angular-interview-questions)

## [JavaScript: Basics and Tricky Questions](http://www.thatjsdude.com/interview/js2.html)

21+ questions and answers (for intermediate)
__________________

### 1. Differences between `null` and `undefined`

* **`undefined`**: Represents the unintentional absence of any value. A variable that has been declared but not assigned a value is `undefined`. Functions without a return statement implicitly return `undefined`.
* **`null`**: Represents the intentional assignment of an "empty" or non-existent value. It is explicitly set by code to indicate "no object" or "no value."
* **Type comparison**:
* `typeof undefined === "undefined"`
* `typeof null === "object"` (a historical, unfixable bug in the original JavaScript implementation).

* **Equality**:
* `null == undefined` evaluates to `true` (loose equality treats them as equivalent empty values).
* `null === undefined` evaluates to `false` (distinct primitive types).

* **Arithmetic coercion**: `Number(null) === 0`, whereas `Number(undefined) === NaN`.

---

### 2. Differences between `==` and `===`

* **`==` (Abstract / Loose Equality)**: Compares two values after performing **implicit type coercion** if the operands are of different types according to the ECMAScript Abstract Equality Comparison Algorithm.
* `'5' == 5` is `true` (string converts to number).
* `false == 0` is `true` (boolean converts to number).

* **`===` (Strict Equality)**: Compares both **value and type** without type coercion. If types differ, it returns `false` immediately.
* `'5' === 5` is `false`.
* `null === undefined` is `false`.

* **Edge Cases for `===**`:
* `NaN === NaN` is `false` (use `Number.isNaN()` or `Object.is()`).
* `-0 === +0` is `true` (whereas `Object.is(-0, +0)` is `false`).

---

### 3. How to compare two objects in JavaScript

In JavaScript, objects are compared by reference, not by structure or content. `{} === {}` is `false`.

1. **Shallow Comparison** (compares keys and primitive values one level deep):

```javascript
function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => Object.is(obj1[key], obj2[key]));
}

```

1. **Deep Comparison** (recursive equality traversal):

```javascript
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key]));
}

```

1. **`JSON.stringify(a) === JSON.stringify(b)` Caveat**:

* Works only for basic JSON-safe objects.
* Fails if keys are in a different insertion order (`{ a: 1, b: 2 }` vs `{ b: 2, a: 1 }`).
* Drops `undefined`, functions, symbols, and throws errors on circular references.

---

### 4. 11+ True/False Questions That Will Trick You

```javascript
Boolean([])                     // true  (all objects/arrays are truthy)
Boolean({})                     // true
Boolean(new Boolean(false))     // true  (it is an object wrapper)
[] == false                     // true  ([] -> "" -> 0, false -> 0 => 0 == 0)
[] == ![]                       // true  (![] is false -> [] == false -> 0 == 0)
"" == false                     // true  ("" -> 0, false -> 0)
"0" == false                    // true  ("0" -> 0, false -> 0)
"0" == true                     // false ("0" -> 0, true -> 1)
null >= 0                       // true  (null coerced to 0; 0 >= 0 is true)
null == 0                       // false (loose equality only coerces null to undefined)
undefined == null               // true  (special case in abstract equality)
NaN == NaN                      // false (NaN is never equal to anything, including itself)
[1, 2] == "1,2"                 // true  (array undergoes toString() -> "1,2")

```

---

### 5. As `[]` is true, should `[] == true` also be true?

Let's evaluate this step-by-step:

1. When evaluated in a boolean context (such as `if ([])`), JavaScript converts `[]` via `ToBoolean([])`. Every object reference in JavaScript is **truthy**, so `Boolean([]) === true`.
2. When evaluating `[] == true`, the loose equality operator (`==`) does **not** evaluate truthiness directly. Instead, it follows the ECMAScript coercion algorithm:

* Rule: If one operand is a boolean, convert the boolean to a number first: `true` becomes `1`. The comparison becomes `[] == 1`.
* Rule: Compare an object to a primitive by converting the object via `ToPrimitive([])`. For arrays, `[].toString()` produces `""`. The expression becomes `"" == 1`.
* Rule: Compare a string to a number by converting the string to a number: `Number("")` produces `0`. The comparison becomes `0 == 1`.

1. `0 == 1` evaluates to `false`.

Therefore, the premise that `[] == true` should be true is **incorrect**. `[]` is truthy, but `[] == true` is `false`.

---

### 6. Method on Date instance to get the next day

To add a method available across all instances, extend `Date.prototype`:

```javascript
Date.prototype.getNextDay = function() {
  const next = new Date(this.getTime());
  next.setDate(next.getDate() + 1);
  return next;
};

// Usage:
const today = new Date();
const tomorrow = today.getNextDay();

```

*Note: Using `.setDate(.getDate() + 1)` safely handles month boundaries, leap years, and year rollovers automatically.*

---

### 7. Using an arbitrary object as the value of `this`

1. **`Function.prototype.call(thisArg, arg1, arg2, ...)`**: Invokes immediately with comma-separated arguments.
2. **`Function.prototype.apply(thisArg, [argsArray])`**: Invokes immediately with arguments passed as an array.
3. **`Function.prototype.bind(thisArg, arg1, ...)`**: Returns a new bound function locked permanently to that `this` context for future execution.

```javascript
const user = { name: "Alice" };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

greet.call(user, "Hello", "!");          // "Hello, Alice!"
greet.apply(user, ["Hi", "."]);          // "Hi, Alice."
const boundGreet = greet.bind(user);
boundGreet("Hey", "??");                 // "Hey, Alice??"

```

---

### 8. Function to tell whether 2 is passed as a parameter

```javascript
function hasTwoPassed(...args) {
  return args.includes(2);
}

// Or checking strict identity across arguments:
function containsTwo() {
  return Array.prototype.includes.call(arguments, 2);
}

```

---

### 9. Using `Math.max` to find max value in an array

```javascript
const numbers = [12, 5, 8, 130, 44];

// Modern ES6 spread syntax:
const max1 = Math.max(...numbers);

// Legacy ES5 Function.prototype.apply:
const max2 = Math.max.apply(null, numbers);

// For very large arrays (>65,000 items) where arguments blow the stack:
const max3 = numbers.reduce((acc, curr) => Math.max(acc, curr), -Infinity);

```

---

### 10. What is `this` in JavaScript?

`this` is a keyword representing the execution context of a function. Its value is determined **by how a function is called**, not where it is defined (with the exception of arrow functions):

* **Default Binding**: In non-strict mode, a plain function call points `this` to the global object (`window` or `global`). In strict mode (`'use strict'`), it is `undefined`.
* **Implicit Binding**: When invoked as a method of an object (`obj.method()`), `this` refers to `obj`.
* **Explicit Binding**: Set directly via `.call()`, `.apply()`, or `.bind()`.
* **`new` Binding**: When called with `new MyConstructor()`, `this` binds to the newly created instance.
* **Lexical Binding (Arrow Functions)**: Arrow functions do not bind their own `this`. They inherit `this` from their enclosing lexical scope at creation time.

---

### 11. 21 Quick Questions That Will Trick You

```javascript
1.  typeof NaN                      // "number"
2.  typeof null                     // "object"
3.  typeof (() => {})               // "function"
4.  typeof (class {})               // "function"
5.  0.1 + 0.2 === 0.3               // false (IEEE 754 precision: 0.30000000000000004)
6.  [1, 2, 3] + [4, 5, 6]           // "1,2,34,5,6" (arrays coerce to strings)
7.  {} + []                         // 0 (in raw REPL, {} is treated as an empty block, +[] is 0)
8.  [] + {}                         // "[object Object]"
9.  true + false                    // 1 (1 + 0)
10. +true                           // 1
11. !"false"                        // false (non-empty strings are truthy)
12. 1 < 2 < 3                       // true  ((1 < 2) -> true -> 1 < 3 -> true)
13. 3 > 2 > 1                       // false ((3 > 2) -> true -> 1 > 1 -> false)
14. Math.min() > Math.max()         // true  (Infinity > -Infinity)
15. parseInt(0.0000005)             // 5     (scientific notation "5e-7" -> parses leading '5')
16. [10, 1, 5].sort()               // [1, 10, 5] (default sort is lexicographical)
17. [] == ![]                       // true
18. Array(3)                        // [empty x 3] (sparse array with no indices)
19. (function(){ return typeof arguments; })() // "object"
20. [1, 2, 3].map(parseInt)         // [1, NaN, NaN] (passes element, index, array as args)
21. null instanceof Object          // false

```

---

### 12. Set a prefix before everything logged

Using `Function.prototype.bind`:

```javascript
const log = console.log.bind(console, "(app)");

log("my message"); 
// Output: "(app) my message"

```

---

### 13. Scope & Hoisting Output (Classic Interview Snippet)

Given the canonical hoisting puzzle:

```javascript
var a = 1;
function b() {
  a = 10;
  return;
  function a() {}
}
b();
console.log(a);

```

**Console Output**: `1`

**Why?**
The local `function a() {}` inside `b` is hoisted to the top of `b`'s scope, creating a local variable identifier `a`. The line `a = 10` assigns `10` to that **local** variable `a`, leaving the outer global variable `a` completely unchanged at `1`.

---

### 14. `setTimeout` inside a `for` loop

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

```

* **Output**: `3, 3, 3`
* **Why**: `var` is function-scoped. The loop finishes synchronously, leaving `i = 3`. Later, when the `setTimeout` callbacks execute from the task queue, all three closures reference the exact same global/function-scoped `i`.
* **Fix**: Use `let` instead of `var`. `let` creates a distinct lexical environment binding for each iteration of the loop, outputting `0, 1, 2`.

---

### 15. Deleting a shadowed prototype property

```javascript
const proto = { company: "Persistent" };
const employee = Object.create(proto);
employee.company = "Adobe";

delete employee.company;
console.log(employee.company);

```

* **Output**: `"Persistent"`
* **Why**: The `delete` operator only removes **own** properties from an object. Deleting `employee.company` removes the shadowed property on `employee`. Subsequent property access walks up the prototype chain and finds `proto.company`.

---

### 16. Does JavaScript pass parameters by value or by reference?

JavaScript is strictly **Call by Value** (more accurately called **Call by Sharing** for objects):

1. **Primitives**: Passed by pure value. The function receives a copy of the primitive value. Changes to the parameter inside the function do not affect the outer variable.
2. **Objects**: The value passed is a **copy of the memory reference/pointer** to the object.

* Modifying a property (`obj.x = 10`) mutates the underlying object in memory, visible to the outer reference.
* **Reassigning** the parameter (`obj = { y: 20 }`) merely points the local pointer to a new address; it does not change the caller's original object reference.

---

### 17. Cache / Memoization for recursive Fibonacci

```javascript
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 0) return 0;
  if (n === 1) return 1;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Time complexity drops from O(2^n) to O(n).

```

---

### 18. Generic Memoization Utility

```javascript
function memoize(fn, resolver) {
  const cache = new Map();

  return function(...args) {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage:
const slowSquare = n => { /* expensive work */ return n * n; };
const fastSquare = memoize(slowSquare);

```

---

### 19. Method Chaining with Asynchronous Callbacks

To chain tasks sequentially with callbacks:

```javascript
class AsyncQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  task(fn) {
    this.queue.push(fn);
    if (!this.running) this.step();
    return this; // Enables chaining
  }

  step() {
    if (this.queue.length === 0) {
      this.running = false;
      return;
    }
    this.running = true;
    const nextFn = this.queue.shift();
    nextFn(() => this.step());
  }
}

// Usage:
new AsyncQueue()
  .task((done) => {
    setTimeout(() => { console.log("Task 1 completed"); done(); }, 500);
  })
  .task((done) => {
    setTimeout(() => { console.log("Task 2 completed"); done(); }, 200);
  });

```

---

### 20. Implementing a `moveLeft` Animation

Avoid animating `left` or `margin-left` because they trigger layout reflows. Use **`transform: translateX()`** on the compositor thread with **`requestAnimationFrame`**:

```javascript
function moveLeft(element, distance, duration) {
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out formulation:
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentOffset = -eased * distance;

    element.style.transform = `translateX(${currentOffset}px)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

```

---

### 21. Generic Currying Implementation

Currying transforms a function $f(a, b, c)$ into $f(a)(b)(c)$. It returns a new function until the total expected arity (`fn.length`) is satisfied:

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// Usage:
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
curriedSum(1)(2)(3);    // 6
curriedSum(1, 2)(3);    // 6
curriedSum(1)(2, 3);    // 6

```

#### [JS: Answer for Basics and Tricky Questions](http://www.thatjsdude.com/interview/js2.html)

## [css: Basics and Tricky Questions](http://www.thatjsdude.com/interview/css.html)

21+ questions and answers
____________

1. ### What does `float` do?

`float` removes an element from the normal document flow and shifts it to the left or right edge of its containing block (or another floated element). Inline content and surrounding text flow around its opposite side. It was originally introduced to wrap text around images, though it was historically repurposed for multi-column grid layouts before Flexbox and Grid.

---

### 1 & 2. How can you clear sides of a floating element?

* **`clear` property:** Set on the sibling following the floated element (`clear: left`, `clear: right`, or `clear: both`) to push it below the floating elements.
* **Clearfix Hack:** Applied to the floating elements' parent container:

```css
.container::after {
  content: "";
  display: table;
  clear: both;
}

```

* **Block Formatting Context (BFC):** Setting `overflow: hidden`, `overflow: auto`, or `display: flow-root` on the parent container forces it to contain its floated children without extra markup.

---

### 3. Rapid-Fire Tricky CSS Questions

* **Can an element have both `display: inline` and `width: 200px`?**
Yes, but the `width` rule is ignored.
* **Does `z-index` work on a `static` positioned element?**
No. It requires a positioned element (`relative`, `absolute`, `fixed`, `sticky`) or a flex/grid item.
* **Does `opacity: 0.99` create a stacking context?**
Yes. Any `opacity` less than `1` creates a new stacking context.
* **What is `100vw` vs `100%` on `<body>`?**
`100vw` includes the width of the vertical scrollbar, causing horizontal overflow; `100%` excludes the scrollbar.
* **Does `pointer-events: none` block keyboard navigation?**
No. Users can still focus and activate the element with the `Tab` and `Enter`/`Space` keys.

---

### 4. Are CSS rule names case-sensitive?

**No.** CSS property names, keywords, and `@-rules` are case-insensitive. `COLOR: RED;` works identically to `color: red;`.

---

### 5. Why do CSS selectors mixed up with cases fail to apply styles?

While CSS keywords and standard tag names are case-insensitive, **parts that reference external markup identifiers can be case-sensitive depending on the document type**:

* **Class and ID selectors:** In HTML documents, `.myClass` and `.myclass` are strictly case-sensitive.
* **Attribute selectors:** Attribute values like `[data-status="active"]` or `[href="file.PDF"]` are case-sensitive unless explicitly flagged with the `i` flag: `[data-status="active" i]`.

---

### 6. Does `margin-top` or `margin-bottom` have an effect on inline elements?

**No.** Vertical margins (`margin-top`, `margin-bottom`) are ignored on non-replaced inline elements (`<span>`, `<a>`, `<em>`).

---

### 7. Does `padding-top` or `padding-bottom` have an effect on inline elements?

**Visually yes, structurally no.** The padding increases the background and border area vertically, but it does **not** push adjacent lines apart or affect line height. It simply bleeds into adjacent lines of text without altering the line box flow.

---

### 8. Does `padding-left`, `padding-right`, `margin-left`, or `margin-right` have an effect on inline elements?

**Yes.** Horizontal margins and horizontal padding are fully respected and will push preceding and succeeding inline content horizontally.

---

### 9. Will `<p style="font-size: 10rem">` be responsive when the browser window is resized/dragged?

**No.** `rem` units resolve against the root element's font size (`html { font-size }`). Resizing or dragging the browser window width does not alter the root font size unless an explicit `@media` query or fluid viewport calculation (`clamp()`, `vw`) adjusts the root element.

---

### 10. True/False: `:checked` selects radio/checkbox, but not `<option>` elements

**False.** The `:checked` pseudo-class matches radio buttons, checkboxes, and also `<option>` elements inside `<select>` dropdowns that are currently selected.

---

### 11. True/False: In an HTML document, `:root` always refers to the `<html>` element

**True.** In HTML, `:root` represents the highest parent in the DOM tree, which is always `<html>` (though `:root` has higher specificity than the `html` type selector).

---

### 12. True/False: The `translate()` function can move an element on the z-axis

**False.** The 2D `translate(x, y)` function only accepts X and Y coordinates. Moving on the Z-axis requires `translateZ()` or `translate3d(x, y, z)`.

---

### 13. Which unit to prefer: `px`, `em`, `%`, or `pt`?

* **`rem`:** Best for typography and spacing hierarchies. Respects user browser zoom and OS-level accessibility font settings while remaining globally consistent.
* **`px`:** Best for fine-grained borders (`1px solid`), box shadows, and fixed UI icons.
* **`%`:** Best for responsive layout widths and fluid multi-column containers.
* **`em`:** Best for spacing (e.g., padding/margins on buttons) that needs to scale dynamically with the element's own `font-size`.
* **`pt`:** Strictly intended for print stylesheets (`@media print`); should not be used for screen displays.

---

### 14. Differences: `static`, `relative`, `absolute`, and `fixed`

* **`static` (Default):** Normal document flow. `top`, `right`, `bottom`, `left`, and `z-index` have no effect.
* **`relative`:** Stays in normal flow; visually offset from its own original position via directional properties without affecting surrounding elements. Creates a positioning context for descendants.
* **`absolute`:** Removed completely from document flow. Positioned relative to its closest ancestor with a position other than `static` (or the initial containing block).
* **`fixed`:** Removed from document flow. Positioned relative to the viewport (or an ancestor with a `transform`, `perspective`, or `filter`). Does not move when the page scrolls.

---

### 15. Difference: `visibility: hidden` vs. `display: none`

| Feature                  | `display: none`                                   | `visibility: hidden`                                                    |
| ------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------- |
| **DOM Tree**             | Remains in DOM.                                   | Remains in DOM.                                                         |
| **Render Tree & Layout** | Removed completely; takes up **no layout space**. | Element is invisible, but **preserves its exact space and dimensions**. |
| **Reflow / Repaint**     | Triggers Reflow and Repaint.                      | Triggers Repaint only.                                                  |
| **Child Inheritance**    | Children are unconditionally hidden.              | Children can be made visible via child `visibility: visible`.           |
| **Accessibility**        | Hidden from screen readers.                       | Hidden from screen readers.                                             |

---

### 16. Differences: `inline`, `block`, and `inline-block`

| Property                     | `inline`                               | `block`                                             | `inline-block`                               |
| ---------------------------- | -------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| **Flow**                     | Flows along text line; no line break.  | Breaks onto a new line; takes full available width. | Flows along text line without forced breaks. |
| **`width` & `height**`       | Ignored.                               | Respected.                                          | Respected.                                   |
| **Vertical Margins/Padding** | Visually applied, doesn't affect flow. | Fully respected; affects layout flow.               | Fully respected; affects layout flow.        |

---

### 17. Properties related to the Box Model

* **Content area:** `width`, `min-width`, `max-width`, `height`, `min-height`, `max-height`.
* **Internal spacing:** `padding` (`padding-top`, `padding-right`, `padding-bottom`, `padding-left`, or logical equivalents like `padding-inline`, `padding-block`).
* **Frame:** `border` (`border-width`, `border-style`, `border-color`, `border-radius`).
* **External spacing:** `margin` (`margin-top`, `margin-right`, `margin-bottom`, `margin-left`).
* **Box calculation mode:** `box-sizing` (`content-box` vs. `border-box`).

---

### 18. Does `overflow: hidden` create a new Block Formatting Context (BFC)?

**Yes.** Any value of `overflow` other than `visible` (including `hidden`, `auto`, `scroll`, and `clip`) establishes a new Block Formatting Context. This contains internal floats and prevents vertical margin collapsing with child elements.

---

### 19. How to apply CSS rules specific to a media?

1. **In CSS using `@media`:**

```css
@media print {
  header, footer { display: none; }
}
@media screen and (max-width: 768px) {
  .sidebar { display: none; }
}

```

1. **In HTML `<link>` tag:**

```html
<link rel="stylesheet" href="print.css" media="print">

```

---

### 20. What is the use of `only` in media queries?

The `only` keyword hides stylesheets from older legacy browsers (e.g., IE6-8) that do not understand CSS3 Media Queries. Modern browsers parse `@media only screen and (...)` identically to `@media screen and (...)`.

---

### 21. Does the `screen` keyword apply to physical device screen or browser viewport?

It targets the **medium type** (a visual computer, phone, or tablet screen) rather than print or speech synthesizers. The dimensions evaluated in accompanying queries (e.g., `max-width`) target the **browser viewport**, not the device's physical screen size.

---

### 22. Frequently used pseudo-classes

* **User Interaction:** `:hover`, `:focus`, `:focus-visible`, `:active`.
* **Form State:** `:checked`, `:disabled`, `:valid`, `:invalid`, `:required`.
* **Structural / Tree:** `:first-child`, `:last-child`, `:nth-child(n)`, `:nth-of-type(n)`, `:not()`, `:is()`, `:where()`, `:has()`.

---

### 23. How to align a `<p>` center-center inside a `<div>`?

* **Flexbox:**

```css
div {
  display: flex;
  justify-content: center;
  align-items: center;
}

```

* **Grid:**

```css
div {
  display: grid;
  place-items: center;
}

```

---

### 24. How to optimize CSS selectors?

* **Keep selectors short:** Avoid deep nesting like `div.sidebar ul li a.active` (browsers parse selectors **right-to-left**).
* **Target classes directly:** Prefer `.nav-link-active` over descendant chains.
* **Avoid universal selectors (`*`) in compound rules:** e.g., `.container *`.
* **Favor flat specificity:** Use modern utility selectors like `:where()` to drop selector specificity to zero when building design system primitives.

---

### 25. How to load CSS resources conditionally?

* **Via media attributes in HTML:**

```html
<link rel="stylesheet" href="mobile.css" media="(max-width: 600px)">

```

* **Dynamically with JavaScript:**

```javascript
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'dark-theme.css';
document.head.appendChild(link);

```

* **CSS `@import` (Performance anti-pattern):**

```css
@import url("desktop.css") screen and (min-width: 1024px);

```

---

### 26. Why use CSS sprites?

* **HTTP/1.1 Era:** Combining multiple small icons into a single image sheet reduced round-trip latency by requiring only one HTTP request instead of dozens.
* **Modern context:** Largely superseded by HTTP/2 / HTTP/3 multiplexing, inline SVG sprites (`<svg><use href="#icon"/></svg>`), and font icon vectors.

---

### 27. What is Specificity and how do you calculate it?

Specificity determines which CSS declaration applies when multiple rules match the same element. It is calculated as a 3-column tuple `(A, B, C)`:

1. **A (IDs):** Count of ID selectors (`#header`).
2. **B (Classes, Attributes, Pseudo-classes):** Count of `.class`, `[type="text"]`, and `:hover` (excluding `:not()`, `:is()`, `:where()`, but counting their arguments).
3. **C (Type selectors and Pseudo-elements):** Count of tag names (`div`, `p`) and pseudo-elements (`::before`, `::after`).

*Inline styles* override `(A, B, C)`. The `!important` flag overrides all standard cascading layers and specificity weights.

---

### 28. What is Shadow DOM?

A core pillar of the Web Components standard that provides **DOM encapsulation** and **scoped CSS styles**. Elements inside a Shadow Tree do not leak their styles to the outer page, nor do regular page styles bleed into the Shadow Tree, preventing accidental class name collisions and style leaks.

---

### 29. What do you know about `transition`?

`transition` smoothly interpolates property values between states (e.g., regular state to `:hover`).

* **Shorthand:** `transition: <property> <duration> <timing-function> <delay>;`
* **Performance:** Hardware-accelerated properties (`transform`, `opacity`) run smoothly on the GPU/compositor thread without triggering layout reflows.

---

### 30. CSS Filters

Filters apply graphical effects before rendering elements to the screen:

* `blur(5px)`
* `brightness(1.2)`
* `contrast(200%)`
* `drop-shadow(4px 4px 10px black)`
* `grayscale(100%)`
* `hue-rotate(90deg)`
* `invert(100%)`
* `opacity(50%)`
* `saturate(150%)`
* `sepia(60%)`

---

### 31. Reasons to use a CSS Preprocessor (Sass, Less, PostCSS)

* **Historical needs:** Introduced variables, nesting, mixins, math operations, and imports before native CSS supported them.
* **Modern usage:**
* Advanced compile-time functions, loops (`@for`, `@each`), and automated color manipulation (`color.scale()`).
* Automated vendor prefixing and polyfilling via **PostCSS** / **Autoprefixer**.
* Dynamic asset management and design token generation from design tools.

1. [Show you couple of style example and you have to tell what does it do](http://www.thatjsdude.com/interview/css.html#seeAndTell).

#### [CSS: Answer for Basics and Tricky Questions](http://www.thatjsdude.com/interview/css.html)

### css Deleted questions

Looks like these are for hardcore designer. Hence, didn't make for developers.
______

### 1. How descendant CSS selectors are matched?

As explained in the referenced video ([[00:00](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D0)]), most developers assume browsers match selectors from left to right—first finding the parent (e.g., `nav`) and then searching down the DOM tree for the descendants (e.g., `a`).

However, **browsers evaluate CSS selectors from right to left** ([[02:00](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D120)], [[02:36](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D156)]):

* **The Key Selector:** The rightmost selector in the chain (e.g., `a` in `nav a`) is called the **key selector**. The engine first locates every matching key selector element across the entire document ([[01:17](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D77)]).
* **Walking Up the Tree:** For each matching element, the browser walks *upward* toward the root (`<body>`, `<html>`) checking whether an ancestor satisfies the rest of the selector chain ([[01:24](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D84)], [[01:30](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D90)]).
* **Why do browsers do this?** ([[02:08](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D128)]) It is a major performance optimization: evaluating top-down would require the browser to retain massive subtree branches in memory and traverse down many dead-end paths ([[02:22](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D142)]). Walking up from a leaf node allows the engine to discard non-matching elements almost immediately as soon as an ancestor test fails ([[01:43](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D103)], [[01:55](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DEW8Bg_H_P7M%26t%3D115)]).

Reference: [Watch video explanation on YouTube](https://www.youtube.com/watch?v=EW8Bg_H_P7M).

---

### 2. How would you implement modularity in CSS?

* **CSS Modules:** Scopes CSS locally by automatically transforming class names into unique hashes at build time (e.g., `.button` $\rightarrow$ `.Button_button__a8b9z`), completely preventing global namespace collisions.
* **Methodologies (BEM):** **Block Element Modifier** (`.block__element--modifier`) provides an explicit semantic hierarchy, avoids deep selector nesting, and keeps selector specificity low and uniform.
* **Component-Scoped CSS / CSS-in-JS:** Encapsulating styles inside components using tooling like Styled Components, Emotion, or framework primitives like Svelte/Vue `<style scoped>`.
* **CSS Cascade Layers (`@layer`):** Organizing architecture into defined priority tiers (`@layer reset, base, components, utilities`) to control cascade precedence without specificity wars.
* **Native Web Components (Shadow DOM):** Using Shadow DOM to achieve hard encapsulation boundaries where outer styles cannot bleed in and internal styles cannot bleed out.

---

### 3. Approaching browser-specific issues (e.g., legacy browsers / IE8)

1. **Assess Support Matrix & Business Impact:** Check analytics to confirm active traffic volume from the target browser before allocating engineering resources.
2. **Feature Detection over User-Agent Sniffing:** Use tools like `Modernizr` or CSS `@supports` rather than fragile `navigator.userAgent` string checks.
3. **Polyfills & Shims:**

* **HTML5 tags:** Use `html5shiv` so legacy engines recognize semantic elements (`<main>`, `<article>`).
* **CSS compatibility:** Use `Respond.js` for media query support, CSS3 PIE for borders/shadows, or fallback stylesheets served via conditional comments.

1. **Graceful Degradation:** Ensure content is readable and forms function, even if advanced animations, shadows, or multi-column layouts fall back to a single-column layout.

---

### 4. How do you test cross-browser compatibility?

* **Cloud Testing Suites:** Run parallel tests across real devices and operating systems using **BrowserStack**, **Sauce Labs**, or **Lambdatest**.
* **Automated E2E Testing:** Use tools like **Playwright** or **Selenium** to run headless cross-engine matrix tests (Chromium, WebKit, Gecko) in CI/CD pipelines.
* **Local Multi-Engine Verification:** Testing directly across Canary, Safari Technology Preview, and Firefox Developer Edition.
* **Static Analysis:**
* Use **caniuse.com** data integrated into builds via **Browserslist**.
* Use **Stylelint** and **ESLint** plugins (e.g., `eslint-plugin-compat`) to catch unsupported syntax before deployment.

---

### 5. Notable CSS hacks / workarounds

* **The Checkbox Hack:** Using a hidden `<input type="checkbox">` paired with the `:checked` pseudo-class and sibling combinator (`+` or `~`) to build pure-CSS accordion menus, light/dark mode switches, and modals without running a single line of JavaScript.
* **Intrinsic Aspect-Ratio Hack (Padding-Bottom):** Before native `aspect-ratio: 16 / 9` was standardized, creating fluid containers using `padding-bottom: 56.25%` (since vertical padding percentages are calculated relative to parent *width*).
* **Scrollbar Width Compensation:** Setting `scrollbar-gutter: stable` or calculating viewport differences (`calc(100vw - 100%)`) to eliminate page jumps when modal backdrops lock page scrolling.

---

### 6. What is Grid layout?

**CSS Grid** is a native **two-dimensional** layout system capable of handling both rows and columns simultaneously (unlike Flexbox, which is primarily one-dimensional).

* **Defining Grids:** Containers declare tracks using `grid-template-columns` and `grid-template-rows`.
* **Flexible Units (`fr`):** Allocates remaining free space fractionally (e.g., `grid-template-columns: 200px 1fr 2fr`).
* **Auto-responsive layouts:** Eliminates media queries for repetitive grids using:

```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

```

* **Named Template Areas:** Allows layout diagrams directly in CSS using `grid-template-areas`.

---

### 7. How to make a site responsive?

1. **Fluid Viewport Meta Tag:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

```

1. **Fluid Layout Systems:** Rely on CSS Grid, Flexbox, and fractional/percentage sizing rather than fixed pixel dimensions.
2. **Media Queries (`@media`):** Apply breakpoint-driven layout adjustments following a mobile-first architecture (`min-width`).
3. **Fluid Typography & Spacing:** Use the `clamp()` function (e.g., `font-size: clamp(1rem, 2.5vw, 2.5rem)`) for continuous scaling between screen sizes.
4. **Adaptive Media:** Use `<img>` with `srcset` and `<picture>` elements to serve appropriately sized images per viewport density and dimension.

---

### 8. Why CSS Reset is useful vs. How Normalize.css works

* **CSS Reset (e.g., Eric Meyer's Reset):**
* **Goal:** Strips away *all* default browser styles (margins, paddings, borders, list styles, heading font sizes) down to a uniform, unstyled baseline.
* **Drawback:** Requires re-declaring basic styles for elements like `<strong>`, `<ul>`, and `<h1>`.

* **Normalize.css:**
* **Goal:** Preserves useful browser default styling rather than erasing it.
* **How it works:** Normalizes inconsistencies between browser user-agent stylesheets (e.g., fixing form element alignment, default line-heights, standardizing font smoothing across OSs) and fixes common cross-browser rendering bugs without blanket-zeroing styles.

---

### 9. Text Shadows vs. Box Shadows

#### `text-shadow`

Applies shadow effects strictly to text glyphs:

* **Syntax:** `text-shadow: <offset-x> <offset-y> <blur-radius> <color>;`
* *Note:* Does not accept a `spread-radius` or an `inset` keyword.

#### `box-shadow`

Applies shadow effects to an element's structural bounding box (following its `border-radius`):

* **Syntax:** `box-shadow: [inset] <offset-x> <offset-y> <blur-radius> <spread-radius> <color>;`
* **`inset`:** Renders the shadow inside the frame rather than casting outward.
* **`spread-radius`:** Expands or contracts the shadow footprint before blur is applied.
* **Stacking:** Both properties support comma-separated lists to build realistic, layered elevation effects (e.g., Material elevation scales).

## [JavaScript: Algorithm Beginners Level](http://www.thatjsdude.com/interview/js1.html)

20 questions and answers (for beginners)
__________________

### 1. Verify a Prime Number

A prime number is greater than 1 and has no positive divisors other than 1 and itself. Checking up to $\sqrt{n}$ with a $6k \pm 1$ optimization gives $O(\sqrt{n})$ time complexity.

```javascript
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
  }
  return true;
}

```

---

### 2. Find All Prime Factors of a Number

Extract factors of 2 first, then iterate through odd numbers up to $\sqrt{n}$. Time complexity is $O(\sqrt{n})$.

```javascript
function primeFactors(n) {
  const factors = [];
  
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }

  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }

  if (n > 2) factors.push(n);
  return factors;
}

```

---

### 3. Get $n$-th Fibonacci Number

Iterative solution using two pointers achieves $O(n)$ time and $O(1)$ space.

```javascript
function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

```

---

### 4. Greatest Common Divisor (GCD) of Two Numbers

Using the Euclidean Algorithm: $\gcd(a, b) = \gcd(b, a \pmod b)$ in $O(\log(\min(a, b)))$ time.

```javascript
function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

```

---

### 5. Remove Duplicate Members from an Array

* **Using `Set` (ES6):**

```javascript
const removeDuplicates = arr => [...new Set(arr)];

```

* **In-place on an already sorted array ($O(1)$ extra space):**

```javascript
function removeDuplicatesSorted(arr) {
  if (arr.length === 0) return 0;
  let writeIndex = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      arr[writeIndex++] = arr[i];
    }
  }
  arr.length = writeIndex;
  return arr;
}

```

---

### 6. Merge Two Sorted Arrays

Two-pointer technique in $O(n + m)$ time.

```javascript
function mergeSortedArrays(arr1, arr2) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i++]);
    } else {
      result.push(arr2[j++]);
    }
  }

  while (i < arr1.length) result.push(arr1[i++]);
  while (j < arr2.length) result.push(arr2[j++]);

  return result;
}

```

---

### 7. Swap Two Numbers Without a Temp Variable

* **ES6 Destructuring:**

```javascript
[a, b] = [b, a];

```

* **Arithmetic Operations:**

```javascript
a = a + b;
b = a - b;
a = a - b;

```

* **Bitwise XOR (Integers only):**

```javascript
a = a ^ b;
b = a ^ b;
a = a ^ b;

```

---

### 8. Reverse a String in JavaScript

* **Built-in method:**

```javascript
const reverseString = str => [...str].reverse().join('');

```

*(Using `[...str]` properly preserves Unicode surrogate pairs like emojis).*

* **Manual two-pointer loop:**

```javascript
function reverseStringManual(str) {
  const chars = [...str];
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars.join('');
}

```

---

### 9. Reverse Words in a Sentence

Reverses the order of words while preserving individual word spelling (e.g., `"hello world"` $\rightarrow$ `"world hello"`).

```javascript
function reverseWords(sentence) {
  return sentence.trim().split(/\s+/).reverse().join(' ');
}

```

---

### 10. Reverse Words in Place

Reverses the characters of each individual word while keeping word positions identical (e.g., `"hello world"` $\rightarrow$ `"olleh dlrow"`).

```javascript
function reverseWordsInPlace(sentence) {
  return sentence
    .split(' ')
    .map(word => [...word].reverse().join(''))
    .join(' ');
}

```

---

### 11. Find the First Non-Repeating Character in a String

Single-pass frequency mapping followed by an index check in $O(n)$ time.

```javascript
function firstNonRepeatingChar(str) {
  const charCount = new Map();

  for (const char of str) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (const char of str) {
    if (charCount.get(char) === 1) {
      return char;
    }
  }

  return null;
}

```

---

### 12. Remove Duplicate Characters from a String

```javascript
function removeDuplicateChars(str) {
  return [...new Set(str)].join('');
}

```

---

### 13. Verify a Word as a Palindrome

Two-pointer comparison ignoring non-alphanumeric characters and case.

```javascript
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;

  while (left < right) {
    if (clean[left] !== clean[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

```

---

### 14. Generate Random Integer Between 5 and 7

Given an arbitrary `rand5()` that returns uniform random integers $[1, 5]$, generate uniform integers in range $[5, 7]$ using **Rejection Sampling**:

```javascript
// Base random generator: 1 to 5 inclusive
function rand5() {
  return 1 + Math.floor(Math.random() * 5);
}

// Generate uniform random between 5 and 7 inclusive
function rand5To7() {
  let val;
  // Generate numbers from 1 to 25 uniformly
  do {
    val = (rand5() - 1) * 5 + rand5(); // 1 to 25
  } while (val > 21); // 21 is largest multiple of 3 <= 25

  // Map 1..21 uniformly to 0..2, then shift to 5..7
  return 5 + ((val - 1) % 3);
}

```

---

### 15. Find Missing Number from Unsorted Array ($1$ to $n$)

Using Gauss's summation formula: $\text{Sum} = \frac{n(n + 1)}{2}$ in $O(n)$ time and $O(1)$ space.

```javascript
function findMissingNumber(arr) {
  const n = arr.length + 1; // Array has size n - 1
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}

```

---

### 16. Two Sum: Find Two Numbers that Equal a Target

Using a hash set for $O(n)$ time complexity.

```javascript
function twoSum(arr, target) {
  const seen = new Set();

  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      return [complement, num];
    }
    seen.add(num);
  }

  return null;
}

```

---

### 17. Find the Largest Sum of Any Two Elements

Tracks the two highest values in a single pass in $O(n)$ time without sorting ($O(n \log n)$).

```javascript
function largestSumOfTwo(arr) {
  if (arr.length < 2) return null;

  let max1 = -Infinity;
  let max2 = -Infinity;

  for (const num of arr) {
    if (num > max1) {
      max2 = max1;
      max1 = num;
    } else if (num > max2) {
      max2 = num;
    }
  }

  return max1 + max2;
}

```

---

### 18. Total Number of Zeros from $1$ to $n$

Counts the frequency of the digit `'0'` appearing in each position (units, tens, hundreds) up to $n$ in $O(\log_{10} n)$ time.

```javascript
function countZerosUpTo(n) {
  let count = 0;
  let factor = 1;

  while (factor <= n) {
    const higher = Math.floor(n / (factor * 10));
    const current = Math.floor((n / factor) % 10);
    const lower = n % factor;

    if (current === 0) {
      count += (higher - 1) * factor + (lower + 1);
    } else {
      count += higher * factor;
    }

    factor *= 10;
  }

  return count;
}

```

---

### 19. Check Whether a String is a Substring of a Bigger String

* **Native method:**

```javascript
const isSubstring = (bigger, sub) => bigger.includes(sub);

```

* **Knuth-Morris-Pratt (KMP) linear scan ($O(n + m)$ time):**

```javascript
function kmpSearch(text, pattern) {
  if (!pattern) return true;
  const lps = computeLPS(pattern);
  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) return true;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return false;
}

function computeLPS(pattern) {
  const lps = Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }
  return lps;
}

```

---

### 20. Get Permutations of a String

Backtracking algorithm to generate all $n!$ unique permutations.

```javascript
function getPermutations(str) {
  const results = [];
  const chars = [...str];

  function backtrack(start) {
    if (start === chars.length - 1) {
      results.push(chars.join(''));
      return;
    }

    const seen = new Set();
    for (let i = start; i < chars.length; i++) {
      if (seen.has(chars[i])) continue; // Avoid duplicate branches
      seen.add(chars[i]);

      [chars[start], chars[i]] = [chars[i], chars[start]];
      backtrack(start + 1);
      [chars[start], chars[i]] = [chars[i], chars[start]]; // Backtrack
    }
  }

  backtrack(0);
  return results;
}

```

#### [JS: Answer for Algorithm Beginners Level](http://www.thatjsdude.com/interview/js1.html)

## JavaScript for Intermediate Level Developer

### 1. What is the Event Loop?

JavaScript is a single-threaded runtime with a single call stack. The **Event Loop** is the continuous orchestration process that coordinates code execution, Web APIs, and task queues to enable non-blocking asynchronous behavior.

Its core job is straightforward: **monitor the Call Stack**. When the Call Stack is completely empty, it takes tasks from the queues and pushes them onto the Call Stack to execute.

```
       +---------------------------------------------+
       |                  CALL STACK                 |
       |  (Executes functions synchronously LIFO)    |
       +----------------------+----------------------+
                              |
                              | Delegates async jobs
                              v
       +---------------------------------------------+
       |               WEB APIS / C++                |
       |  (Timers, Fetch/XHR, DOM Events, IO)        |
       +----------------------+----------------------+
                              |
                              | When ready, queues callbacks
                              v
       +---------------------------------------------+
       |             MICROTASK QUEUE (High)          |
       |  (Promise.then/catch/finally, queueMicrotask)|
       +---------------------------------------------+
       |              MACROTASK QUEUE (Low)          |
       |  (setTimeout, setInterval, setImmediate)    |
       +----------------------+----------------------+
                              |
                     [ THE EVENT LOOP ]
      (If Call Stack is empty: drain Microtasks -> 1 Macrotask)
                              |
                              +---> Pushes back to Call Stack

```

* **Execution Order Priority:**

1. Synchronous code in the **Call Stack** runs to completion.
2. All jobs in the **Microtask Queue** are processed until completely empty (including microtasks queued by other microtasks).
3. The browser optionally performs a **Render/Repaint** pass.
4. The oldest job from the **Macrotask Queue** is picked and pushed to the Call Stack.

---

### 2. How do you explain Closure?

A **closure** is created whenever a function retains access to variables from its parent (lexical) scope, even after that parent function has finished executing and returned.

In memory terms: JavaScript functions hold an internal reference (`[[Environment]]`) to their outer lexical environment. Because the inner function still points to those outer variables, the garbage collector does not destroy the parent's variable record.

```javascript
function createCounter(initialValue) {
  let count = initialValue; // Kept alive in heap memory by closure

  return {
    increment() { return ++count; },
    get() { return count; }
  };
}

const counter = createCounter(0);
console.log(counter.increment()); // 1
console.log(counter.get());       // 1

```

* **Primary Use Cases:** Data privacy/encapsulation, partial application/currying, event handlers holding component state, and memoization caches.

---

### 3. How to ensure `this` works correctly inside `setTimeout`?

When a normal function callback runs inside `setTimeout`, it is invoked by the runtime timer in the global execution context, causing `this` to point to `window` (or `undefined` in strict mode).

#### Approach 1: Arrow Function (Preferred)

Arrow functions do not bind their own `this`; they capture `this` lexically from their enclosing scope:

```javascript
class Timer {
  constructor() {
    this.seconds = 0;
  }
  start() {
    setTimeout(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}

```

#### Approach 2: Explicit Binding via `.bind()`

```javascript
setTimeout(function() {
  this.seconds++;
}.bind(this), 1000);

```

#### Approach 3: Capturing via Closure (Legacy ES5)

```javascript
var self = this;
setTimeout(function() {
  self.seconds++;
}, 1000);

```

---

### 4. What are the different possible values for `this`?

The value of `this` is evaluated at call time based on **call-site rules** (ranked from lowest to highest precedence):

| Invocation Pattern     | Example                            | Value of `this`                                                            |
| ---------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| **Default Binding**    | `foo()`                            | Global object (`window` in browsers), or `undefined` in `'use strict'`.    |
| **Implicit Binding**   | `obj.foo()`                        | The immediate calling object to the left of the dot (`obj`).               |
| **Explicit Binding**   | `foo.call(ctx)`, `foo.apply(ctx)`  | Explicitly set to the provided target object (`ctx`).                      |
| **Hard Binding**       | `const fn = foo.bind(ctx)`         | Permanently locked to the provided object (`ctx`).                         |
| **`new` Binding**      | `const inst = new Foo()`           | The newly constructed instance object in memory.                           |
| **Lexical Binding**    | `() => {}`                         | Inherits `this` from the outer scope where the arrow function was defined. |
| **DOM Event Listener** | `el.addEventListener('click', fn)` | The DOM element receiving the event (`event.currentTarget`).               |

---

### 5. What is Debounce and how to implement it?

**Debounce** limits the execution frequency of an expensive function by delaying its execution until a specified idle duration has elapsed since the **last** time it was triggered. If the event fires again before the timer expires, the timer resets.

* **Common Use Cases:** Auto-complete search inputs, window resize listeners, auto-saving text inputs.

```javascript
function debounce(fn, delay = 300) {
  let timerId = null;

  return function(...args) {
    const context = this;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(context, args);
      timerId = null;
    }, delay);
  };
}

// Usage:
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 400);

```

---

### 6. How would you communicate with a server?

1. **`fetch()` API (Modern Standard):** Native Promise-based HTTP client for REST/GraphQL endpoints supporting streaming and `AbortController` cancellation.
2. **WebSockets (`new WebSocket()`):** Full-duplex, persistent bidirectional TCP socket connection for real-time applications (chat, live financial tickers, collaborative editing).
3. **Server-Sent Events (`EventSource`):** Unidirectional, persistent HTTP stream where the server pushes updates/events to the client over standard HTTP.
4. **WebRTC (`RTCPeerConnection`):** Peer-to-peer data channels and audio/video streaming with signaling performed through a server.
5. **XMLHttpRequest (XHR):** Legacy asynchronous HTTP client; primarily relevant today for tracking upload progress events.

---

### 7. Explain a Promise to your grandmother

> "Imagine you ask me to bake you a fresh batch of apple pie.
> I cannot hand you the hot pie instantly, but I hand you a **claim receipt**. That receipt is a **Promise**.
> Right now, it is **Pending** while I work in the kitchen. You can go back to reading your book without waiting at the counter.
> In a little while, one of two things will happen:
>
> 1. Everything goes well: I bring you a warm, delicious slice of pie (**Resolved / Fulfilled**).
> 2. The oven breaks or I burn it: I come out, apologize, and explain what went wrong (**Rejected**).
>
>
> Once that receipt is fulfilled or rejected, the outcome is final—you can't change it."

---

### 8. If a website is slow, how would you make it faster?

Follow an evidence-based pipeline: **Measure $\rightarrow$ Locate Bottlenecks $\rightarrow$ Remediate $\rightarrow$ Monitor**.

* **Audit & Profile:** Use Chrome DevTools Performance Profiler, Lighthouse, and Web Vitals metrics (LCP, INP, CLS).
* **Fix Network & Delivery (LCP & TTFB):**
* Deploy assets behind a CDN with HTTP/2 or HTTP/3 multiplexing.
* Enable Brotli/Gzip compression on all text payloads.
* Set long-term immutable caching (`max-age=31536000, immutable`) for hashed bundles.
* Convert visual assets to AVIF/WebP and configure responsive `srcset`.

* **Optimize Critical Rendering Path:**
* Inline above-the-fold critical CSS; load non-critical CSS asynchronously.
* Load scripts using `defer` or `<script type="module">`.

* **Fix JavaScript Execution & Main-Thread Blocking (INP):**
* Route-based and component-based dynamic code-splitting (`import()`).
* Remove unused dependencies via tree-shaking.
* Offload heavy processing to Web Workers.
* Debounce input handlers and replace layout-thrashing DOM mutations with CSS transitions using `transform` and `opacity`.

---

### 9. What ES6+ features do you use (besides `let`, `const`, and arrow functions)?

* **Destructuring & Spread/Rest:** Object and array unpacking, immutably merging objects (`{ ...state, updated }`), and collecting arguments (`...rest`).
* **Template Literals:** Multi-line string interpolation and tagged templates (`styled.div```...```).
* **Modules (`import` / `export`):** Native ES module system for static analysis, tree-shaking, and code bundling.
* **Promises & `async`/`await`:** Clean, synchronous-looking asynchronous control flows.
* **Optional Chaining (`?.`) & Nullish Coalescing (`??`):** Safe property navigation (`user?.profile?.address`) and defaulting strictly on `null`/`undefined`.
* **Classes & Static Methods:** Syntactic sugar over prototype delegation with private fields (`#privateField`).
* **Collections (`Map`, `Set`, `WeakMap`, `WeakSet`):** High-performance hash maps, unique sets, and memory-safe cache registries that avoid memory leaks.
* **Symbols:** Creating truly unique, non-colliding object property keys.

---

### 10. Preferred Build Tool and Advantages

**Primary Tool: Vite** (powered by **Rollup** for production and **esbuild** for dependencies).

* **Near-Instant Development Server Startup:** Vite serves source code over native browser ES Modules (ESM). It avoids bundling the entire application on startup, loading modules strictly on-demand.
* **Extremely Fast Hot Module Replacement (HMR):** Updates modified modules in milliseconds regardless of application scale because the bundler does not need to rebuild the dependency graph.
* **Pre-bundling with esbuild:** Internal dependencies written in CommonJS or UMD are converted and pre-bundled via Go-based `esbuild`, running 10x to 100x faster than traditional JavaScript-based bundlers.
* **Production-Optimized Builds:** Employs Rollup for tree-shaking, automated code-splitting, CSS code-splitting per route, and dynamic asset hashing out of the box.
* **Unified Plugin Ecosystem:** Shares the rich Rollup plugin architecture with minimal boilerplate compared to legacy Webpack configurations.

## [JavaScript: DOM related Questions](http://www.thatjsdude.com/interview/dom.html)

21+ questions and answers (for intermediate JS Developers)
__________________

### 1. Difference between `window` and `document`

* **`window`**: Represents the **browser window / viewport** and acts as the root global execution context for JavaScript in the browser. Global variables, functions, and Web APIs (`setTimeout`, `localStorage`, `fetch`) are properties of `window`. It controls browser-level actions such as opening tabs, scrolling, and retrieving screen dimensions.
* **`document`**: A property of the `window` object (`window.document`). It represents the **Document Object Model (DOM)** of the loaded HTML page and provides the programming interface to query, create, mutate, and manipulate page content, elements, and styles.

---

### 2. Does `document.onload` and `window.onload` fire at the same time?

* **`document.onload`** does not reliably exist as a standard event on the HTML `document` object across browsers (it typically fails silently or does not fire).
* The event meant for the document is **`DOMContentLoaded`** (attached via `document.addEventListener('DOMContentLoaded', fn)`), which fires as soon as the HTML parsing is complete and the DOM tree is built, **without** waiting for stylesheets, images, and subframes to finish loading.
* **`window.onload`** fires much later: only after the HTML document, all external stylesheets, scripts, images, and embedded iframes have **completely finished downloading**.

---

### 3. Is an attribute similar to a property?

They are related but distinctly different concepts:

* **Attribute (`getAttribute` / `setAttribute`)**:
* Exists in the **raw HTML markup**.
* Values are always strings.
* Represents the **initial/default** state of an element.

* **Property (DOM Object Property)**:
* Exists on the **JavaScript DOM node object** in memory.
* Can be of any JavaScript type (boolean, object, number, string).
* Represents the **live, current runtime** state.

*Example of divergence:*

```html
<input id="user" type="text" value="Alice">

```

```javascript
const input = document.getElementById('user');
input.value = "Bob"; // User changes the text

console.log(input.getAttribute('value')); // "Alice" (initial attribute)
console.log(input.value);                // "Bob"   (current live property)

```

Another common divergence is boolean attributes: `<input type="checkbox" checked>` has attribute `'checked' = ""` or `'checked'`, while the property `input.checked` evaluates to boolean `true` or `false`.

---

### 4. Different ways to get an element from the DOM

* **Traditional Methods (Return Live Collections or direct elements):**
* `document.getElementById('id')` — returns a single `Element` (fastest ID lookup).
* `document.getElementsByTagName('tag')` — returns a live `HTMLCollection`.
* `document.getElementsByClassName('class')` — returns a live `HTMLCollection`.
* `document.getElementsByName('name')` — returns a live `NodeList` (useful for radio/form inputs).

* **Modern Selector API (Return Static Collections or single elements):**
* `document.querySelector('selector')` — returns the first matching `Element` or `null`.
* `document.querySelectorAll('selector')` — returns a static `NodeList` of all matches.

---

### 5. Fastest way to select elements using CSS selectors

1. **Prefer dedicated native lookup methods where applicable:**

* `document.getElementById('header')` is significantly faster than `document.querySelector('#header')` because the browser uses an internal hash map directly.
* `document.getElementsByClassName('btn')` is faster than `document.querySelectorAll('.btn')`.

1. **Scope searches to specific subtrees:**
Instead of searching the entire document with `document.querySelector('.card .title')`, cache the parent and query from it:

```javascript
const card = document.getElementById('myCard');
const title = card.querySelector('.title');

```

1. **Keep selectors flat and avoid excessive nesting:** Right-to-left evaluation means `.a .b .c .d` checks every `.d` node against multiple ancestors.

---

### 6. Why can't you use `forEach` or array methods on a `NodeList`?

* A `NodeList` is an **array-like object**, not an instance of `Array`. It contains numeric indices and a `.length` property, but does not inherit from `Array.prototype`.
* In modern browsers, `NodeList.prototype.forEach` is natively implemented. However, array methods like `.map()`, `.filter()`, `.reduce()`, `.slice()`, or `.some()` are missing.
* **To convert it to a real array:**

```javascript
const elements = Array.from(document.querySelectorAll('.item'));
// Or via spread operator:
const elements = [...document.querySelectorAll('.item')];

```

---

### 7. Implementing `getElementByAttribute`

Using modern `querySelector`:

```javascript
function getElementByAttribute(attribute, value, root = document) {
  if (value !== undefined) {
    return root.querySelector(`[${attribute}="${CSS.escape(value)}"]`);
  }
  return root.querySelector(`[${attribute}]`);
}

function getAllElementsByAttribute(attribute, value, root = document) {
  const selector = value !== undefined 
    ? `[${attribute}="${CSS.escape(value)}"]` 
    : `[${attribute}]`;
  return [...root.querySelectorAll(selector)];
}

```

---

### 8. Add a class to an element using `querySelector`

```javascript
const element = document.querySelector('.my-target');
if (element) {
  element.classList.add('active', 'highlight');
}

```

---

### 9. Verify whether one element is a child of another

* **Direct Child Check:**

```javascript
const isDirectChild = parent.contains(child) && child.parentElement === parent;

```

* **Any Descendant (Child, Grandchild, etc.):**

```javascript
const isDescendant = parent.contains(child);

```

* **Using `closest()` from the child:**

```javascript
const isDescendant = child.closest('#parentElementId') !== null;

```

---

### 10. Best way to create a DOM element: `innerHTML` vs `createElement`

| Consideration       | `document.createElement()`                                                        | `element.innerHTML`                                                                 |
| ------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Security**        | **Safe from XSS**. User input assigned to `.textContent` is never parsed as code. | **High XSS risk** if concatenating unsanitized user data.                           |
| **Performance**     | Optimal for single/few elements or dynamic node references.                       | Faster for parsing large chunks of static, complex HTML at once.                    |
| **Event Listeners** | Existing event listeners inside target container remain intact.                   | **Destroys and re-parses** all child nodes, stripping all attached event listeners. |
| **Maintainability** | Provides direct JS references to append events or attributes immediately.         | Requires re-querying the DOM after insertion to attach logic.                       |

*Verdict:* Use `document.createElement` (or `<template>` tags) for dynamic components with event bindings. Use `innerHTML` (or `insertAdjacentHTML`) only with trusted/sanitized HTML templates.

---

### 11. What is `createDocumentFragment` and why use it?

A `DocumentFragment` is a lightweight, minimal container node that exists solely **in memory** and is not part of the active DOM tree.

* **Why use it:** Appending elements directly to the live DOM one-by-one triggers reflows and repaints on every append. When appending child nodes to a `DocumentFragment`, no reflow occurs. When the fragment is appended to the live DOM, all its children are inserted in a **single DOM operation**, and the empty fragment container disappears.

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}

// Triggers only 1 layout reflow for all 1,000 items:
document.getElementById('list').appendChild(fragment);

```

---

### 12. What is reflow? Causes and mitigation

**Reflow (Layout):** The process where the browser calculates the geometric dimensions, positions, and shapes of all elements in the render tree.

* **Causes of Reflow:**
* Adding, removing, or reordering DOM nodes.
* Resizing the browser window or changing font family/size.
* Mutating styles that affect geometry: `width`, `height`, `margin`, `padding`, `display`, `top`, `left`, `border`.
* Reading layout metrics right after mutating styles (**Forced Synchronous Layout / Layout Thrashing**): e.g., reading `offsetWidth`, `clientHeight`, `scrollTop`, or calling `getBoundingClientRect()`.

* **How to Reduce Reflow:**
* Batch DOM writes using `DocumentFragment` or `requestAnimationFrame`.
* Avoid querying geometry immediately after setting layout properties.
* Animate using `transform` and `opacity` instead of `top`/`left`/`width` (compositor-only, zero reflow).
* Use `display: none` off-screen while performing batch modifications.

---

### 13. What is repaint and when does it happen?

**Repaint:** The browser paints pixels onto layers on the screen to reflect visual appearance without altering geometry or layout boundaries.

* **When it happens:** Whenever visual attributes that do not alter layout geometry are updated.
* *Examples:* Modifying `color`, `background-color`, `visibility`, `box-shadow`, `outline`, or `border-style`.
* *Note:* Every reflow triggers a repaint, but a repaint can happen without triggering a reflow.

---

### 14. Run JavaScript when the DOM is ready (Vanilla alternative to `$(document).ready`)

```javascript
function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn(); // DOM already constructed
  }
}

onReady(() => {
  console.log('DOM fully parsed and ready!');
});

```

---

### 15. What is Event Bubbling and DOM Event Flow?

The standard W3C event flow consists of **3 phases**:

```
                 | |
  1. Capturing   | |  3. Bubbling
     Phase       | |     Phase
                 v |
             [Target Node]

```

1. **Capturing Phase:** The event travels downward from `window` $\rightarrow$ `document` $\rightarrow$ `<html>` $\rightarrow$ `<body>` down through ancestors to the target.
2. **Target Phase:** The event reaches the element where the interaction occurred (`event.target`).
3. **Bubbling Phase:** The event travels back upward from the target element through all parent ancestors up to `window`.

`event.stopPropagation()` stops the event from traversing further along the chain.

---

### 16. Destroy multiple list items with one click handler (Event Delegation)

Attach a single listener to the parent `<ul>` using **Event Delegation**:

```html
<ul id="itemList">
  <li>Item 1 <button class="delete-btn">Delete</button></li>
  <li>Item 2 <button class="delete-btn">Delete</button></li>
  <li>Item 3 <button class="delete-btn">Delete</button></li>
</ul>

```

```javascript
const list = document.getElementById('itemList');

list.addEventListener('click', (event) => {
  const btn = event.target.closest('.delete-btn');
  if (btn && list.contains(btn)) {
    const li = btn.closest('li');
    li.remove();
  }
});

```

---

### 17. Button that destroys itself on click and creates two new buttons

```html
<div id="buttonContainer">
  <button class="split-btn">Click me to divide</button>
</div>

```

```javascript
const container = document.getElementById('buttonContainer');

container.addEventListener('click', (event) => {
  const target = event.target.closest('.split-btn');
  if (!target) return;

  const btn1 = document.createElement('button');
  btn1.className = 'split-btn';
  btn1.textContent = 'Button A';

  const btn2 = document.createElement('button');
  btn2.className = 'split-btn';
  btn2.textContent = 'Button B';

  const fragment = document.createDocumentFragment();
  fragment.appendChild(btn1);
  fragment.appendChild(btn2);

  // Replace original button with the two new ones:
  target.replaceWith(fragment);
});

```

---

### 18. How to capture all clicks on a page

Attach a listener to `window` or `document` and configure it to run during the **Capture Phase** by setting the third argument `{ capture: true }`:

```javascript
window.addEventListener('click', (event) => {
  console.log('Click intercepted on:', event.target);
}, { capture: true });

```

*Running during the capture phase guarantees interception even if an inner element runs `event.stopPropagation()` during the bubbling phase.*

---

### 19. Get all text content on a web page

* **Visible rendered text (respects CSS and layout):**

```javascript
const visibleText = document.body.innerText;

```

* **Raw text nodes (including hidden text and styles):**

```javascript
const allText = document.body.textContent;

```

* **Iterate across all distinct text nodes using `TreeWalker`:**

```javascript
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  {
    acceptNode(node) {
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  }
);

const texts = [];
while (walker.nextNode()) {
  texts.push(walker.currentNode.textContent.trim());
}

```

---

### 20. What `defer` and `async` do in a script tag

* **Default (`<script src="script.js">`):**
* HTML parsing **stops immediately**.
* The script is fetched over the network and executed synchronously.
* Blocks DOM construction until complete.

* **`<script async src="script.js">`:**
* Fetches the file in the background asynchronously without pausing HTML parsing.
* **Executes immediately upon download**, pausing HTML parsing wherever it happens to be.
* Order is non-deterministic (scripts execute as soon as their download finishes).

* **`<script defer src="script.js">`:**
* Fetches in the background asynchronously during HTML parsing.
* **Defers execution until HTML parsing is completely finished**, right before `DOMContentLoaded`.
* **Guarantees execution order** matching the sequence in which scripts appear in the document.

1. 10 rapid fire questions

#### [JS: Answers for DOM related Questions](http://www.thatjsdude.com/interview/dom.html)

## [html: Basic Questions for Begginers](http://www.thatjsdude.com/interview/html.html)

15 basic questions and asnwers
______

### 1. Why do you need doctype?

A doctype declaration (`<!DOCTYPE html>`) is required to trigger **Standards Mode** in web browsers. Without it (or with an outdated doctype), the browser falls back into **Quirks Mode**, emulating non-standard behavior from the late 1990s (such as buggy CSS box-model sizing, altered table font inheritance, and non-standard inline layout handling). In modern HTML5, `<!DOCTYPE html>` is not a DTD reference, but a simple switch that ensures adherence to current W3C/WHATWG specifications.

---

### 2. What are `data-*` attributes used for?

`data-*` attributes store custom, non-visible metadata directly on standard HTML elements without violating validation rules.

* **JavaScript Integration:** Data is accessed via the element's `dataset` API (e.g., `data-user-id="101"` maps to `element.dataset.userId`).
* **CSS Hooking:** Target elements in CSS selectors (e.g., `[data-status="active"]`) or inject values into pseudo-elements using `content: attr(data-tooltip);`.
* **Caveat:** They are visible in page source and should not contain sensitive information. Assistive technologies do not announce them; use `aria-*` for accessibility state.

---

### 3. How can you generate a public key in HTML?

* **Historical Method:** HTML introduced the native `<keygen>` element inside forms:

```html
<keygen name="pubkey" challenge="random_challenge_string" keytype="rsa">

```

When submitted, it generated a public/private keypair, stored the private key in the browser’s keystore, and sent the signed public key to the server.

* **Modern Standard:** The `<keygen>` tag is **deprecated and removed** from all modern browsers due to security and standardization issues. Public key generation is now handled via JavaScript using the **Web Cryptography API** (`window.crypto.subtle.generateKey` / `exportKey`) or hardware-backed credentials via the **WebAuthn API** (`navigator.credentials.create()`).

---

### 4. How do you change the direction of HTML text?

1. **HTML `dir` Attribute (Structural/Semantic - Preferred):**

* `<html dir="rtl">` sets document-wide direction (e.g., Arabic, Hebrew).
* `<p dir="ltr">` or `<p dir="auto">` (browser infers direction from the first strongly typed directional character).

1. **Bi-Directional Isolation Tag (`<bdi>`):**

* Isolates text that might have an unknown direction (e.g., user-generated names in an RTL layout) so it does not distort surrounding punctuation:

```html
<p>User <bdi>مرحبا</bdi>: 5 posts.</p>

```

1. **Bi-Directional Override Tag (`<bdo>`):**

* Forces a strict visual override of directional algorithms:

```html
<bdo dir="rtl">This text will render right-to-left character by character.</bdo>

```

1. **CSS (Presentational):** `direction: rtl; unicode-bidi: bidi-override;` (HTML attributes should always be preferred over CSS for text direction because direction affects content meaning).

---

### 5. How can you highlight text in HTML?

* **The Semantic `<mark>` Element:**
The native `<mark>` tag represents highlighted or referenced text for relevance in another context (e.g., matching search terms inside results).

```html
<p>Search results for <mark>JavaScript</mark>:</p>

```

*Default styling:* Renders with a yellow background (`background-color: mark; color: marktext;`) that can be styled via CSS.

* **Presentational/Arbitrary Highlight:** Wrap the phrase in `<span class="highlight">` styled with CSS background colors when the highlight does not represent semantic relevance.

---

### 6. Can you apply CSS to a part of an HTML document only?

Yes, through multiple techniques:

* **Shadow DOM / Web Components (Strict Encapsulation):**
Attaching a Shadow Root scopes CSS completely. Styles declared inside do not leak out, and outer stylesheets do not penetrate inside:

```javascript
const shadow = container.attachShadow({ mode: 'open' });
shadow.innerHTML = `<style>p { color: red; }</style><p>Isolated Red Text</p>`;

```

* **CSS `@scope` (Native Modern CSS Scoping):**
Applies styles strictly between a root element and an optional slot/limit boundary:

```css
@scope (.card) to (.card-content) {
  p { color: blue; } /* Styles apply to .card, but stop at .card-content */
}

```

* **CSS Modules / BEM / Scoped Framework Styles:** Build tools rewrite selectors with unique hashes (e.g., `.button[data-v-123abc]`), simulating local scoping.
* **Deprecated Historical Feature:** The HTML5 `<style scoped>` attribute was previously specified to style only an enclosing parent element, but it was dropped from browser implementations.

---

### 7. Will a browser make an HTTP request for the following cases?

* **Case A: `<img src="image.png" style="display: none;">**`
**Yes.** Even if hidden, the HTML parser encounters the `src` attribute and initiates the fetch immediately unless native `loading="lazy"` is used and the element is outside the viewport.
* **Case B: `<div style="display: none;"><img src="image.png"></div>**`
**Yes.** Sibling/descendant tags inside `display: none` elements still fire network requests during DOM construction.
* **Case C: CSS `background-image: url('bg.png');` on an element with `display: none;**`
**No.** Browsers build the render tree before downloading CSS background images. Elements with `display: none` are excluded from the render tree, so the image is not fetched.
* **Case D: `<link rel="prefetch" href="next-page.js">**`
**Yes.** It initiates a low-priority background request during browser idle time to populate the HTTP cache.
* **Case E: Empty `src` attribute (`<img src="">`)**
**Yes (in older browsers) / No (in modern engines).** Historically, an empty `src` caused the browser to reload the current page document itself. Modern HTML specifications forbid this behavior, treating empty strings as non-requests.

---

### 8. Which resource would be downloaded first?

Browsers prioritize resource downloads based on type and viewport relevance using an internal **Resource Fetch Priority** heuristic:

```
Critical CSS in <head>  -->  Synchronous JS in <head>  -->  Visible <img> in Viewport  -->  <script defer>  -->  Off-screen <img> (lazy)

```

1. **Highest Priority:**

* CSS stylesheets in `<head>` (render-blocking).
* Synchronous `<script>` tags in `<head>`.
* Web fonts referenced by critical CSS (`rel="preload"` fonts execute immediately).

1. **Medium Priority:**

* Images located directly inside the initial above-the-fold viewport.
* `<script defer>` / `<script type="module">` scripts.

1. **Lowest Priority:**

* `<script async>` (executed as soon as downloaded, fetched with low/medium priority).
* Below-the-fold images (`loading="lazy"`).
* Prefetched resources (`<link rel="prefetch">`).

* *Manual Override:* You can explicitly influence download priority using the `fetchpriority` attribute (e.g., `<img src="hero.jpg" fetchpriority="high">`).

---

### 9. What is an optional tag in HTML?

In the HTML5 specification, certain start and end tags can be **omitted**; the browser parser inserts them into the DOM tree automatically based on context:

* **Optional End Tags:**
* `</li>` is optional if immediately followed by another `<li>` or the parent `</ul>` closes.
* `</p>` is optional if immediately followed by `<h1>-<h6>`, `<p>`, `<ul>`, `<div>`, etc.
* `</td>`, `</th>`, `</tr>`, `<dt>`, `<dd>`, `<option>`.

* **Optional Start/End Tags:**
* `<html>`, `<head>`, and `<body>` tags can technically be omitted entirely in raw HTML text; the parser creates them automatically.

* *Best Practice:* Modern style guides recommend explicitly writing all tags to prevent ambiguity and tooling errors.

---

### 10. Differences between `<div>` and `<span>`

| Feature              | `<div>`                                                                | `<span>`                                                                                       |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Default Display**  | `block`                                                                | `inline`                                                                                       |
| **Document Role**    | Generic block-level structural container.                              | Generic inline-level phrasing text container.                                                  |
| **Line Breaks**      | Begins on a new line and takes the full width available.               | Flows inline with surrounding text without breaking lines.                                     |
| **Box Model**        | Respects `width`, `height`, vertical `margin`, and vertical `padding`. | Ignores `width` and `height`. Vertical margins/paddings do not alter surrounding line spacing. |
| **Allowed Children** | May contain block-level and inline-level elements.                     | Should contain only inline/phrasing content (not block elements).                              |

---

### 11. Differentiating `<div>`, `<section>`, and `<article>`

* **`<div>` (Zero Semantics):** A purely presentational container. Use it when no semantic tag fits (e.g., a wrapper for CSS Flexbox/Grid layouts, positioning boundaries, or styling hooks).
* **`<section>` (Thematic Grouping):** Represents a generic thematic grouping of related content within a document, typically identified by a heading (`<h2>`-`<h6>`). Use it for book chapters, tabbed views, or major topic sections of a single page.
* **`<article>` (Self-Contained Composition):** Represents an independent, distributable, self-contained piece of content that could be lifted from the page and published on an external site, RSS feed, or aggregator without losing meaning. Examples: a blog post, news article, product card, user comment, or forum post.

---

### 12. Selecting SVG vs. Canvas for your site

* **Choose SVG when:**
* You need **resolution-independent vector graphics** that look crisp on Retina displays (logos, UI icons, illustrations).
* You need **DOM integration, accessibility, and CSS styling** (e.g., hover color transitions on shapes, binding individual `click` handlers to specific regions or paths).
* The graphic has a low-to-medium object count (<1,000 nodes).

* **Choose `<canvas>` (2D / WebGL) when:**
* You are building **high-performance, high-frame-rate graphics** (60/120 FPS games, physics engines, data simulations with $10^4+$ moving particles).
* You require direct **pixel manipulation** (image filters, video processing, heatmaps).
* DOM overhead would cause memory bottlenecks.

---

### 13. How to serve HTML in multiple languages

1. **Root Language Tag:** Declare the language and text direction on the root element:

```html
<html lang="es" dir="ltr">

```

1. **SEO Metadata (`hreflang`):** Inform search engines about all alternate localized versions:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">

```

1. **URL Strategy:** Use clear subdirectories (`[example.com/fr/](https://example.com/fr/)`) or ccTLDs (`example.fr`) rather than URL query parameters or cookie-only switching so each version is uniquely crawlable.
2. **Encoding & Headers:** Always serve `Content-Type: text/html; charset=UTF-8` and configure the HTTP `Content-Language` header.
3. **Dynamic Formatting:** Format numbers, currencies, and dates on the client side using the browser's native `Intl` API.

---

### 14. Standard Mode vs. Quirks Mode

* **Standards Mode (Strict Mode):**
* Triggered by modern doctypes: `<!DOCTYPE html>`.
* The browser follows W3C/WHATWG specifications.
* Uses the **standard W3C Box Model** (`width` = content area only, excluding padding and border, unless overridden by `box-sizing: border-box`).

* **Quirks Mode:**
* Triggered by omitting the doctype or supplying legacy/invalid doctypes.
* The browser emulates legacy Netscape 4 and Internet Explorer 5 behavior.
* **Legacy Box Model:** `width` and `height` erroneously include padding and borders.
* **Font and Alignment Quirks:** Tables do not inherit parent font styles; images inside table cells gain automatic bottom margins; element sizing calculations deviate from specs.

* **Almost Standards Mode:** Triggered by older transitional doctypes; behaves like Standards Mode except for legacy vertical alignment handling of images inside table cells.

---

### 15. What is a semantic tag?

A **semantic tag** is an HTML element that clearly describes its meaning and purpose to both the browser and developer, rather than describing how it visually looks.

* **Examples:** `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`, `<figure>`, `<time>`, `<mark>`.
* **Contrasting Non-Semantic Tags:** `<div>` and `<span>` convey zero information about their contents.
* **Why Semantic Tags Matter:**

1. **Accessibility (a11y):** Screen readers use semantic landmarks (`<main>`, `<nav>`) to build the Accessibility Tree, letting assistive tech users jump directly between page sections.
2. **SEO:** Search engine crawlers parse page hierarchy and prioritize heading scopes and primary content over navigation boilerplates.
3. **Maintainability:** Makes markup readable, structured, and easier for engineering teams to maintain without drowning in "div soup."

#### [HTML: Answers for Basic Questions](http://www.thatjsdude.com/interview/html.html)

## [JavaScript: LinkedList (part 4: work in process)](http://www.thatjsdude.com/interview/linkedList.html)

Very rough stage..need to finish (for intermediate)

## [JavaScript: search and Sort (part 5: work in process)](http://khan4019.github.io/front-end-Interview-Questions/sort.html)

Very rough stage..need to finish (for expert)

## [JavaScript: Binary Search Tree (part 6: work in process)](http://khan4019.github.io/front-end-Interview-Questions/bst.html)

Very rough stage..need to finish (for expert)
__________________

## TODO list

1. CSS: Generate mock up from provided layout
2. JavaScript: Programming challenges for expert
3. HR related questions like
4. What is your weakness
5. Why are you leaving your current job
6. Tell me about a project that you weren't able to finish on time
7. How you resolve conflict among team members
8. How will you introduce a new technology to the team
9. Do you prefer to work individually or in a team
10. Sell this pen/coke/something to me
11. How much salary do you want
12. What you don't like you current job
13. What you like least in your current job
14. Tree Data Structure in JavaScript
15. Graph and high order data structure in JavaScript

___________________

Inpsired by, [darcyclarke](https://github.com/darcyclarke/Front-end-Developer-Interview-Questions), [css-tricks](<http://css-tricks.com/interview-questions-css>
