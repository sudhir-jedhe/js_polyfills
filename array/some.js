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

/****************************** */
const array = [2, 4, 8, 10];
let found = false;

array.some(function (element) {
  if (element === 6 {
    found = true;
    return true; // Short-circuits the loop
  }
});

console.log("Output: ", found); // false

/********************************* */
const arr = [25, 33, 22, 45, 67, 1, 32, 223];

console.log(arr.some((element) => element > 50));
console.log(arr.some((element) => element < 40));
console.log(arr.some((element) => element > 70));

const assets = [
  {
    id: 1,
    title: "v1",
    type: "video",
  },
  {
    id: 2,
    title: "v2",
    type: "video",
  },
  {
    id: 3,
    title: "v3",
    type: "audio",
  },
];

const hasVideoAssets = assets.find((asset) => asset.type === "video"); // first video find
console.log(hasVideoAssets, Boolean(hasVideoAssets));

// check occurrence in array
const isVideo = assets.some((asset) => asset.type === "video");
console.log(isVideo);


const any = (arr, fn = Boolean) => arr.some(fn);

any([0, 1, 2, 0], x => x >= 2); // true
any([0, 0, 1, 0]); // true


const none = (arr, fn = Boolean) => !arr.some(fn);

none([0, 1, 3, 0], x => x == 2); // true
none([0, 0, 0]); // true