/**
 * Call the map method only if the element is an array.
 *
 * Given a mixed collection, map over the nested arrays and leave everything
 * else alone. Useful when an API returns `T | T[]` in the same field.
 */

/**
 * @param {*} value
 * @param {(item:*, index:number, arr:*[]) => *} fn
 * @returns {*} mapped array, or the original value untouched
 */
function mapIfArray(value, fn) {
  return Array.isArray(value) ? value.map(fn) : value;
}

/** Apply across a list, mapping only the array members. */
const mapNested = (list, fn) => list.map((item) => mapIfArray(item, fn));

/**
 * Recursive version: map every leaf at any nesting depth,
 * preserving the shape of the structure.
 */
function deepMap(value, fn) {
  return Array.isArray(value) ? value.map((item) => deepMap(item, fn)) : fn(value);
}

/** Always give me an array, whatever I was handed. */
const toArray = (value) => (Array.isArray(value) ? value : value == null ? [] : [value]);

// ---- Examples ----
const double = (n) => n * 2;

console.log(mapIfArray([1, 2, 3], double)); // [2, 4, 6]
console.log(mapIfArray(5, double));         // 5  <- untouched

console.log(mapNested([[1, 2], 3, [4]], double)); // [[2, 4], 3, [8]]
console.log(deepMap([1, [2, [3]]], double));      // [2, [4, [6]]]

console.log(toArray('one')); // ['one']
console.log(toArray(null));  // []

module.exports = { mapIfArray, mapNested, deepMap, toArray };
