/**
 * @template T
 * @param {T} value
 * @return {T}
 */
export default function deepClone(value) {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, deepClone(value)])
  );
}

// There are generally two ways we can traverse an object:

// Loop through the keys with the good old for ... in statement.
// Converting the object into an array of keys with Object.keys(), or an array of a key-value tuple with Object.entries().
// With the for ... in statement, inherited enumerable properties are processed as well. On the other hand, Object.keys() and Object.entries() only care about the properties directly defined on the object, and this is usually what we want.

/********************************* */
/****************************How to implement cloneDeep********************* */
function cloneDeep(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    // If obj is an array, create a deep copy of each element
    return obj.map((element) => cloneDeep(element));
  }

  // If obj is an object, create a deep copy of each property
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = cloneDeep(obj[key]);
    }
  }

  return clonedObj;
}

// Example usage:
const originalData = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    country: "USA",
  },
  hobbies: ["Reading", "Gaming"],
};

const clonedData = cloneDeep(originalData);

console.log(clonedData);
// Output: { name: 'John', age: 30, address: { city: 'New York', country: 'USA' }, hobbies: ['Reading', 'Gaming'] }

// Verify that the original and cloned objects are not the same reference
console.log(originalData !== clonedData); // Output: true
console.log(originalData.address !== clonedData.address); // Output: true

/****************************************************** */

/************************************************* */
function copyObject(source) {
  var target = {};

  // Getting source object keys
  const keys = Object.keys(source);
  keys.forEach((key) => {
    // Checking if current value is an object
    if (typeof source[key] === "object") {
      // Calling our function recursively for current value
      target[key] = copyObject(source[key]);
    } else {
      // Directly assigning the value
      target[key] = source[key];
    }
  });

  return target;
}
