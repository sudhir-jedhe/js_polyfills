/***************************custom Bind***************** */
Function.prototype.myBind = function (context, ...args1) {
  const originalFunction = this;

  return function (...args2) {
    return originalFunction.apply(context, [...args1, ...args2]);
  };
};

// Example usage:

// Original function
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "John" };

// Using your own bind method
const boundGreet = greet.myBind(person, "Hello");
boundGreet("!"); // Output: Hello, John!

// Using the built-in bind method for comparison
const builtInBoundGreet = greet.bind(person, "Hi");
builtInBoundGreet("!"); // Output: Hi, John!

/*************************************************** */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (context) {
    var fn = this;
    var fnArgs = Array.prototype.slice.call(arguments, 1);

    return function () {
      var allArgs = fnArgs.concat(Array.prototype.slice.call(arguments));
      fn.apply(context, allArgs);
    };
  };
}
