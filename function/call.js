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
