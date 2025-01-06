**Functional Programming** is a declarative programming paradigm or pattern on how we build our applications with functions using expressions that calculates a value without mutating or changing the arguments that are passed to it.

JavaScript Array has map, filter, reduce methods which are the most famous functions in the functional programming world because of their usefulness and because they don't mutate or change the array which makes these functions pure and JavaScript supports Closures and Higher Order Functions which are a characteristic of a Functional Programming Language.

The map method creates a new array with the results of calling a provided callback function on every element in the array.
```js
const words = ["Functional", "Procedural", "Object-Oriented"];

const wordsLength = words.map(word => word.length);
```
The filter method creates a new array with all elements that pass the test in the callback function.

```js
const data = [
  { name: 'Mark', isRegistered: true },
  { name: 'Mary', isRegistered: false },
  { name: 'Mae', isRegistered: true }
];

const registeredUsers = data.filter(user => user.isRegistered);

```
The reduce method applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.

```js
const strs = ["I", " ", "am", " ", "Iron", " ", "Man"];
const result = strs.reduce((acc, currentStr) => acc + currentStr, "");
```