function curry(fn) {
    return function curried(...args) {
        // Check if there are placeholders ('_')
        const isPlaceholder = (value) => value === '_';
        
        // Replace placeholders with actual arguments
        const replacePlaceholders = (args, suppliedArgs) => {
            return args.map(arg => isPlaceholder(arg) && suppliedArgs.length ? suppliedArgs.shift() : arg);
        };
        
        // Recursively curry until all arguments are provided
        return (...newArgs) => {
            const allArgs = replacePlaceholders(args, newArgs);
            if (allArgs.every(arg => !isPlaceholder(arg))) {
                return fn(...allArgs);
            } else {
                return curried(...allArgs);
            }
        };
    };
}

function sum(a, b, c) {
    return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum('_', 2, 3)(1)); // Output: 6 (1 + 2 + 3)
console.log(curriedSum(1, '_', 3)(2)); // Output: 6 (1 + 2 + 3)
console.log(curriedSum(1)(2, 3)); // Output: 6 (1 + 2 + 3)
console.log(curriedSum(1, 2, 3)); // Output: 6 (1 + 2 + 3)



/******************************* */
// Implementing currying with placeholder support
const curry = (fn) => {
    return function curried(...args) {
        // If enough arguments are provided, 
        // call the original function
        if (args.length >= fn.length &&
            !args.includes(curry.placeholder)) {
            return fn.apply(this, args);
        } else {
            // Otherwise, return a curried function 
            // with placeholder support
            return function (...nextArgs) {
                const combinedArgs = args.map(
                    arg => arg === curry.placeholder && 
                    nextArgs.length ? nextArgs.shift() : arg).
                    concat(nextArgs);
                return curried(...combinedArgs);
            };
        }
    };
};

// Placeholder symbol for 
// missing arguments
curry.placeholder = Symbol();

// Example: Curried function to 
// concatenate three strings
const concat3 = curry((a, b, c) => 
    `${a} ${b} ${c}`);

// Partial application using placeholders
const concatHello = concat3('Hello,', 
    curry.placeholder, 'World!');
console.log(concatHello('Welcome'));
console.log(concatHello('Greetings'));
