/**
 * Equally divide an array into two sets such that one set has the maximum
 * number of distinct elements.
 *
 * Give each of the two halves n/2 elements. To maximise distinct values in
 * the first set, hand it as many distinct values as it can hold:
 *   answer = min(number of distinct values, n / 2)
 *
 * Time  O(n)
 * Space O(k) distinct values
 */

/**
 * @param {number[]} arr array of even length
 * @returns {number} maximum distinct elements one half can hold
 */
function maxDistinctInHalf(arr) {
  const distinct = new Set(arr).size;
  return Math.min(distinct, arr.length / 2);
}

/**
 * The actual split: fill the first half with distinct values first, then
 * top it up with leftovers.
 */
function splitMaximisingDistinct(arr) {
  const half = arr.length / 2;
  const counts = new Map();
  for (const n of arr) counts.set(n, (counts.get(n) || 0) + 1);

  const first = [];
  const leftovers = [];

  for (const [value, count] of counts) {
    if (first.length < half) {
      first.push(value);
      for (let i = 1; i < count; i++) leftovers.push(value);
    } else {
      for (let i = 0; i < count; i++) leftovers.push(value);
    }
  }

  while (first.length < half) first.push(leftovers.pop());

  return { first, second: leftovers, distinctInFirst: new Set(first).size };
}

/**
 * LeetCode 1465-style variant: after removing n/2 elements, how many
 * distinct values can remain? Same formula.
 */
const maxDistinctAfterRemoval = (arr) => Math.min(new Set(arr).size, arr.length / 2);

/** Count of values that appear exactly once — often the follow-up. */
function countUniqueValues(arr) {
  const counts = new Map();
  for (const n of arr) counts.set(n, (counts.get(n) || 0) + 1);
  return [...counts.values()].filter((c) => c === 1).length;
}

// ---- Examples ----
console.log(maxDistinctInHalf([1, 1, 2, 1, 3, 4]));  // 3
console.log(maxDistinctInHalf([1, 2, 3, 4]));        // 2
console.log(maxDistinctInHalf([1, 1, 1, 1]));        // 1
console.log(splitMaximisingDistinct([1, 1, 2, 1, 3, 4]));
console.log(maxDistinctAfterRemoval([1, 1, 1, 1, 2, 2, 3, 3])); // 3
console.log(countUniqueValues([1, 1, 2, 3]));        // 2

module.exports = { maxDistinctInHalf, splitMaximisingDistinct, maxDistinctAfterRemoval, countUniqueValues };
