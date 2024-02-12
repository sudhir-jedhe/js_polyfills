function compose(...fns) {
  return (x) => fns.reduceRight((y, f) => f(y), x);
}

// Implement a js function that takes multiple functions as arguments and
// returns a new function that applies those functions in reverse

// This function takes any number of functions as arguments using the spread
// operator ...fns. It returns a new function that iterates over the functions
// in reverse order using reduceRight, applying each function to the accumulated
// result. For example, the following code shows how to use the compose function
// to create a new function that adds 1, then multiplies by 2, and then
// subtracts 3:

const add1 = (x) => x + 1;
const multiplyBy2 = (x) => x * 2;
const subtract3 = (x) => x - 3;

const composedFunction = compose(subtract3, multiplyBy2, add1);

console.log(composedFunction(5)); // 9
