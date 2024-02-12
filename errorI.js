// Syntax error - The error occurs when you use a predefined syntax incorrectly.

/*
const func = () =>
console.log(hello)
}

*/

// }
// ^
// SyntaxError: Unexpected token }

/***************************************************** */
// Reference Error - In a case where a variable reference can't be found or hasn't been declared, then a Reference error occurs.
// console.log(x);

// console.log(x);
//             ^
// ReferenceError: x is not defined

/****************************************************************** */

// Type Error - An error occurs when a value is used outside the scope of its data type.

let num = 15;
console.log(num.split("")); //converts a number to an array

// console.log(num.split("")); //converts a number to an array
//                 ^
// TypeError: num.split is not a function

/********************************************************************* */

// RangeError - There is an error when a range of expected values is required, as shown below:

const checkRange = (num) => {
  if (num < 30) throw new RangeError("Wrong number");
  return true;
};

checkRange(20);

// RangeError: Wrong number

/*********************************************************** */
