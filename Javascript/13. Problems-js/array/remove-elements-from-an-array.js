/**
 * Remove elements from a JavaScript array.
 *
 * splice mutates and returns what it removed; filter and slice return new
 * arrays. Picking the wrong one is the classic source of "why did my other
 * reference change?".
 */

/** Remove one element at an index — MUTATES. */
function removeAt(arr, index) {
  const [removed] = arr.splice(index, 1);
  return removed;
}

/** Remove n elements starting at an index — MUTATES. */
const removeRange = (arr, index, count) => arr.splice(index, count);

/** Remove an index without mutating. */
const withoutIndex = (arr, index) => [...arr.slice(0, index), ...arr.slice(index + 1)];

/** Remove by VALUE (first occurrence) — MUTATES. */
function removeValue(arr, value) {
  const index = arr.indexOf(value);
  if (index !== -1) arr.splice(index, 1);
  return arr;
}

/** Remove ALL occurrences of a value, non-mutating. */
const withoutValue = (arr, value) => arr.filter((item) => !Object.is(item, value));

/** Remove several values at once. */
function withoutValues(arr, values) {
  const drop = new Set(values);
  return arr.filter((item) => !drop.has(item));
}

/** Remove by predicate. */
const removeWhere = (arr, predicate) => arr.filter((item, i) => !predicate(item, i, arr));

/**
 * Remove in place by predicate — the two-pointer compaction, O(1) space
 * (LeetCode 27's pattern).
 */
function removeWhereInPlace(arr, predicate) {
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    if (!predicate(arr[read], read, arr)) arr[write++] = arr[read];
  }

  arr.length = write;
  return arr;
}

/** Empty an array while KEEPING every reference to it valid. */
const clearInPlace = (arr) => {
  arr.length = 0;
  return arr;
};

/** Remove the first n and the last m. */
const trim = (arr, first = 1, last = first) => arr.slice(first, arr.length - last);

// ---- Examples ----
console.log(withoutIndex([1, 2, 3, 4], 1));      // [1, 3, 4]
console.log(withoutValue([1, 2, 2, 3], 2));      // [1, 3]
console.log(withoutValues([1, 2, 3, 4], [2, 4]));// [1, 3]
console.log(removeWhere([1, 2, 3, 4], (n) => n % 2 === 0)); // [1, 3]

const arr = [1, 2, 3, 4, 5];
console.log(removeAt(arr, 0), arr);              // 1 [2,3,4,5]
console.log(removeWhereInPlace([1, 2, 3, 4], (n) => n > 2)); // [1, 2]
console.log(trim([1, 2, 3, 4, 5], 1));           // [2, 3, 4]

module.exports = { removeAt, removeRange, withoutIndex, removeValue, withoutValue, withoutValues, removeWhere, removeWhereInPlace, clearInPlace, trim };
