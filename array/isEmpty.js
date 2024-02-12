function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else if (value instanceof Map) {
      return value.size === 0;
    } else if (value instanceof Set) {
      return value.size === 0;
    } else {
      return Object.keys(value).length === 0;
    }
  }

  return false;
}

// Implement a js function to check if a value is an empty object, collection,
// map, or set

const emptyObject = {};
const emptyArray = [];
const emptyMap = new Map();
const emptySet = new Set();

console.log(isEmpty(emptyObject)); // true
console.log(isEmpty(emptyArray)); // true
console.log(isEmpty(emptyMap)); // true
console.log(isEmpty(emptySet)); // true

const nonEmptyObject = { name: "John Doe" };
const nonEmptyArray = [1, 2, 3];
const nonEmptyMap = new Map([["key", "value"]]);
const nonEmptySet = new Set([1, 2, 3]);

console.log(isEmpty(nonEmptyObject)); // false
console.log(isEmpty(nonEmptyArray)); // false
console.log(isEmpty(nonEmptyMap)); // false
console.log(isEmpty(nonEmptySet)); // false
