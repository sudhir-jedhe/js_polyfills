/**
 * Find two numbers that sum up to 0.
 *
 * Given an array of integers, return the indices of two numbers that add up
 * to 0. Any valid pair works. Return null when no such pair exists.
 *
 * Two zeroes count as a valid pair (0 + 0 === 0).
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * @param {number[]} arr
 * @returns {[number, number] | null}
 */
function findTwo(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return null;

  const seen = new Map(); // value -> first index it was seen at

  for (let i = 0; i < arr.length; i++) {
    const complement = -arr[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    // Only remember the first occurrence so the returned pair is left-most.
    if (!seen.has(arr[i])) seen.set(arr[i], i);
  }

  return null;
}

// ---- Examples ----
console.log(findTwo([1, 2, 3, -1]));       // [0, 3]
console.log(findTwo([1, 2, 3, -1, -2, 0])); // [0, 3]
console.log(findTwo([0, 0, 2, 3]));         // [0, 1]
console.log(findTwo([1, 2, 3, 4]));         // null

module.exports = { findTwo };
