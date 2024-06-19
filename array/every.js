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


/***********/

const all = (arr, fn = Boolean) => arr.every(fn);

all([4, 2, 3], x => x > 1); // true
all([1, 2, 3]); // true




const truthCheckCollection = (collection, pre) =>
  collection.every(obj => obj[pre]);

truthCheckCollection(
  [
    { user: 'Tinky-Winky', sex: 'male' },
    { user: 'Dipsy', sex: 'male' },
  ],
  'sex'
); // true


// Accounting for nested keys
// Checking for nested keys is a bit more complex, but can be done with a little ingenuity.

// Given an array of keys, you can use Array.prototype.every() to sequentially check the keys to the internal depth of the object. Using Object.prototype.hasOwnProperty(), you can then check if the object does not have the current key or is not an object, stop propagation and return false. Otherwise, assign the key's value to the object to use on the next iteration.
const hasKeyDeep = (obj, keys) => {
  return (
    keys.length > 0 &&
    keys.every(key => {
      if (typeof obj !== 'object' || !obj.hasOwnProperty(key)) return false;
      obj = obj[key];
      return true;
    })
  );
};

let obj = {
  a: 1,
  b: { c: 4 },
  'b.d': 5
};
hasKeyDeep(obj, ['a']); // true
hasKeyDeep(obj, ['b']); // true
hasKeyDeep(obj, ['b', 'c']); // true
hasKeyDeep(obj, ['b.d']); // true
hasKeyDeep(obj, ['d']); // false
hasKeyDeep(obj, ['c']); // false
hasKeyDeep(obj, ['b', 'f']); // false



/*************************************** */

Check if all values of a JavaScript array are equal

Checking if all array elements match a condition in JavaScript is pretty simple. But how can you check if all values of an array are equal? It's just a matter of finding the right value to compare the rest of the array to.

Comparing array elements by value
Using Array.prototype.every() is what comes to mind and it's the right path to go down. As we need to compare all elements to each other, we can just use the first element as the reference and compare the rest of the array to it.

const allEqual = arr => arr.every(val => val === arr[0]);

allEqual([1, 1, 1]); // true
allEqual([1, 1, 2]); // false
Comparing array elements using a mapping function
For more complex values, such as objects, you might want to use a mapping function to compare the elements. This way, you can compare the elements based on a specific property or a custom comparison function.

The technique is the same as before, except that you call the mapping function on the first element and then compare the rest of the array to the result.

const allEqualBy = (arr, fn) =>
  arr.every((val, i) => fn(val, i, arr) === fn(arr[0], 0, arr));

allEqualBy([{ a: 1 }, { a: 1 }, { a: 1 }], obj => obj.a); // true
allEqualBy([{ a: 1 }, { a: 1 }, { a: 2 }], obj => obj.a); // false