function customPartial(func, ...partialArgs) {
    return function(...args) {
        // Create an array of arguments where undefined will be replaced with actual arguments
        const finalArgs = partialArgs.map(arg => (arg === undefined ? args.shift() : arg));
        
        // Call the original function with the combined arguments
        return func(...finalArgs, ...args);
    };
}

// Example usage
function greet(greeting, name) {
    return `${greeting}, ${name}!`;
}

const greetHello = customPartial(greet, 'Hello');

console.log(greetHello('Alice')); // Output: 'Hello, Alice!'
console.log(greetHello('Bob'));   // Output: 'Hello, Bob!'

// Example with multiple arguments
function add(a, b, c) {
    return a + b + c;
}

const addFive = customPartial(add, 5);

console.log(addFive(10, 15)); // Output: 30 (5 + 10 + 15)

// Partial with some undefined values to allow additional arguments to fill in
const addWithDefault = customPartial(add, 5, undefined, 10);

console.log(addWithDefault(15)); // Output: 30 (5 + 15 + 10)
