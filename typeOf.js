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









export function isBoolean(value) {
  throw "Not implemented!";
}

export function isNumber(value) {
  throw "Not implemented!";
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