Function.prototype.myCall = function (context, ...args) {
  let currentContext = context || globalThis;
  let randomProp = Math.random();
  while (currentContext[randomProp] !== undefined) {
    randomProp = Math.random();
  }
  currentContext[randomProp] = this;
  let result = currentContext[randomProp](...args);
  delete currentContext[randomProp];
  return result;
};

printName.myCall(myName, "Palia", "India");

/********************************* */


// A simple version
Function.prototype.mycall = function (obj = {}, ...args) {
  let fn = this; // refers to funtion that bind is used on
  // obj refers to the this that is being binded to the function
  // args refers to arguments that are passed to the
  // function while binding
  if (typeof fn !== "function") {
    throw new Error("Invalid function provided for binding.");
  }
  obj.myFn = this;
  return obj.myFn(...args);
};

// here we also add a check assuming same method name maybe present in the
// object
Function.prototype.mycall = function (obj = {}, ...args) {
  let fn = this; // refers to funtion that bind is used on
  if (typeof fn !== "function") {
    throw new Error("Invalid function provided for binding.");
  }
  let randomProp = Math.random(); // generate a random number
  // check weather it is
  while (obj[randomProp] !== undefined) {
    randomProp = Math.random();
  }
  obj[randomProp] = this; // creating a method
  //getting the result after calling the function
  let result = obj[randomProp](...args);
  // deleting the key :value pair where funtion is added
  // as it is no longer needed
  delete obj[randomProp];
  return result;
};

// This is a JavaScript Quiz from BFE.dev

function a() {
  console.log(1);
  return {
    a: function () {
      console.log(2);
      return a();
    },
  };
}

a().a();

/******************************* */

Function.prototype.mycall = function (thisArg, ...args) {
  // your code here
  thisArg = thisArg || window; // thisArg can be empty
  thisArg = Object(thisArg); // transform primitive value
  let func = Symbol(); // create a unique property
  thisArg[func] = this; // assign the function to a unique method created on the context
  let res = thisArg[func](...args); // call the method with passed args
  delete thisArg[func]; // delete this unique method so as to not cause any sideeffects
  return res;
};

/************************************************ */
// CALL POLYFILL
// args is arguments one by one
Function.prototype.mycall = function (context, ...args) {
  // you tie a function into an object(context) as if it belonged to the object
  const symbol = Symbol(); // create unique key

  context = Object(context || window); // set context to windows if null and Create an object to handle primitive values
  // 'this' points to the calling function here
  context[symbol] = this; // assign the function to a unique method created on the context
  const result = context[symbol](...args); // call the function
  delete context[symbol]; // delete the unique key
  return result; // return result
};

// BIND POLYFILL
// bind returns a func which when called behave like apply, call
Function.prototype.mybind = function (context, ...args) {
  const symbol = Symbol();
  context[symbol] = this;

  return function () {
    const result = context[symbol](...args); // call the function
    delete context[symbol]; // delete the unique key
    return result; // return result
  };
};

// APPLY POLYFILL
// code exact same as call just the args is an array here so need to destruct(...)
Function.prototype.myapply = function (context, args) {
  // you tie a function into an object(context) as if it belonged to the object
  const symbol = Symbol(); // create unique key

  context = Object(context || window); // set context to windows if null and Create an object to handle primitive values
  // 'this' points to the calling function here
  context[symbol] = this; // assign the function to a unique method created on the context
  const result = context[symbol](...args); // call the function
  delete context[symbol]; // delete the unique key
  return result; // return result
};

// Testing
let obj = {
  a: 10,
  b: 20,
};

function tester(a, b) {
  return `a: ${this.a} and b: ${this.b} | curr args a: ${a} and b: ${b}`;
}

console.log(tester.mycall(obj, 30, 40));

const bindFunc = tester.mybind(obj, 30, 40);
console.log(bindFunc());

console.log(tester.myapply(obj, [30, 40]));

/***************************************** */
Function.prototype.mycall = function (thisArg, ...args) {
  const symbol = Symbol();

  const context = Object(thisArg == undefined ? window : thisArg);
  context[symbol] = this;

  const result = context[symbol](...args);

  delete context[symbol];

  return result;
};

