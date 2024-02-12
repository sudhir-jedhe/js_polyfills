

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