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
    return (first, ...args) => args.length ? fn(first, ...args) : (...args2) => fn(first, ...args2);
  }
  
  module.exports = curry;

  /****** */
  function curryr(fn) {
    return (first, ...args) => args.length ? fn(first, ...args) : (innerFirst, ...args2) => fn(innerFirst, first, ...args2);
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

      console.log('calling else');

      return function(...args2) {
        
        return curried.apply(this, args.concat(args2));
      }
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
      return function (c)  {
          return a * b * c
      }
  }
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
}

let multiply_curried = (a) => (b) => (c) => {

  return a * b * c;
}


let res = multiply(1, 2, 3);
console.log(res);

let res2 = multiply_curried(1)(2)(3);
console.log(res2);