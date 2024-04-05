// You can use the JavaScript typeof operator to find the type of a JavaScript variable. It returns the type of a variable or an expression.

typeof "John Abraham"; // Returns "string"
typeof (1 + 2); // Returns "number"
typeof [1, 2, 3]; // Returns "object" because all arrays are also objects

const a = "BFE.dev";

if (!typeof a === "string") {
  console.log("string");
} else {
  console.log("not a string");
}
/************************************************ */

implement the following utility functions to determine the types of primitive values.

// isBoolean(value): Return true if value is a boolean, false otherwise.
// isNumber(value): Return true if value is a number, false otherwise. Note that NaN is considered a number.
// isNull(value): Return true if value is null, false otherwise.
// isString(value): Return true if value is a String, else false.
// isSymbol(value): Return true if value is a Symbol primitive, else false.
// isUndefined(value): Return true if value is undefined, else false.




function type(value) {
  if (value === null) {
    return "null";
  } else if (typeof value === "undefined") {
    return "undefined";
  } else if (Array.isArray(value)) {
    return "array";
  } else if (value instanceof Date) {
    return "date";
  } else if (value instanceof RegExp) {
    return "regexp";
  } else if (typeof value === "function") {
    return "function";
  } else if (typeof value === "object") {
    return "object";
  } else {
    return typeof value;
  }
}

const a = 1;
console.log(type(a)); // "number"

const b = "hello";
console.log(type(b)); // "string"

const c = true;
console.log(type(c)); // "boolean"

const d = [1, 2, 3];
console.log(type(d)); // "array"

const e = new Date();
console.log(type(e)); // "date"

const f = function() {};
console.log(type(f)); // "function"

const g = {};
console.log(type(g)); // "object"

const h = null;
console.log(type(h)); // "null"

const i = undefined;
console.log(type(i)); // "undefined"









export function isBoolean(value) {
  return typeof value === 'boolean'

export function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

export function isNull(value) {
  throw "Not implemented!";
}

export function isString(value) {
  throw "Not implemented!";
}

export function isSymbol(value) {
  throw "Not implemented!";
}




export function isUndefined(value) {
  throw "Not implemented!";
}



// implement the following utility functions to determine the types of non-primitive values.

// isArray(value): Return true if value is an array, false otherwise.
// isFunction(value): Return true if value is a function, false otherwise.
// isObject(value): Return true if value is an object (e.g. arrays, functions, objects, etc, but not including null and undefined), false otherwise.
// isPlainObject(value): Return true if value is a plain object, false otherwise (for arrays, functions, etc).
// A plain object, or what is commonly known as a Plain Old JavaScript Object (POJO) is any object whose prototype is Object.prototype or an object created via Object.create(null).

export function isArray(value) {
  throw 'Not implemented!';
}

export function isFunction(value) {
  throw 'Not implemented!';
}

export function isObject(value) {
  throw 'Not implemented!';
}

export function isPlainObject(value) {
  throw 'Not implemented!';
}

/********************** */

function typeOf(obj) {
  return Object.prototype.toString().call(obj).match(/\s([a-zA-Z])+)/)[1].lowercase()
}

typeOf('dsfsdf')