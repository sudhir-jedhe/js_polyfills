/*********************Memoize Function **************** */
function memoize(func) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (!cache[key]) {
      cache[key] = func.apply(this, args);
    }

    return cache[key];
  };
}

// Example usage:

// A simple function to calculate the square of a number
const square = (x) => {
  console.log("Calculating square:", x);
  return x * x;
};

// Memoize the square function
const memoizedSquare = memoize(square);

console.log(memoizedSquare(5)); // Output: Calculating square: 5 | 25
console.log(memoizedSquare(5)); // Output: 25 (result is retrieved from cache)
console.log(memoizedSquare(3)); // Output: Calculating square: 3 | 9
console.log(memoizedSquare(3)); // Output: 9 (result is retrieved from cache)

/***************************************************************** */
function memoize(fn) {
  const cache = new Map();
  return function () {
    const key = JSON.stringify(arguments);

    // if the caculations have already been done for inputs, return the value
    // from cache
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      // call the function with arguments and store the result in cache before
      // returning
      cache.set(key, fn(...arguments));
      return cache.get(key);
    }
  };
}

// driver code
let factorial = memoize(function fact(value) {
  return value > 1 ? value * fact(value - 1) : 1;
});

factorial(5); // 120 (output is calculated by calling the function)
factorial(5); // 120 (output is returned from the cache which was stored from previous calculations)

/********************************** */
//Implement a js function that returns a memoized version of a function which
//accepts a single argument
function memoize(func) {
  const cache = {};

  return function (arg) {
    if (cache[arg] === undefined) {
      cache[arg] = func(arg);
    }

    return cache[arg];
  };
}

const add = (a, b) => a + b;

const memoizedAdd = memoize(add);

console.log(memoizedAdd(1, 2)); // 3
console.log(memoizedAdd(1, 2)); // 3 (from cache)

/**************************** */
// JavaScript function that returns a memoized version of a function which
// accepts any number of arguments:
function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const memoizedAdd = memoize(add);
const result1 = memoizedAdd(1, 2);
const result2 = memoizedAdd(1, 2);

/****************************** */
/**
 * @param {Function} func
 * @param {(args:[]) => string }  [resolver] - cache key generator
 */
function memo(func, resolver) {
  const cache = {};

  return function (...args) {
    const key = resolver ? resolver(...args) : args.join("_");
    if (!cache[key]) {
      cache[key] = func.apply(this, args);
    }
    return cache[key];
  };
}



/********************************* */

function memoize(func) {
  const cache = new Map();
  return function(arg) {
      if (cache.has(arg)) {
          return cache.get(arg);
      } else {
          const result = func(arg);
          cache.set(arg, result);
          return result;
      }
  };
}