/*********************************************** */

// Objective is to call the function with provided object as first parameters and other arguments passed

Function.prototype.mycall = function (thisArg, ...args) {
  // your code here
  console.log(this); //this points to function that called
  let fn = this;
  console.log(thisArg); // thisArg has the object to which context should point to

  let obj = Object(thisArg || window); // To handle testcase 'undefined null should be replaced with window '
  //'primitive values 1, `1` should be transformed'

  const symbol = Symbol(); // create unique key
  //unique key to handle testcase 'thisArg should not have property conflict if you add new property to it'
  obj[symbol] = fn; //Create this function on object and assign the function because in function
  //printFullName defnition this should refer to object

  let res = obj[symbol](...args); //Call the function --> see previous step
  delete obj[symbol]; //To handle testcase 'thisArg should not be kept unchanged after the call'
  return res;
};

/************************************ */

// The callPolyfill method should accept an object obj as its first parameter and any number of additional arguments. The obj will become the this context for the function, and the additional arguments are passed to the function that the callPolyfill method belongs to
Function.prototype.callPolyfill = function (obj, ...args) {
  // Check if the first argument is an object
  if (typeof obj !== "object" && typeof obj !== "function") {
    throw new TypeError("First argument must be an object or function");
  }

  // Store a reference to the function
  const func = this;

  // Set the obj as the 'this' context for the function
  obj.__temp__ = func;

  // Call the function with the provided context and arguments
  const result = obj.__temp__(...args);

  // Remove the temporary property from the object
  delete obj.__temp__;

  // Return the result of the function call
  return result;
};

// Example usage:
const person = {
  name: "John",
};

function sayHello(greeting) {
  return `${greeting}, ${this.name}!`;
}

const greeting = sayHello.callPolyfill(person, "Hello");
console.log(greeting); // Output: Hello, John!



/***************************************** */

Function.prototype.callPolyfill = function (obj, ...args) {
  // 1. Set the context (`this`) of the function to the provided object `obj`
  // 2. Use `apply` to call the function with the correct context and arguments
  obj = obj || globalThis; // If `obj` is null or undefined, set `this` to the global context
  
  // 3. Use a temporary property to call the function
  const uniqueSymbol = Symbol('uniqueSymbol'); // Create a unique symbol to avoid overwriting properties
  obj[uniqueSymbol] = this; // Add the function as a property of `obj`

  // 4. Invoke the function with the provided arguments
  const result = obj[uniqueSymbol](...args);

  // 5. Remove the temporary property after the function call to clean up
  delete obj[uniqueSymbol];

  return result; // Return the result of the function call
};



Call Function with Custom Context
Medium
Companies
Enhance all functions to have the callPolyfill method. The method accepts an object obj as it's first parameter and any number of additional arguments. The obj becomes the this context for the function. The additional arguments are passed to the function (that the callPolyfill method belongs on).

For example if you had the function:

function tax(price, taxRate) {
  const totalCost = price * (1 + taxRate);
  console.log(The cost of ${this.item} is ${totalCost});
}
Calling this function like tax(10, 0.1) will log "The cost of undefined is 11". This is because the this context was not defined.

However, calling the function like tax.callPolyfill({item: "salad"}, 10, 0.1) will log "The cost of salad is 11". The this context was appropriately set, and the function logged an appropriate output.

Please solve this without using the built-in Function.call method.

 

Example 1:

Input:
fn = function add(b) {
  return this.a + b;
}
args = [{"a": 5}, 7]
Output: 12
Explanation:
fn.callPolyfill({"a": 5}, 7); // 12
callPolyfill sets the "this" context to {"a": 5}. 7 is passed as an argument.
Example 2:

Input: 
fn = function tax(price, taxRate) { 
 return The cost of the ${this.item} is ${price * taxRate}; 
}
args = [{"item": "burger"}, 10, 1.1]
Output: "The cost of the burger is 11"
Explanation: callPolyfill sets the "this" context to {"item": "burger"}. 10 and 1.1 are passed as additional arguments.