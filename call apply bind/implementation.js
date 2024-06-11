// myCall implementation
Function.prototype.myCall = function(thisContext, ...args) {
    const fn = this;
    const key = Symbol(); // Creating a unique key to avoid property name collision
    thisContext[key] = fn;
    const result = thisContext[key](...args);
    delete thisContext[key]; // Clean up to avoid memory leaks
    return result;
};

// myApply implementation
Function.prototype.myApply = function(thisContext, args) {
    const fn = this;
    const key = Symbol(); // Creating a unique key to avoid property name collision
    thisContext[key] = fn;
    const result = thisContext[key](...args);
    delete thisContext[key]; // Clean up to avoid memory leaks
    return result;
};

// myBind implementation
Function.prototype.myBind = function(thisContext, ...args) {
    const fn = this;
    return function(...innerArgs) {
        return fn.myApply(thisContext, args.concat(innerArgs));
    };
};
