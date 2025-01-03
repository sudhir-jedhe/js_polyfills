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

/************************** */
// accept functions as arguments
// using rest ... operator convert then to array


// Create a function that accepts multiple functions as an argument and a value and run this value through each function and return the final output.
const pipe = function (...fns) {
  // form a closure with inner function
  return function (val) {
    // run the value through all the functions
    for (let f of fns) {
      val = f(val);
    }

    // return the value after last processing
    return val;
  };
};


Input:
const getSalary = (person) => person.salary
const addBonus = (netSalary) => netSalary + 1000;
const deductTax = (grossSalary) => grossSalary - (grossSalary * .3);

const val = { salary: 10000 };

const result = pipe(
  getSalary,
  addBonus,
  deductTax 
)({ salary: 10000 });

console.log(result);

Output:
7700


/************************** */

const pipe = (obj) => {
  // return another function that will accept all the args
  return function(...args){
    // iterate the keys of the object
    for (let key in obj) {
        // get the value
        let val = obj[key];
      
        // if the value is a function
        if (typeof val === 'function') {
            // pass the args to the function
            // store the result on the same key
            obj[key] = val(...args);
        }
        else {
            // else recursively call the same function
            // if it is nested object it will be further processed
            obj[key] = pipe(val)(...args);
        }
    }
    
    // return the input after processing
    return obj;
  }
};



Input:
let test = {
    a: {
        b: (a, b, c) => a + b + c,
        c: (a, b, c) => a + b - c,
    },
    d: (a, b, c) => a - b - c,
    e: 1,
    f: true
};

console.log(pipe(test)(1, 1, 1));

Output:
{
  "a": {
    "b": 3,
    "c": 1
  },
  "d": -1,
  "e": 1,
  "f": true
}