/**
 * Find the element at a given index after a number of range rotations.
 *
 * Each rotation right-rotates a subrange [L, R] by one. Instead of applying
 * every rotation to the array, walk the ranges BACKWARDS and map the index
 * to where the value came from — O(number of rotations) with no mutation.
 */

/**
 * @param {number[]} arr
 * @param {Array<[number, number]>} ranges right-rotate [L, R] by 1, in order
 * @param {number} index the index to query after all rotations
 * @returns {number}
 */
function elementAfterRotations(arr, ranges, index) {
  let position = index;

  // Undo the rotations from last to first.
  for (let i = ranges.length - 1; i >= 0; i--) {
    const [left, right] = ranges[i];

    if (position >= left && position <= right) {
      // A right rotation moved arr[position - 1] into position
      // (and wrapped arr[right] into left).
      position = position === left ? right : position - 1;
    }
  }

  return arr[position];
}

/** Apply the rotations for real, to verify the index arithmetic. */
function applyRotations(arr, ranges) {
  const out = [...arr];

  for (const [left, right] of ranges) {
    const last = out[right];
    for (let i = right; i > left; i--) out[i] = out[i - 1];
    out[left] = last;
  }

  return out;
}

/** Answer several queries at once. */
const elementsAfterRotations = (arr, ranges, indexes) =>
  indexes.map((i) => elementAfterRotations(arr, ranges, i));

/** Whole-array right rotation by k, as index arithmetic. */
const elementAfterKRotations = (arr, k, index) =>
  arr[((index - k) % arr.length + arr.length) % arr.length];

// ---- Examples ----
const arr = [1, 2, 3, 4, 5];
const ranges = [[0, 2], [1, 4]];

console.log(applyRotations(arr, ranges));               // [3, 5, 1, 2, 4]
console.log(elementAfterRotations(arr, ranges, 1));     // 5
console.log(elementAfterRotations(arr, ranges, 0));     // 3
console.log(elementsAfterRotations(arr, ranges, [0, 1, 2, 3, 4])); // [3,5,1,2,4]
console.log(elementAfterKRotations([1, 2, 3, 4, 5], 2, 0)); // 4

module.exports = { elementAfterRotations, elementsAfterRotations, applyRotations, elementAfterKRotations };
