---
title: "What's the difference between a JavaScript variable that is: `null`, `undefined` or undeclared?"
subtitle: How would you go about checking for any of these states?"
---

## TL;DR

| Trait | `null` | `undefined` | Undeclared |
| --- | --- | --- | --- |
| Meaning | Explicitly set by the developer to indicate that a variable has no value | Variable has been declared but not assigned a value | Variable has not been declared at all |
| Type | `object` | `undefined` | Throws a `ReferenceError` |
| Equality Comparison | `null == undefined` is `true` | `undefined == null` is `true` | Throws a `ReferenceError` |

---

## Undeclared

**Undeclared** variables are created when you assign a value to an identifier that is not previously created using `var`, `let` or `const`. Undeclared variables will be defined globally, outside of the current scope. In strict mode, a `ReferenceError` will be thrown when you try to assign to an undeclared variable. Undeclared variables are bad just like how global variables are bad. Avoid them at all cost! To check for them, wrap its usage in a `try`/`catch` block.

```js
function foo() {
  x = 1; // Throws a ReferenceError in strict mode
}

foo();
console.log(x); // 1
```

## `undefined`

A variable that is `undefined` is a variable that has been declared, but not assigned a value. It is of type `undefined`. If a function does not return any value as the result of executing it is assigned to a variable, the variable also has the value of `undefined`. To check for it, compare using the strict equality (`===`) operator or `typeof` which will give the `'undefined'` string. Note that you should not be using the loose equality operator (`==`) to check, as it will also return `true` if the value is `null`.

```js
let foo;
console.log(foo); // undefined
console.log(foo === undefined); // true
console.log(typeof foo === 'undefined'); // true

console.log(foo == null); // true. Wrong, don't use this to check if a value is undefined!

function bar() {} // Returns undefined if there is nothing returned.
let baz = bar();
console.log(baz); // undefined
```

## `null`

A variable that is `null` will have been explicitly assigned to the `null` value. It represents no value and is different from `undefined` in the sense that it has been explicitly assigned. To check for `null,` simply compare using the strict equality operator. Note that like the above, you should not be using the loose equality operator (`==`) to check, as it will also return `true` if the value is `undefined`.

```js
const foo = null;
console.log(foo === null); // true
console.log(typeof foo === 'object'); // true

console.log(foo == undefined); // true. Wrong, don't use this to check if a value is null!
```

## Notes

- As a good habit, never leave your variables undeclared or unassigned. Explicitly assign `null` to them after declaring if you don't intend to use them yet.
- Always explicitly declare variables before using them to prevent errors.
- Using some static analysis tooling in your workflow (e.g. [ESLint](https://eslint.org/), TypeScript Compiler), will enable checks that you are not referencing undeclared variables.

## Practice

Practice implementing [type utilities that check for `null` and `undefined`](https://www.greatfrontend.com/questions/javascript/type-utilities?fpr=yangshun) on GreatFrontEnd.

## Further Reading

- [MDN Web Docs: null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)
- [MDN Web Docs: undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [MDN Web Docs: ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)