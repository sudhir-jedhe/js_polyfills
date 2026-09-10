/**
 * Sum all the elements of an array.
 *
 * reduce is the idiom. The interesting parts are the empty-array case, the
 * floating point drift, and summing nested or object values.
 */

/** The idiom. The initial value matters: without it, [] throws. */
const sum = (arr) => arr.reduce((total, n) => total + n, 0);

/** Loop version — marginally faster on very large arrays. */
function sumLoop(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total;
}

/** Sum a field across an array of objects. */
const sumBy = (arr, keyOrFn) => {
  const value = typeof keyOrFn === 'function' ? keyOrFn : (item) => item[keyOrFn];
  return arr.reduce((total, item) => total + Number(value(item) || 0), 0);
};

/** Sum a deeply nested array. */
function sumDeep(value) {
  if (Array.isArray(value)) return value.reduce((total, v) => total + sumDeep(v), 0);
  return Number(value) || 0;
}

/**
 * Kahan summation — compensates for floating point drift, so summing many
 * small values stays accurate.
 */
function sumKahan(arr) {
  let total = 0;
  let compensation = 0;

  for (const n of arr) {
    const y = n - compensation;
    const t = total + y;
    compensation = t - total - y; // the bit that was lost
    total = t;
  }

  return total;
}

/** Exact sum with BigInt, for integers beyond Number.MAX_SAFE_INTEGER. */
const sumBigInt = (arr) => arr.reduce((total, n) => total + BigInt(n), 0n);

/** Running (cumulative) sum. */
const runningSum = (arr) => {
  let total = 0;
  return arr.map((n) => (total += n));
};

/** Sum only the values satisfying a predicate. */
const sumWhere = (arr, predicate) =>
  arr.reduce((total, n, i) => (predicate(n, i) ? total + n : total), 0);

/** Sum of 1..n in O(1) — the Gauss formula. */
const sumToN = (n) => (n * (n + 1)) / 2;

// ---- Examples ----
console.log(sum([1, 2, 3, 4]));           // 10
console.log(sum([]));                     // 0
console.log(sumLoop([1.5, 2.5]));         // 4
console.log(sumBy([{ n: 1 }, { n: 2 }], 'n')); // 3
console.log(sumDeep([1, [2, [3, [4]]]])); // 10
console.log([0.1, 0.2, 0.3].reduce((a, b) => a + b, 0)); // 0.6000000000000001
console.log(sumKahan([0.1, 0.2, 0.3]));   // 0.6
console.log(sumBigInt([Number.MAX_SAFE_INTEGER, 1]).toString());
console.log(runningSum([1, 2, 3]));       // [1, 3, 6]
console.log(sumWhere([1, 2, 3, 4], (n) => n % 2 === 0)); // 6
console.log(sumToN(100));                 // 5050

module.exports = { sum, sumLoop, sumBy, sumDeep, sumKahan, sumBigInt, runningSum, sumWhere, sumToN };
