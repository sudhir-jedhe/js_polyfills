Array.prototype.customReduce = function (callback, initialValue) {
  let value = initialValue;
  for (let i = 0; i < this.length; i++) {
    let current = this[i];
    value = callback(initialValue, current);
  }
  return value;
};
const sum = arr.customReduce((acc = 0, elem) => {
  return acc + elem;
});

console.log(sum); // 55

// Convert an Array of Digits to an Intege
const digits = [1, 2, 3, 4, 5];
const int = digits.reduce((accum, digit) => accum * 10 + digit, 0);

console.log(int); // 12345

const digits = [1, 2, 3, 4, 5];
const int = Number(digits.join(""));

console.log(int); // 12345

/**
 *
  reduce() exectues a provided *reducer* function on each element of
  the array returning a final single output value.

  reduce() has two parameters:

  - the reducer callback function
  - an initial value. If no initial value is supplied, the value
    of the first element in the array is used, and the initial
    iteration is skipped.
    (which will be the initial value of the accumulator)

  The reducer function takes four arguments:

  - the accumulator
  - the value of the current element
  - the index of the current element
  - the Array object being traversed

  The return value of the reducer will be the new accumulator argument
  in the next iteration, and ultimately the final, single resulting value.

  Calling reduce on an empty array without an initial value will trow a TypeError
*/

Array.prototype.myReduce = function (callback, initialValue) {
  const argsLength = arguments.length;
  //If array is empty and there is no initial value, return an error
  if (argsLength === 1 && this.length === 0) {
    throw new Error();
  }

  let index = argsLength === 1 ? 1 : 0;
  let resultValue = argsLength === 1 ? this[0] : initialValue;

  //Call the callback function for every element and replace the resultValue
  for (let i = index; i < this.length; i += 1) {
    resultValue = callback(resultValue, this[i], i, this);
  }

  return resultValue;
};

/*********************************** */

Array.prototype.myReduce = function myReduce(reducer, initialValue) {
  let accumulator = initialValue;
  let i = 0;

  // initival value check
  if (typeof initialValue === "undefined") {
    if (this.length === 0) {
      // no reduce on empty array without and initial value
      throw new TypeError("reduce on empty array without initial value");
    }

    // no initial value, so accumulator is set to first element,
    // and first iteration is skipped
    [accumulator] = this;
    i = 1;
  }

  for (; i < this.length; i += 1) {
    accumulator = reducer(accumulator, this[i], i, this);
  }

  return accumulator;
};

/*
/*************************User Implement custom Array Reduce ************************ */
("use strict");

function reduce(callback, initialValue) {
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.reduce called on null or undefined");
  }

  if (!callback || typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }

  if (!this.length) {
    if (arguments.length < 2) {
      throw new TypeError("Reduce of empty array with no initial value");
    } else if (arguments.length === 2) {
      return initialValue;
    }
  }

  var k = 0;
  var acc = arguments.length < 2 ? this[k++] : initialValue;

  while (k < this.length) {
    if (Object.prototype.hasOwnProperty.call(this, k)) {
      acc = callback(acc, this[k], k, this);
    }
    k++;
  }

  return acc;
}

module.exports = reduce;

/****************************** */
let vals = [1, 2, 3, 4, 5];

const [initial] = vals;

const min = vals.reduce((total, next) => Math.min(total, next), initial);
const max = vals.reduce((total, next) => Math.max(total, next), initial);

/*********************** */
let vals = [1, 2, 3, 4, 5];

const initials = {
  min: Number.MAX_VALUE,
  max: Number.MIN_VALUE,
};

const min_max_vals = vals.reduce(min_max, initials);
console.log(min_max_vals);

function min_max(total, next) {
  return {
    min: Math.min(total.min, next),
    max: Math.max(total.max, next),
  };
}
/******************************* */

let vals = [
  [0, 1],
  [2, 3],
  [4, 5],
  [5, 6],
];

let flattened = vals.reduce((total, next) => total.concat(next), []);

console.log(flattened);

/************************** */
let vals = [1, 2, 3, 4, 5];

let average = vals.reduce((total, next, idx, array) => {
  total += next;

  if (idx === array.length - 1) {
    return total / array.length;
  } else {
    return total;
  }
});

console.log(average);

/********************************************* */
let vals = [88, 28, 0, 9, 389, 420];

let reversed = vals.reduce((total, next) => {
  return [next, ...total];
}, []);

console.log(reversed);

/************************************************ */

let vals = [1, 1, 2, 2, 3, 4, 5, 5];

