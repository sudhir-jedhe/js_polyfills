// Implement Tuple Function
// In this question, you need to implement a tuple function that takes a string as input and converts it into a array of arrays. The tuple should support a function multiply that multiples ith item of each nested array.

// Syntax
// const item = tuple(input);

// item.multiply(position);
// Arguments
// input (String): the string that we need to convert
// Returns
// An array

// Example
// const input = `(1, 2, 3) , (4, 5, 6) ,  (7, 8, 9)`;

// // Convert it into
// // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// const item = tuple(input);

// // Multiples 2nd item in each nested array
// // i.e. 2 * 5 * 8 = 80
// console.log(item.multiply(2));
// The method multiply should exist on the return value of the tuple function. You can either directly set it on the return value or on the Array prototype.

// Submission

function multiple(position) {
  if (this.length === 0) return 0;
  return this.reduce((res, tuple) => tuple[position - 1] * res, 1);
}

function tuple(input) {
  const tuples = input
    .substring(1, input.length - 1)
    .split(/\)\s*,\s*\(/)
    .filter(Boolean)
    .map((tuple) => tuple.split(",").map((item) => Number(item.trim())));
  tuples.multiple = multiple;

  return tuples;
}

/************************************************************* */

const DIGITS_ENCLOSED_WITH_BRACKETS_REGEX =
  /\(\s*(\d+\s*(?:,\s*\d+\s*)*)\s*\)/g;

function multiple(position) {
  // write your code below

  if (!position) {
    throw new TypeError("Missing argument");
  }

  if (typeof position !== "number") {
    throw new TypeError("Argument must be of type number");
  }

  if (!Array.isArray(this)) {
    throw new TypeError("Invalid type");
  }

  if (!this.length) {
    return 0;
  }

  return this.reduce((acc, item) => (acc *= item[position - 1]), 1);
}

function tuple(input) {
  // write your code below

  if (typeof input !== "string") {
    throw new TypeError("Argument must be of type string");
  }

  // Find all matches following this pattern => (1, 2, 3)
  const groups = [...input.matchAll(DIGITS_ENCLOSED_WITH_BRACKETS_REGEX)];

  const res = groups.reduce((acc, item) => {
    // Convert the string match to arrays of numbers
    const arr = item[1].split(",").map(Number);
    acc.push(arr);
    return acc;
  }, []);

  res.multiple = multiple;

  return res;
}

/************************************************ */

function multiple(idx) {
  if (!this.length) return 0;
  let sum = 1;
  this.forEach((currArr) => {
    sum = sum * Number(currArr[idx - 1]);
  });
  return sum;
}

Array.prototype.multiple = multiple;

function tuple(str) {
  let arr = [];
  let curr = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(" || str[i] == "," || str[i] == " ") {
      continue;
    } else if (str[i] == ")") {
      arr.push(curr);
      curr = [];
    } else {
      curr.push(parseInt(str[i]));
    }
  }
  return arr;
}

/********************************************** */

function multiple(idx) {
  if (!this.length) return 0;
  let sum = 1;
  this.forEach((currArr) => {
    sum = sum * Number(currArr[idx - 1]);
  });
  return sum;
}

Array.prototype.multiple = multiple;

function tuple(str) {
  let arr = [];
  let curr = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(" || str[i] == "," || str[i] == " ") {
      continue;
    } else if (str[i] == ")") {
      arr.push(curr);
      curr = [];
    } else {
      curr.push(parseInt(str[i]));
    }
  }
  return arr;
}

/*********************************************** */

function multiple(position) {
  if (!this.length) return 0;
  let sum = 1;
  this.forEach((currArr) => {
    sum = sum * Number(currArr[position - 1]);
  });
  return sum;
}

Array.prototype.multiple = multiple;

function tuple(input) {
  let arr = [];
  let curr = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] == "(" || input[i] == "," || input[i] == " ") {
      continue;
    } else if (input[i] == ")") {
      arr.push(curr);
      curr = [];
    } else {
      curr.push(parseInt(input[i]));
    }
  }
  return arr;
}
