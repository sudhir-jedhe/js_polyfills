/*************************** Array For Every method ***************************/
/**
 *
  every() exectues a provided *predicate* on each element of
  the array until it is not fulfilled.

  every() has two parameters:

  - the predicate callback function
  - a *this* argument for the callback. If none is provided, *this* will not be set in the predicate

  The predicate function one to three arguments:

  - the value of current element
  - the index of the current element
  - the Array object being traversed

  If the predicate is not fulfilled then the method will exit early (and return false).

  Calling every on an empty array will return true.
  */

Array.prototype.customEvery = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (!callback.call(thisArg, this[i], i, this)) {
      return false;
    }
  }
  return true;
};

// Example usage:
const numbers = [1, 2, 3, 4, 5];

// Check if all elements are greater than 0
const allGreaterThanZero = numbers.customEvery(function (element) {
  return element > 0;
});

console.log(allGreaterThanZero); // Output: true

/********************************** */
const array = [11, 12, 13, 14, 51];
let isOdd = true;

array.every(function (el) {
  if (el % 2 === 0) {
    isOdd = false;
    return false; // short-circuits the loop
  }
  return true;
});

console.log("Output: ", isOdd); // false

const users1 = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "Jane", lastName: "Doe" },
];
validateObject(users1); // Output: true

const users2 = [{ firstName: "John", lastName: "Doe" }, { lastName: "Doe" }];
validateObject(users2); // Output: false

export const validateObject = (users) => {
  return users.every((user) => user?.firstName);
};

export const validateObject = (users) => {
  for (let i = 0; i < users.length; i++) {
    if (!users[i]?.firstName) {
      return false;
    }
  }
  return true;
};
