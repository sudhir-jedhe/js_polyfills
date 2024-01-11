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
