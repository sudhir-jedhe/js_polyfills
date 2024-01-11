/*************************** Array For Find method ***************************/
Array.prototype.customFind = function (callback, thisArg) {
  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (callback.call(thisArg, this[i], i, this)) {
      return this[i];
    }
  }

  return undefined;
};

// Example usage:
const numbers = [1, 2, 3, 4, 5];

const foundElement = numbers.customFind(function (element) {
  return element > 2;
});

console.log(foundElement); // Output: 3
/************ */

const nums = [2, -3, 4, 6, 1, 23, 9, 7];

const e1 = nums.find((e) => e > 10);
console.log(e1);

/************ */

const arr = [25, 33, 22, 45, 67, 1, 32, 223];

const greaterElement = arr.find((ele) => ele > 50);

console.log(greaterElement);
