function findIndex(array, callback) {
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i])) {
      return i;
    }
  }
  return -1;
}

const array = [1, 2, 3, 4, 5];

const index = findIndex(array, (element) => element > 3);

console.log(index); // 3

/*********************************** */

const numbers = [3, -1, 1, 4, 1, 5, 9, 2, 6];
const firstTrough = numbers
  .filter((num) => num > 0)
  .findIndex((num, idx, arr) => {
    // Without the arr argument, there's no way to easily access the
    // intermediate array without saving it to a variable.
    if (idx > 0 && num >= arr[idx - 1]) return false;
    if (idx < arr.length - 1 && num >= arr[idx + 1]) return false;
    return true;
  });
console.log(firstTrough); // 1

/************************************* */
function isPrime(element) {
  if (element % 2 === 0 || element < 2) {
    return false;
  }
  for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
    if (element % factor === 0) {
      return false;
    }
  }
  return true;
}

console.log([4, 6, 8, 9, 12].findIndex(isPrime)); // -1, not found
console.log([4, 6, 7, 9, 12].findIndex(isPrime)); // 2 (array[2] is 7)

/******************************** */
const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber));
// Expected output: 3

/******************************************** */
Array.prototype.myFindIndex = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError(
      "Array.prototype.myFindIndex called on null or undefined"
    );
  }

  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = Object(this);
  const len = arr.length >>> 0;
  let k = 0;

  while (k < len) {
    if (k in arr && callback.call(thisArg, arr[k], k, arr)) {
      return k;
    }
    k++;
  }

  return -1;
};
