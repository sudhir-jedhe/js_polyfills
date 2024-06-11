const sum = (x) => {
    // Return a function that takes the next parameter or returns the sum if no parameter is provided
    return (y) => {
        // If y is provided, return a function that takes the next parameter or returns the sum
        if (typeof y !== 'undefined') {
            return sum(x + y);
        } else {
            // If y is not provided, return the sum
            return x;
        }
    };
};

// Test cases
console.log(sum(1)(2)(5)()); // Output: 8
console.log(sum(10)(20)()); // Output: 30
console.log(sum(3)(4)(5)(6)()); // Output: 18



/*********************************** */

const curry = (fn, ...args) => {
    // If all arguments are received, return the result of the function call
    if (args.length >= fn.length) {
        return fn(...args);
    }
    // If not all arguments are received, return a new function that takes the next argument
    return (...nextArgs) => curry(fn, ...args, ...nextArgs);
};

// Test case with a sum function
const sum = (...nums) => nums.reduce((acc, num) => acc + num, 0);

// Curried version of the sum function
const curriedSum = curry(sum);

// Test cases
console.log(curriedSum(1)(2)(5)()); // Output: 8
console.log(curriedSum(10)(20)()); // Output: 30
console.log(curriedSum(3)(4)(5)(6)()); // Output: 18
