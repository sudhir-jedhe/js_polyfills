function customOnce(func) {
    let hasBeenCalled = false;
    let result;

    return function(...args) {
        if (!hasBeenCalled) {
            hasBeenCalled = true;
            result = func.apply(this, args);
        }
        return result;
    };
}

// Usage
const myFunction = customOnce(function(x) {
    console.log('Function called with:', x);
    return x * 2;
});

console.log(myFunction(5)); // Logs: Function called with: 5
console.log(myFunction(10)); // Does not log anything
console.log(myFunction(15)); // Does not log anything
