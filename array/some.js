
/*************************** Array For Some method ***************************/
/**
 *
  some() exectues a provided *predicate* on each element of
  the array until it is fulfilled.

  some() has two parameters:

  - the predicate callback function
  - a *this* argument for the callback. If none is provided, *this* will not be set in the predicate

  The predicate function one to three arguments:

  - the value of current element
  - the index of the current element
  - the Array object being traversed

  If the predicate is fulfilled then the method will exit early (and return true).

  Calling some on an empty array will return false.
*/

Array.prototype.customSome = function (callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      if (callback.call(thisArg, this[i], i, this)) {
        return true;
      }
    }
    return false;
  };
  
  // Example usage:
  const numbers = [1, 2, 3, 4, 5];
  
  // Check if at least one element is greater than 3
  const anyGreaterThanThree = numbers.customSome(function (element) {
    return element > 3;
  });
  
  console.log(anyGreaterThanThree); // Output: true