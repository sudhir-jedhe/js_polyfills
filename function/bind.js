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
  
  const person = { name: 'John' };
  
  // Using your own bind method
  const boundGreet = greet.myBind(person, 'Hello');
  boundGreet('!'); // Output: Hello, John!
  
  // Using the built-in bind method for comparison
  const builtInBoundGreet = greet.bind(person, 'Hi');
  builtInBoundGreet('!'); // Output: Hi, John!