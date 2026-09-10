/**
 * Remove specific values from an array.
 *
 * The lodash trio: `without` (non-mutating), `pull` (mutating) and
 * `remove` (mutating, by predicate).
 */

/** Non-mutating removal of the listed values. */
function without(arr, ...values) {
  const drop = new Set(values);
  return arr.filter((item) => !drop.has(item));
}

/** MUTATING removal of the listed values, in place. */
function pull(arr, ...values) {
  const drop = new Set(values);
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    if (!drop.has(arr[read])) arr[write++] = arr[read];
  }

  arr.length = write;
  return arr;
}

/** MUTATING removal by predicate; returns the removed elements. */
function remove(arr, predicate) {
  const removed = [];
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    if (predicate(arr[read], read, arr)) removed.push(arr[read]);
    else arr[write++] = arr[read];
  }

  arr.length = write;
  return removed;
}

/** Remove values from the LEFT until a value not in the list is found. */
function removeFromLeft(arr, values) {
  const drop = new Set(values);
  let start = 0;

  while (start < arr.length && drop.has(arr[start])) start++;
  return arr.slice(start);
}

/** Remove a fixed number of elements from the left. */
const removeNFromLeft = (arr, n) => arr.slice(Math.max(0, n));

/** Remove values by a key function, for objects. */
function withoutBy(arr, values, keyFn) {
  const drop = new Set(values.map(keyFn));
  return arr.filter((item) => !drop.has(keyFn(item)));
}

/** Remove values at the listed INDEXES. */
function withoutIndexes(arr, indexes) {
  const drop = new Set(indexes.map((i) => (i < 0 ? arr.length + i : i)));
  return arr.filter((_, i) => !drop.has(i));
}

// ---- Examples ----
console.log(without([1, 2, 3, 4, 2], 2, 4));    // [1, 3]

const arr = [1, 2, 3, 4, 5];
console.log(pull(arr, 2, 4), arr);              // [1,3,5] [1,3,5]

const nums = [1, 2, 3, 4, 5, 6];
console.log(remove(nums, (n) => n % 2 === 0), nums); // [2,4,6] [1,3,5]

console.log(removeFromLeft([0, 0, 1, 0, 2], [0])); // [1, 0, 2]
console.log(removeNFromLeft([1, 2, 3, 4], 2));     // [3, 4]
console.log(withoutBy([{ id: 1 }, { id: 2 }], [{ id: 2 }], (o) => o.id)); // [{id:1}]
console.log(withoutIndexes(['a', 'b', 'c', 'd'], [1, -1]));               // ['a','c']

module.exports = { without, pull, remove, removeFromLeft, removeNFromLeft, withoutBy, withoutIndexes };
