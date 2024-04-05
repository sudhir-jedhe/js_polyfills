
function deepCopy(value) {
  const seen = new WeakMap(); // To track already copied objects

  function _copy(value) {
    if (typeof value !== 'object' || value === null) {
      return value; // Primitive types - return directly
    }

    if (seen.has(value)) {
      return seen.get(value);  // Circular reference detected
    }

    const copy = Array.isArray(value) ? [] : {};
    seen.set(value, copy); // Mark the original as seen

    for (const key in value) {
      if (value.hasOwnProperty(key)) { 
        copy[key] = _copy(value[key]); // Recursively copy nested properties 
      }
    }

    return copy;
  }

  return _copy(value);
}


const circularObject = {
  a: 1,
  b: {},
};
circularObject.b.c = circularObject; // Create a circular reference

const deepCopiedObject = deepCopy(circularObject); 

console.log(deepCopiedObject); 
console.log(deepCopiedObject === circularObject);  // false 
console.log(deepCopiedObject.b.c === deepCopiedObject);  // tru


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



/**
 * @template T
 * @param {T} value
 * @return {T}
 */
export default function deepClone(value) {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, deepClone(value)]),
  );
}


export default function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

