/**
 * Offset the elements of an array.
 *
 * A positive offset moves elements to the LEFT (the first n wrap to the
 * end); a negative offset moves them right. This is rotation expressed as
 * an offset, which is how lodash-style utilities phrase it.
 */

/**
 * @param {Array} arr
 * @param {number} offset
 * @returns {Array} a new array
 */
function offset(arr, n) {
  return [...arr.slice(n), ...arr.slice(0, n)];
}

/** Offset with wraparound normalised, so |n| may exceed the length. */
function offsetSafe(arr, n) {
  const len = arr.length;
  if (len === 0) return [];

  const shift = ((n % len) + len) % len;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

/** Offset WITHOUT wrapping: elements that fall off are dropped and padded. */
function offsetNoWrap(arr, n, fill = undefined) {
  const len = arr.length;

  if (n > 0) return [...arr.slice(n), ...new Array(Math.min(n, len)).fill(fill)];
  if (n < 0) return [...new Array(Math.min(-n, len)).fill(fill), ...arr.slice(0, n)];

  return [...arr];
}

/** Add a constant to every numeric element — the other reading of "offset". */
const offsetValues = (arr, delta) => arr.map((n) => n + delta);

/** Shift the INDEXES: what index does element i end up at? */
const offsetIndex = (index, n, length) => ((index - n) % length + length) % length;

/** In-place offset using the reversal trick — O(1) extra space. */
function offsetInPlace(arr, n) {
  const len = arr.length;
  if (len === 0) return arr;

  const shift = ((n % len) + len) % len;
  if (shift === 0) return arr;

  const reverse = (lo, hi) => {
    while (lo < hi) {
      [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
      lo++;
      hi--;
    }
  };

  reverse(0, shift - 1);
  reverse(shift, len - 1);
  reverse(0, len - 1);

  return arr;
}

// ---- Examples ----
const arr = [1, 2, 3, 4, 5];

console.log(offset(arr, 2));        // [3, 4, 5, 1, 2]
console.log(offset(arr, -2));       // [4, 5, 1, 2, 3]
console.log(offsetSafe(arr, 7));    // [3, 4, 5, 1, 2]
console.log(offsetNoWrap(arr, 2, 0));   // [3, 4, 5, 0, 0]
console.log(offsetNoWrap(arr, -2, 0));  // [0, 0, 1, 2, 3]
console.log(offsetValues(arr, 10));     // [11, 12, 13, 14, 15]
console.log(offsetInPlace([1, 2, 3, 4, 5], 2)); // [3,4,5,1,2]

module.exports = { offset, offsetSafe, offsetNoWrap, offsetValues, offsetIndex, offsetInPlace };
