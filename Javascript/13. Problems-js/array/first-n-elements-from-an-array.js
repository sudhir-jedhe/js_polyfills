/**
 * Get the first n elements of an array (and the last n).
 *
 * slice handles the edge cases for free: n larger than the array returns
 * everything, n of 0 returns an empty array.
 */

/** First n. */
const firstN = (arr, n = 1) => arr.slice(0, Math.max(0, n));

/** Last n. */
const lastN = (arr, n = 1) => (n <= 0 ? [] : arr.slice(-n));

/** All but the first n. */
const dropFirstN = (arr, n = 1) => arr.slice(Math.max(0, n));

/** All but the last n. */
const dropLastN = (arr, n = 1) => (n <= 0 ? [...arr] : arr.slice(0, -n));

/** Take from the start while a predicate holds. */
function takeWhile(arr, predicate) {
  const out = [];

  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i)) break;
    out.push(arr[i]);
  }

  return out;
}

/** Drop from the start while a predicate holds. */
function dropWhile(arr, predicate) {
  let i = 0;
  while (i < arr.length && predicate(arr[i], i)) i++;
  return arr.slice(i);
}

/** Take from the END while a predicate holds. */
function takeRightWhile(arr, predicate) {
  let i = arr.length;
  while (i > 0 && predicate(arr[i - 1], i - 1)) i--;
  return arr.slice(i);
}

// ---- Examples ----
const arr = [1, 2, 3, 4, 5];

console.log(firstN(arr, 3));       // [1, 2, 3]
console.log(firstN(arr, 99));      // [1, 2, 3, 4, 5]
console.log(firstN(arr, 0));       // []
console.log(lastN(arr, 2));        // [4, 5]
console.log(dropFirstN(arr, 2));   // [3, 4, 5]
console.log(dropLastN(arr, 2));    // [1, 2, 3]
console.log(takeWhile(arr, (n) => n < 4));  // [1, 2, 3]
console.log(dropWhile(arr, (n) => n < 4));  // [4, 5]
console.log(takeRightWhile(arr, (n) => n > 3)); // [4, 5]

module.exports = { firstN, lastN, dropFirstN, dropLastN, takeWhile, dropWhile, takeRightWhile };
