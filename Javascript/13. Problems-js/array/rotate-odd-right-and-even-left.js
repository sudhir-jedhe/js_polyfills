/**
 * Rotate all odd numbers right and all even numbers left in an array
 * of 1..n.
 *
 * Extract the odds and the evens as two separate sequences, rotate each in
 * its own direction, then put them back in their original positions.
 *
 * Time  O(n)
 * Space O(n)
 */

/** Rotate a list right by one: last element moves to the front. */
const rotateRightOne = (arr) => (arr.length ? [arr[arr.length - 1], ...arr.slice(0, -1)] : arr);

/** Rotate a list left by one: first element moves to the end. */
const rotateLeftOne = (arr) => (arr.length ? [...arr.slice(1), arr[0]] : arr);

/**
 * @param {number[]} arr
 * @returns {number[]}
 */
function rotateOddRightEvenLeft(arr) {
  const odds = rotateRightOne(arr.filter((n) => Math.abs(n) % 2 === 1));
  const evens = rotateLeftOne(arr.filter((n) => Math.abs(n) % 2 === 0));

  let oddIndex = 0;
  let evenIndex = 0;

  // Put each rotated sequence back into the positions of its own parity.
  return arr.map((n) => (Math.abs(n) % 2 === 1 ? odds[oddIndex++] : evens[evenIndex++]));
}

/** The k-rotation generalisation. */
function rotateByParity(arr, k) {
  const rotate = (list, shift) => {
    const n = list.length;
    if (n === 0) return list;
    const s = ((shift % n) + n) % n;
    return [...list.slice(n - s), ...list.slice(0, n - s)];
  };

  const odds = rotate(arr.filter((n) => Math.abs(n) % 2 === 1), k);   // right
  const evens = rotate(arr.filter((n) => Math.abs(n) % 2 === 0), -k); // left

  let oi = 0;
  let ei = 0;
  return arr.map((n) => (Math.abs(n) % 2 === 1 ? odds[oi++] : evens[ei++]));
}

/** Separate odds and evens without rotating — the building block. */
const splitByParity = (arr) => [
  arr.filter((n) => Math.abs(n) % 2 === 1),
  arr.filter((n) => Math.abs(n) % 2 === 0),
];

/** Move all evens to the front, odds to the back, in place. */
function partitionByParity(arr) {
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    if (Math.abs(arr[read]) % 2 === 0) {
      [arr[write], arr[read]] = [arr[read], arr[write]];
      write++;
    }
  }

  return arr;
}

// ---- Examples ----
console.log(rotateOddRightEvenLeft([1, 2, 3, 4, 5, 6]));
// odds [1,3,5] -> [5,1,3]; evens [2,4,6] -> [4,6,2]  => [5,4,1,6,3,2]

console.log(rotateOddRightEvenLeft([1, 2, 3]));  // [3, 2, 1]
console.log(rotateByParity([1, 2, 3, 4, 5, 6], 2));
console.log(splitByParity([1, 2, 3, 4]));        // [[1,3], [2,4]]
console.log(partitionByParity([1, 2, 3, 4, 5])); // evens first

module.exports = { rotateOddRightEvenLeft, rotateByParity, splitByParity, partitionByParity, rotateLeftOne, rotateRightOne };
