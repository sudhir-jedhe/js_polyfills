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
