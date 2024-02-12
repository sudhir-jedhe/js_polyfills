// JavaScript is a dynamically typed language, which means the types of variable types can be changed during runtime. Many interview questions involve recursion of objects that can hold values of different types and how to handle each value type differs according to the type (e.g. different code is needed to iterate over an array vs an object). Knowledge of handling the JavaScript types is crucial to solving questions like Deep Clone and Deep Equal.

// In Type Utilities, we have implemented utility functions to determine the types of primitive values. In this question, we will implement the following utility functions to determine the types of non-primitive values.

// isArray(value): Return true if value is an array, false otherwise.
// isFunction(value): Return true if value is a function, false otherwise.
// isObject(value): Return true if value is an object (e.g. arrays, functions, objects, etc, but not including null and undefined), false otherwise.
// isPlainObject(value): Return true if value is a plain object, false otherwise (for arrays, functions, etc).
// A plain object, or what is commonly known as a Plain Old JavaScript Object (POJO) is any object whose prototype is Object.prototype or an object created via Object.create(null).

// Solution
// isArray
// Since ES5, there exists an Array.isArray() function which does exactly what we need here.

// However, if we're not allowed to use this or need to support old browsers, we can check the constructor of the object. However, some values like null and undefined have to be specially handled.

// isFunction
// We can simply use typeof value === 'function' to check.

// isObject
// null and undefined are considered Objects, so we need to handle them specially as well. Functions are also objects.

// isPlainObject
// There are two types of plain objects:

// Objects without prototypes, created using Object.create(null)s.
// Object defined using literals (e.g. let a = {}).
// To check for the first case, Object.getPrototypeOf(value) will be exactly null. To check for the second case, we can use the constructor of its prototype, similar to how we check if an object is an Array.

// Lodash's implementation of isPlainObject traverses the object's prototype chain but that's unnecessary if we check the constructor.

// JavaScript

TypeScript;
