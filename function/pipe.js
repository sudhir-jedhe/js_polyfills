// Pipe utility function

const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((result, func) => func(result), input);
// Example functions
const addTwo = (x) => x + 2;
const square = (x) => x * x;
const double = (x) => x * 2;

// Example usage
const result = pipe(addTwo, square, double)(3);
console.log(result); // Output: ((3 + 2)^2) * 2 = 100
const getName = (object) => object.name;
const makeUpperCase = (string) => string.toUpperCase();
const slice = (string) => string.slice(0, 3);
const method = pipe(getName, makeUpperCase, slice);
const value = method({ name: "devtools" });
console.log(value);

/*********************************************** */

function isObject(object) {
  return object && typeof object === "object";
}

function keys(object) {
  return isObject(object) ? Object.keys(object) : [];
}

function each(collection, iteratee) {
  const collectionKeys = keys(collection);
  for (const key of collectionKeys) {
    iteratee(collection[key]);
  }
}

function reduce(collection, iteratee, accumulator) {
  let iterable = collection;
  let result = accumulator;

  if (arguments.length == 2) {
    result = collection[0];
    iterable = rest(collection);
  }

  each(iterable, (value) => {
    result = iteratee(result, value);
  });
  return result;
}

module.exports = reduce;

function pipe(...fns) {
  return (collection) =>
    reduce(fns, (prevResult, fn) => fn(prevResult), collection);
}

/******************************************************************************** */
function pipe(funcs) {
  return function (arg) {
    return funcs.reduce((result, func) => {
      return func(result);
    }, arg);
  };
}

const times = (y) => (x) => x * y;
const plus = (y) => (x) => x + y;
const subtract = (y) => (x) => x - y;
const divide = (y) => (x) => x / y;

pipe([times(2), subtract(3), divide(4)]);
