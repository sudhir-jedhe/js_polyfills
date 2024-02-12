// Implement a function that returns the number of parameters expected by a
// function

function getParameterCount(func) {
  return func.length;
}

function add(a, b) {
  return a + b;
}

console.log(getParameterCount(add)); // 2

function getParameterCount(inputFunction) {
  // write your code below
  if (typeof inputFunction !== "function") throw new TypeError();
  return inputFunction?.length;
}