let unique_vals = vals.reduce((total, next) => {
  if (total.includes(next)) {
    return total;
  } else {
    return [...total, next];
  }
}, []);

console.log(unique_vals);

/****************************************************** */

function inc(val) {
  return val + 1;
}

function dec(val) {
  return val - 1;
}

function double(val) {
  return val * 2;
}

function halve(val) {
  return val / 2;
}

let pipeline = [inc, halve, dec, double];

let res = pipeline.reduce((total, fn) => {
  return fn(total);
}, 9);

console.log(res);

/******************************************************* */

const double = (x) => x * 2;
const triple = (x) => x * 3;
const quadruple = (x) => x * 4;

const pipe =
  (...funs) =>
  (input) =>
    funs.reduce((total, fn) => fn(total), input);

const fun1 = pipe(double);
const fun2 = pipe(double, triple);
const fun3 = pipe(triple, triple);
const fun4 = pipe(double, triple, quadruple);

console.log(fun1(2));
console.log(fun2(5));
console.log(fun3(7));
console.log(fun4(9));


function add2(x) {
  return x + 2;
}

function multiply3(x) {
  return x * 3;
}

function subtract5(x) {
  return x - 5;
}

const chainedFunction = pipe(add2, multiply3, subtract5);

console.log(chainedFunction(10)); // Output: ((10 + 2) * 3) - 5 = 31


/********************************************* */
const words = [
  "sky",
  "forest",
  "wood",
  "sky",
  "rock",
  "cloud",
  "sky",
  "forest",
  "rock",
  "sky",
];

const tally = words.reduce((total, next) => {
  total[next] = (total[next] || 0) + 1;

  return total;
}, {});

console.log(tally);

/********************************************* */
let users = [
  { name: "John", age: 25, occupation: "gardener" },
  { name: "Lenny", age: 51, occupation: "programmer" },
  { name: "Andrew", age: 43, occupation: "teacher" },
  { name: "Peter", age: 52, occupation: "gardener" },
  { name: "Anna", age: 43, occupation: "teacher" },
  { name: "Albert", age: 46, occupation: "programmer" },
  { name: "Adam", age: 47, occupation: "teacher" },
  { name: "Robert", age: 32, occupation: "driver" },
];

let grouped = users.reduce((result, user) => {
  (result[user.occupation] || (result[user.occupation] = [])).push(user);
  return result;
}, {});

console.log(grouped);

/****************************************array to object *************/
let users = [
  { id: 1, name: "John", age: 25, occupation: "gardener" },
  { id: 2, name: "Lenny", age: 51, occupation: "programmer" },
  { id: 3, name: "Andrew", age: 43, occupation: "teacher" },
  { id: 4, name: "Peter", age: 52, occupation: "gardener" },
  { id: 5, name: "Anna", age: 43, occupation: "teacher" },
  { id: 6, name: "Albert", age: 46, occupation: "programmer" },
  { id: 7, name: "Adam", age: 47, occupation: "teacher" },
  { id: 8, ame: "Robert", age: 32, occupation: "driver" },
];

let obj = users.reduce((total, e) => {
  const { id, ...attrs } = e;

  return { ...total, [id]: attrs };
}, {});

console.log(obj);

/********************************************************* */
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

function removeDuplicates(arr) {
  let unique = arr.reduce(function (acc, curr) {
    if (!acc.includes(curr)) acc.push(curr);
    return acc;
  }, []);
  return unique;
}
console.log(removeDuplicates(arr));

/************************************* */
const nums = [2, 3, 4, 5, 6, 7];

const res = nums.reduce((product, next) => product * next);

console.log(res);

/********************************* */
// Input array
let arr = [10, 20, 30, 40, 50, 60];
// Callback function for reduce method
function sumofArray(sum, num) {
  return sum + num;
}
//Fucntion to execute reduce method
function myGeeks(item) {
  // Display output
  console.log(arr.reduce(sumofArray));
}
myGeeks();

/**************************** */
// Input array
let arr = [1.5, 20.3, 11.1, 40.7];

// Callback function for reduce method
function sumofArray(sum, num) {
  return sum + Math.round(num);
}

//Fucntion to execute reduce method
function myGeeks(item) {
  // Display output
  console.log(arr.reduce(sumofArray, 0));
}
myGeeks();

/******************************************** */
// This is a JavaScript Quiz from BFE.dev

[1, 2, 3].reduce((a, b) => {
  console.log(a, b);
});

[1, 2, 3].reduce((a, b) => {
  console.log(a, b);
}, 0);

