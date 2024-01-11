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

    // if the caculations have already been done for inputs, return the value from cache
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      // call the function with arguments and store the result in cache before returning
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
