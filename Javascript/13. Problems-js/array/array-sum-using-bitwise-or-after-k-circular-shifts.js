/**
 * Find the array sum using bitwise OR after splitting the array into two
 * halves following k circular shifts.
 *
 * For each of the k rotations: rotate left by one, split into two halves,
 * OR the corresponding elements, and sum the results.
 *
 * Time  O(k * n)
 * Space O(n)
 */

/** One step: rotate left by 1. */
const rotateLeftOne = (arr) => [...arr.slice(1), arr[0]];

/** OR the two halves elementwise and sum. */
function orHalvesSum(arr) {
  const half = arr.length / 2;
  let total = 0;

  for (let i = 0; i < half; i++) {
    total += arr[i] | arr[i + half];
  }

  return total;
}

/**
 * @param {number[]} arr even length
 * @param {number} k number of circular shifts
 * @returns {number[]} the sum after each shift, 1..k
 */
function sumsAfterShifts(arr, k) {
  const out = [];
  let current = [...arr];

  for (let step = 0; step < k; step++) {
    current = rotateLeftOne(current);
    out.push(orHalvesSum(current));
  }

  return out;
}

/**
 * Without materialising each rotation — index arithmetic only.
 * O(k * n) time, O(1) extra space.
 */
function sumsAfterShiftsInPlace(arr, k) {
  const n = arr.length;
  const half = n / 2;
  const out = [];

  for (let shift = 1; shift <= k; shift++) {
    let total = 0;
    for (let i = 0; i < half; i++) {
      total += arr[(i + shift) % n] | arr[(i + half + shift) % n];
    }
    out.push(total);
  }

  return out;
}

/** The single sum after exactly k shifts. */
const sumAfterKShifts = (arr, k) => sumsAfterShiftsInPlace(arr, k).pop();

// ---- Examples ----
const arr = [1, 4, 5, 6];

console.log(orHalvesSum(arr));            // (1|5) + (4|6) = 5 + 6 = 11
console.log(sumsAfterShifts(arr, 3));     // sums after 1, 2 and 3 shifts
console.log(sumsAfterShiftsInPlace(arr, 3)); // identical, no allocation
console.log(sumAfterKShifts(arr, 2));
console.log(rotateLeftOne([1, 2, 3]));    // [2, 3, 1]

module.exports = { sumsAfterShifts, sumsAfterShiftsInPlace, sumAfterKShifts, orHalvesSum, rotateLeftOne };
