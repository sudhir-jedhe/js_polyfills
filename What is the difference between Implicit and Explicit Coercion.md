**Implicit Coercion** is a way of converting values to another type without us programmer doing it directly or by hand.

Suppose we have an example below.
```js
console.log(1 + '6');
console.log(false + true);
console.log(6 * '2');
```
The first console.log statement logs 16. In other languages this would throw a compile time error but in JavaScript the 1 is converted to a string then concatenated with the + operator.

We did not do anything, yet it was converted automatically by JavaScript for us.

The second console.log statement logs 1, it converts the false to a boolean which will result to a 0 and the true will be 1 hence the result is 1.

The third console.log statement logs 12, it converts the '2' to a number before multiplying 6 * 2 hence the result 12.
JavaScript Coercion Rules

While Explicit Coercion is the way of converting values to another type where we (programmers) explicitly do it.
```js
console.log(1 + parseInt('6'));
```
In this example, we use the parseInt function to convert the '6' to a number then adding the 1 and 6 using the + operator.