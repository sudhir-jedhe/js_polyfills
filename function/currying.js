/**********************Implement Currying | JavaScript *************** */
function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    } else {
      return function (...nextArgs) {
        return curried(...args, ...nextArgs);
      };
    }
  };
}

// Example usage:

// A function with multiple parameters
function add(a, b, c) {
  return a + b + c;
}

// Curry the 'add' function
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // Output: 6
console.log(curriedAdd(1, 2)(3)); // Output: 6
console.log(curriedAdd(1)(2, 3)); // Output: 6
console.log(curriedAdd(1, 2, 3)); // Output: 6
/****** */
function curry(fn) {
  return (first, ...args) =>
    args.length ? fn(first, ...args) : (...args2) => fn(first, ...args2);
}

module.exports = curry;

/****** */
function curryr(fn) {
  return (first, ...args) =>
    args.length
      ? fn(first, ...args)
      : (innerFirst, ...args2) => fn(innerFirst, first, ...args2);
}

module.exports = curryr;

/************************************* */
function multiply(a, b, c) {
  return a * b * c;
}

function curry(func) {
  return function curried(...args) {
    console.log(args);

    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      console.log("calling else");

      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

let curried = curry(multiply);

console.log(curried(1, 2, 3));
console.log(curried(1)(2, 3));

/****************************************** */
function multiply(a, b, c) {
  return a * b * c;
}

function multiply_curried(a) {
  return function (b) {
    return function (c) {
      return a * b * c;
    };
  };
}

let res = multiply(1, 2, 3);
console.log(res);

let mc1 = multiply_curried(1);
let mc2 = mc1(2);
let res2 = mc2(3);
console.log(res2);

let res3 = multiply_curried(1)(2)(3);
console.log(res3);

/******************************************** */
let multiply = (a, b, c) => {
  return a * b * c;
};

let multiply_curried = (a) => (b) => (c) => {
  return a * b * c;
};

let res = multiply(1, 2, 3);
console.log(res);

let res2 = multiply_curried(1)(2)(3);
console.log(res2);

/******************************************************* */
function curry(func) {
  // ...args collects arguments as array
  return function curriedFunc(...args) {
    // Check if current args passed equals the number of args func expects
    if (args.length >= func.length) {
      // if args length equals the expected number, pass into func (spread)
      return func(...args);
    } else {
      /* Else, we return a function that collects the next arguments passed and 
      recursively call curriedFunc */
      return function (...next) {
        return curriedFunc(...args, ...next);
      };
    }
  };
}

const joinArgs = (a, b, c) => {
  return `${a}_${b}_${c}`;
};

const curriedFunc = curry(joinArgs);

curriedJoin(1, 2, 3); // '1_2_3'
curriedJoin(1)(2, 3); // '1_2_3'
curriedJoin(1, 2)(3); // '1_2_3'

sum(1)(2)(3)(4); // called like curried function
sum(1, 2)(3, 4); // called like partial application

/************************************************************** */
// Create a single function which can perform sum(a, b, c), sum(a, b)(c), sum(a)(b, c) and sum(a)(b)(c) and returns sum of a, b and c
// Example
sum(2)(4)(6); // 12
sum(3, 2)(5); // 10
sum(4)(-10, -6); // -12
sum(6, -3, 1); // 4

// Sum functionality can be obtained by returning the sum when all the arguments are present
// The cases when only 1 or 2 arguments are passed need to be managed and handled
function sum(a, b, c) {
  if (a !== undefined && b !== undefined && c !== undefined) {
    return a + b + c;
  }
  if (a !== undefined && b !== undefined) {
    return function (c) {
      return sum(a, b, c);
    };
  }
  return function (b, c) {
    if (b !== undefined && c !== undefined) {
      return sum(a, b, c);
    }
    return function (c) {
      return sum(a, b, c);
    };
  };
}

const countOfValues = 3;

function sum() {
  const args = arguments;

  if (args.length === countOfValues) {
    return Array.prototype.reduce.call(args, (a, b) => a + b);
  }

  return function () {
    return sum(...args, ...arguments);
  };
}

/************************************************************* */
// Design a function which can keep recieving the arguments on each function call and returns the sum when no argument is passed
// The function can be designed to return another function which maintains the closure over the previous sum value
// The check for breaking condition can be added using the argument check for undefined
// 3rd solution uses the property on function to store the total which will be updated on each call hence the same function can be returned
// Example
sum(2)(4)(6)(1)(); // 13
sum(2)(4)(); // 6
sum(3)(); // 3

// Sum functionality can be obtained by returning the recursively calling till the 2nd parameter value is undefined
function sum(a) {
  return function (b) {
    if (b === undefined) {
      return a;
    }
    return sum(a + b);
  };
}

const sum = (a) => (b) => b === undefined ? a : sum(a + b);

function sum(a) {
  if (typeof a === "undefined") {
    return sum.total;
  }
  sum.total = (sum.total ?? 0) + a;
  return sum;
}

/********************** */
function curry(fn) {
  // Create a closure that stores the arguments that have been passed in so far.
  let args = [];
  return function (...newArgs) {
    // Add the new arguments to the list of arguments.
    args = args.concat(newArgs);
    // If the function has enough arguments, call it with all of the arguments.
    if (args.length === fn.length) {
      return fn(...args);
    }
    // Otherwise, return a new function that takes the remaining arguments.
    else {
      return curry(fn)(...args);
    }
  };
}
const add = (a, b, c) => a + b + c;

const curriedAdd = curry(add);

const addOne = curriedAdd(1);

const addTwo = addOne(2);

const addThree = addTwo(3);

console.log(addThree); // 6

/******************************************** */

// Implement a js function which transforms a function which takes variadic
// arguments into a function that can be repeatedly called with any number of
// arguments

function variadic(fn) {
  return function (...args) {
    return fn.apply(this, args);
  };
}

// This function takes a function fn as an argument and returns a new function which can be called with any number of arguments. The new function will call the original function with the arguments that were passed to it.
// For example, the following code shows how to use the variadic function to create a function which can be used to add any number of numbers together:

const add = variadic((...args) => {
  return args.reduce((sum, num) => sum + num, 0);
});

console.log(add(1, 2, 3, 4, 5)); // 15

const log = variadic(console.log);

log("Hello", "world!");

// The log function can be called with any number of arguments, and it will log
// all of the arguments to the console. The variadic function is a useful way to
// create functions which can be called with any number of arguments. This can
// be helpful for a variety of tasks, such as adding numbers together, logging
// messages to the console, and more.

/************************* */
const join = (a, b, c) => {
  return `${a}_${b}_${c}`;
};

const curriedJoin = curry(join);

curriedJoin(1, 2, 3); // '1_2_3'

curriedJoin(1)(2, 3); // '1_2_3'

curriedJoin(1, 2)(3); // '1_2_3'

/************************************ */
// curry() which also supports placeholder.
const join = (a, b, c) => {
  return `${a}_${b}_${c}`;
};

const curriedJoin = curry(join);
const _ = curry.placeholder;

curriedJoin(1, 2, 3); // '1_2_3'

curriedJoin(_, 2)(1, 3); // '1_2_3'

curriedJoin(_, _, _)(1)(_, 3)(2); // '1_2_3'

/**
 * @param { Function } func
 */
function curry(func) {
  return function curried(...args) {
    const complete =
      args.length >= func.length &&
      !args.slice(0, func.length).includes(curry.placeholder);
    if (complete) return func.apply(this, args);
    return function (...newArgs) {
      // replace placeholders in args with values from newArgs
      const res = args.map((arg) =>
        arg === curry.placeholder && newArgs.length ? newArgs.shift() : arg
      );
      return curried(...res, ...newArgs);
    };
  };
}

curry.placeholder = Symbol();

/************************************************ */

/**
 * @param { Function } func
 */
function curry(func) {
  return function curried(...args) {
    // we need to return a function to make it curry-able.

    // 1. If the arguments are extra then eliminate them
    // we don't want to pass 6 arguments when the expected is 3.
    // it will interfere with our placeholder logic
    const sanitizedArgs = args.slice(0, func.length);

    // see if placeholder is available in arguments
    const hasPlaceholder = sanitizedArgs.some(
      (arg) => arg == curry.placeholder
    );

    // if no placeholder and arguements are equal to what expected then it is normal function call
    if (!hasPlaceholder && sanitizedArgs.length == func.length) {
      return func.apply(this, sanitizedArgs);
    }

    // else we need to replace placeholders with actual values
    // we call helper function `mergeArgs` for this
    // we pass first and next arguments to helper function
    return function next(...nextArgs) {
      return curried.apply(this, mergeArgs(sanitizedArgs, nextArgs));
    };
  };
}

function mergeArgs(args, nextArgs) {
  let result = [];

  // iterate over args (because we need to replace from it)
  // in each iteration, if we find element == curry.placeholder
  // then we replace that placeholder with first element from nextArgs
  // else we put current element
  args.forEach((arg, idx) => {
    if (arg == curry.placeholder) {
      result.push(nextArgs.shift());
    } else {
      result.push(arg);
    }
  });

  // we merge both, because there might be chance that args < nextArgs
  return [...result, ...nextArgs];
}

curry.placeholder = Symbol();

/***************************************** */
function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length && !args.includes(curry.placeholder)
      ? fn(...args)
      : (...args2) =>
          curried(
            ...args.map((a) => (a === curry.placeholder ? args2.shift() : a)),
            ...args2
          );
  };
}

curry.placeholder = Symbol();
