// implement _.partial()

// _.partial() works like Function.prototype.bind() but this is not bound.

const func = (...args) => args;

const func123 = partial(func, 1, 2, 3);

func123(4);
// [1,2,3,4]

function partial(func, ...args) {
  return function (...restArgs) {
    const copyArgs = args.map((arg) =>
      arg === partial.placeholder ? restArgs.shift() : arg
    );
    return func.call(this, ...copyArgs, ...restArgs);
  };
}
partial.placeholder = Symbol();

/**
 * @param {Function} func
 * @param {any[]} args
 * @returns {Function}
 */
function partial(func, ...args) {
  return function () {
    let mergedArguments = [];
    let i = 0;
    args.forEach((el) => {
      mergedArguments.push(el === partial.placeholder ? arguments[i++] : el);
    });
    mergedArguments = [
      ...mergedArguments,
      ...Array.from(arguments).slice(i, arguments.length),
    ];
    return func.apply(this, mergedArguments);
  };
}

partial.placeholder = Symbol();



/***************************** */

// Create a partial function that allows you to specify placeholders
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    let args = [];
    let i = 0;
    
    // Iterate over the preset arguments and later arguments
    for (let j = 0; j < presetArgs.length; j++) {
      if (presetArgs[j] === undefined) {
        // If the preset argument is undefined, use the later argument
        args.push(laterArgs[i] !== undefined ? laterArgs[i++] : undefined);
      } else {
        // Otherwise, use the preset argument
        args.push(presetArgs[j]);
      }
    }
    
    // If there are more arguments in laterArgs, append them
    return fn(...args, ...laterArgs.slice(i));
  };
}

// Example function that takes three arguments
function sum(a, b, c) {
  return a + b + c;
}

// Partial function, fixing the first argument and leaving the rest for later
const add5 = partial(sum, 5, undefined, undefined);

// Calling the partial function with the remaining arguments
console.log(add5(10, 15)); // Output: 30 (5 + 10 + 15)


/************************************** */

const _ = {}; // Placeholder symbol

// Create a partial function that uses a placeholder
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    let args = [];
    let laterIndex = 0;
    
    // Loop through preset arguments and later arguments
    for (let i = 0; i < presetArgs.length; i++) {
      if (presetArgs[i] === _) {
        // If the argument is a placeholder, replace it with the later argument
        args.push(laterArgs[laterIndex++]);
      } else {
        // Otherwise, use the preset argument
        args.push(presetArgs[i]);
      }
    }

    // Return the function with all arguments combined
    return fn(...args, ...laterArgs.slice(laterIndex));
  };
}

// Example function that takes three arguments
function multiply(a, b, c) {
  return a * b * c;
}

// Partial function, fixing the first and second arguments with placeholders
const multiplyBy10 = partial(multiply, 10, _, _);

// Calling the partial function with the remaining arguments
console.log(multiplyBy10(5, 2)); // Output: 100 (10 * 5 * 2)


const add = partial(sum, _, 10, _);  // 2nd argument fixed to 10
console.log(add(5, 15)); // Output: 30 (5 + 10 + 15)
