/**
 * Find the minimum and maximum of an array.
 *
 * Math.min(...arr) is fine for small arrays but blows the call stack past
 * roughly 100k elements — reduce or a plain loop is the safe general answer.
 */

/** Spread — concise, but limited by the argument-count limit. */
const minMaxSpread = (arr) => ({ min: Math.min(...arr), max: Math.max(...arr) });

/** Single pass, safe for any size. */
function minMax(arr) {
  if (arr.length === 0) return { min: undefined, max: undefined };

  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    else if (arr[i] > max) max = arr[i];
  }

  return { min, max };
}

/** reduce version of the same. */
const minMaxReduce = (arr) =>
  arr.reduce(
    (acc, n) => ({ min: Math.min(acc.min, n), max: Math.max(acc.max, n) }),
    { min: Infinity, max: -Infinity }
  );

/** Min/max by a derived value: minMaxBy(people, p => p.age). */
function minMaxBy(arr, valueFn) {
  if (arr.length === 0) return { min: undefined, max: undefined };

  let min = arr[0];
  let max = arr[0];

  for (const item of arr) {
    if (valueFn(item) < valueFn(min)) min = item;
    if (valueFn(item) > valueFn(max)) max = item;
  }

  return { min, max };
}

/** Chunked spread — keeps Math.min fast without the stack limit. */
function minLargeArray(arr, chunkSize = 50000) {
  let min = Infinity;
  for (let i = 0; i < arr.length; i += chunkSize) {
    min = Math.min(min, ...arr.slice(i, i + chunkSize));
  }
  return min;
}

/** Second largest, a common follow-up. */
function secondLargest(arr) {
  let first = -Infinity;
  let second = -Infinity;

  for (const n of arr) {
    if (n > first) {
      second = first;
      first = n;
    } else if (n > second && n < first) {
      second = n;
    }
  }

  return second === -Infinity ? null : second;
}

// ---- Examples ----
console.log(minMax([5, 1, 9, 3]));          // { min: 1, max: 9 }
console.log(minMaxSpread([5, 1, 9, 3]));    // { min: 1, max: 9 }
console.log(minMaxReduce([-2, 7]));         // { min: -2, max: 7 }
console.log(minMax([]));                    // { min: undefined, max: undefined }

const people = [{ age: 30 }, { age: 12 }, { age: 55 }];
console.log(minMaxBy(people, (p) => p.age)); // { min: {age:12}, max: {age:55} }
console.log(minLargeArray([3, 1, 2]));       // 1
console.log(secondLargest([5, 1, 9, 9, 3])); // 5

module.exports = { minMax, minMaxSpread, minMaxReduce, minMaxBy, minLargeArray, secondLargest };
