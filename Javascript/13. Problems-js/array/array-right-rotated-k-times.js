/**
 * Rotate an array right by k positions.
 *
 * Three approaches: slice (clearest), the reversal trick (O(1) space, the
 * interview answer) and cyclic replacement.
 */

/** slice + concat — allocates a new array. */
function rotateRight(arr, k) {
  const n = arr.length;
  if (n === 0) return [];

  const shift = ((k % n) + n) % n; // handles k > n and negative k
  return [...arr.slice(-shift || n), ...arr.slice(0, -shift || n)].slice(0, n);
}

/** The same, written without the slice-of-zero trap. */
function rotateRightSlice(arr, k) {
  const n = arr.length;
  if (n === 0) return [];

  const shift = ((k % n) + n) % n;
  if (shift === 0) return [...arr];

  return [...arr.slice(n - shift), ...arr.slice(0, n - shift)];
}

/**
 * Reversal algorithm (LeetCode 189): reverse the whole array, then reverse
 * each of the two parts. O(1) extra space, in place.
 */
function rotateRightInPlace(arr, k) {
  const n = arr.length;
  if (n === 0) return arr;

  const shift = ((k % n) + n) % n;
  if (shift === 0) return arr;

  const reverse = (lo, hi) => {
    while (lo < hi) {
      [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
      lo++;
      hi--;
    }
  };

  reverse(0, n - 1);
  reverse(0, shift - 1);
  reverse(shift, n - 1);

  return arr;
}

/** Rotate LEFT by k — the same thing with the sign flipped. */
const rotateLeft = (arr, k) => rotateRightSlice(arr, -k);

/** Which element ends up at index i after rotating right by k. */
const elementAfterRotation = (arr, k, i) => arr[(i - k % arr.length + arr.length) % arr.length];

// ---- Examples ----
console.log(rotateRightSlice([1, 2, 3, 4, 5], 2));    // [4, 5, 1, 2, 3]
console.log(rotateRightSlice([1, 2, 3], 5));          // [2, 3, 1]  (k > n)
console.log(rotateRightSlice([1, 2, 3], 0));          // [1, 2, 3]
console.log(rotateRightInPlace([1, 2, 3, 4, 5, 6, 7], 3)); // [5,6,7,1,2,3,4]
console.log(rotateLeft([1, 2, 3, 4, 5], 2));          // [3, 4, 5, 1, 2]
console.log(elementAfterRotation([1, 2, 3, 4, 5], 2, 0)); // 4

module.exports = { rotateRight, rotateRightSlice, rotateRightInPlace, rotateLeft, elementAfterRotation };
