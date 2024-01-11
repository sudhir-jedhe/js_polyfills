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

/************************************************************** */
const isObject = (data) => typeof data === "object";
const isArray = (data) =>
  Object.prototype.toString.call(data) === "[object Array]";

const deepClone = (data) => {
  let clone; // can be a premitive, an array or an object

  if (!isObject(data) || data === null) {
    clone = data;
    return clone;
  }

  // when data is an array
  if (isArray(data)) {
    clone = [];
    for (let i = 0; i < data.length; i += 1) {
      clone[i] = deepClone(data[i]);
    }
  }

  // when data is an object
  clone = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (!isObject(data[key])) {
        clone[key] = data[key];
      } else {
        // when the key is itself an object (nested object)
        clone[key] = deepClone(data[key]);
      }
    }
  }
  return clone;
};

if (module) module.exports = deepClone;

/****************************************************** */
function deepClone(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  } else if (typeof obj === "object" && obj !== null) {
    const clone = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
    return clone;
  } else {
    return obj;
  }
}


/*********************************************************** */

const clone(input) {
  if (input === null || typeof input != 'object') {
    return input;
  }

  let initialValue = Array.isArray(input) ? [] : {}
  return Object.keys(input).reduce((acc, key) => {
    acc[key] = clone(input[key])
    return acc
  }), initialValue

}