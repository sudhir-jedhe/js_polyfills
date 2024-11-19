function sum(a, b, c, d) {
  return a + b + c + d;
}

let curriedSum = curry(sum);

console.log(curriedSum(1, 2, 3, 4, 5)); // 10
console.log(curriedSum(1)(2, 3)(4, 5)); // 10
console.log(curriedSum(1)(2)(3)(4)); // 10

// This is the fourth question in the series of currying where we use Closure to solve problems in JavaScript.

// Currying – part 3
// Currying in JavaScript
// Javascript function that returns sum of the previous values
// Currying in JavaScript is a concept of functional programming in which we can pass functions as arguments (callbacks) and return functions without any side effects (Changes to program states).

// If you see the problem statement, we have a callback function sum(a, b, c, d) that accepts four arguments and return total of those. This callback function is passed to curry that returns a new function.

// When the number of arguments in this returned function becomes equal to the number of arguments that callback function is expected, the curriedSum() returns the total, else it keeps returning another function that keeps accepting arguments and so on.

// To implement this, we will create a helper function in the curry() and return it.

// Inside the helper function we will check if the number of arguments it has received is greater than or equal to the arguments that callback function is expecting. For this we will use the length property that is available to the functions in JavaScript function.length that returns the size of arguments it is accepting.

// If the condition fulfils, then pass the arguments to the callback function and return the output.

// Else, return a new function that will accept the argument and recursively pass the combined arguments to the curry function again.

let curry = (fn) => {
  // helper function
  let helper = (...args) => {
    // if we are receiving the expected number of arguments
    if (args.length >= fn.length) {
      // pass it to callback fn
      return fn(...args);
    } else {
      // return a new function that will accept the remaining arguments
      let temp = (...args2) => {
        // recursively call the same function
        // to validate if we have received the required amount
        // of arguments
        return helper(...args, ...args2);
      };

      // return the function
      return temp;
    }
  };

  // return helper
  return helper;
};

Input: function sum(a, b, c, d) {
  return a + b + c + d;
}

let curriedSum = curry(sum);
console.log(curriedSum(1, 2, 3, 4, 5));
console.log(curriedSum(1)(2, 3)(4));
console.log(curriedSum(1)(2)(3)(4));

Output: 10;
10;
10;
