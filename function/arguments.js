// This is a JavaScript Quiz from BFE.dev

function log(a, b, c, d) {
  console.log(a, b, c, d);
  arguments[0] = "bfe";
  arguments[3] = "dev";

  console.log(a, b, c, d);
}

log(1, 2, 3);

// 1 2 3 undefined
// bfe 2 3 undefined

function countArgs() {
  return arguments.length;
}

console.log(countArgs(1, 2, 3, 4)); // 4
console.log(countArgs()); // 0

function getNumArgs() {
  // The arguments object is a built-in object available within all non-arrow functions.
  // It contains an array-like collection of arguments passed to the function.
  // We use its length property to get the number of arguments.
  return arguments.length;
}

console.log(getNumArgs(1, 2, 3)); // Output: 3
console.log(getNumArgs()); // Output: 0

function getNumArgs(...args) {
  // The rest parameter (...) allows us to capture an indefinite number of arguments
  // as an array named 'args' in this case.
  // We can then use the length property of the 'args' array to get the number of arguments.
  return args.length;
}

console.log(getNumArgs(1, 2, 3)); // Output: 3
console.log(getNumArgs()); // Output: 0
