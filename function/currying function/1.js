function sum(a, b, c, d) {
  return a + b + c + d;
}

let curriedSum = curry(sum);

console.log(curriedSum(1, 2, 3, 4, 5)); // 10
console.log(curriedSum(1)(2, 3)(4, 5)); // 10
console.log(curriedSum(1)(2)(3)(4)); // 10

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
