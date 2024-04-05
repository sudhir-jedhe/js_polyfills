Function.prototype.myBind = function (...args) {
  var callback = this,
    ctx = args.splice(1);
  return function (...a) {
    callback.call(args[0], ...[...ctx, ...a]);
  };
};

const result2 = printName.myBind(myName, "Palia");
result2("India");

/***************************custom Bind***************** */
Function.prototype.myBind = function (context, ...args1) {
  const originalFunction = this;

  return function (...args2) {
    return originalFunction.apply(context, [...args1, ...args2]);
  };
};

Function.prototype.myBind = function (obj) {
  let func = this;
  return function () {
    func.apply(obj, arguments);
  };
};

/******************************* */
let obj = {
  name: "Jack",
};

let myFunc = function (id) {
  console.log(`${this.name}, ${id}`); // id will be undefined
};

// Accepting any number of arguments passed to myBind
Function.prototype.myBind = function (obj, ...args) {
  let func = this;
  return function () {
    func.apply(obj, [...args]);
  };
};

let newFunc = myFunc.myBind(obj, "a_random_id");
newFunc(); // Jack, a_random_id

/*************************** */

let obj = {
  name: "Jack",
};

let myFunc = function (id, city) {
  console.log(`${this.name}, ${id}, ${city}`); // id will be undefined
};

// Accepting any number of arguments passed to myBind
Function.prototype.myBind = function (obj, ...args) {
  let func = this;
  // Accepting arguments passed to newFunc
  return function (...newArgs) {
    func.apply(obj, [...args, ...newArgs]);
  };
};

let newFunc = myFunc.myBind(obj, "a_random_id");
newFunc("New York"); // Jack, a_random_id, New York

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

/**************************** */
const objIntro = {
  name: "rahul",
  city: "gwalior",
};

function sayIntro(company, place) {
  console.log(
    `name is ${this.name}, place is ${this.city} and company is ${company} and work place is ${place} `
  );
}

Function.prototype.myBind = function (context, args) {
  if (typeof this !== "function") {
    throw new Error(this, "invalid call");
  }

  context.fnc = this;
  return function (...nextargs) {
    context.fnc(...args, ...nextargs);
  };
};
sayIntro.myBind(objIntro, ["cognizant", "gurgaon"]);

/************************************************* */
function customBind(obj, name) {
  const fn = this;
  return function () {
    obj.fn = fn;
    obj.fn(name);
    delete obj.fn;
    return obj;
  };
}

Function.prototype.customBind = customBind;

let obj = {
  firstName: "Affan",
  lastName: "Khan",
};
function ChangeFirstName(name) {
  this.firstName = "Saif";
}

let CallChangeName = ChangeFirstName.customBind(
  obj,
  prompt("Enter first name to replace")
);
console.log(CallChangeName());

/************************************ */

if (!Function.prototype.myBind) {
  Function.prototype.myBind = function (context, ...rest) {
    const self = this;
    return function () {
      self.call(context, ...rest);
    };
  };
}

/******************************* */
Function.prototype.myOwnBind = function (newThis) {
  if (typeof this !== "function") {
    throw new Error(this + "cannot be bound as it's not callable");
  }
  var boundTargetFunction = this;
  var boundArguments = Array.prototype.slice.call(arguments, 1);
  return function boundFunction() {
    // here the arguments refer to the second time when we call the target function returned from bind
    var targetArguments = Array.prototype.slice.call(arguments);
    return boundTargetFunction.apply(
      newThis,
      boundArguments.concat(targetArguments)
    );
  };
};
