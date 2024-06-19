// What's the difference between undeclared, undefined and null in JavaScript?

undeclared
// A variable is undeclared if it has not been declared with an appropriate keyword (i.e. var, let or const). Accessing an undeclared variable will throw a ReferenceError.

console.log(x); // ReferenceError: x is not defined
undefined
// A variable is undefined if it hasn't been assigned a value. undefined is a primitive data type in JavaScript and represents the absence of a value, intentional or otherwise.

let x;
console.log(x); // undefined
null
// A variable is assigned a value of null like any other value. null is also primitive data type in JavaScript and always represents the intentional absence of a value.

let x = null;
console.log(x); // null
// Checking for empty states
// Undeclared variables will throw an error, which makes them easy to spot and are not very common anyways. undefined and null can be easily spotted with a conditional as they are both falsy values. Due to that, null and undefined are loosely equal (==), but not strictly equal (===).