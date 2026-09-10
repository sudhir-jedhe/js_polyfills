/**
 * Ungroup (unzip) the elements of an array produced by zip.
 *
 * zip([1,2],[a,b]) -> [[1,a],[2,b]]
 * unzip([[1,a],[2,b]]) -> [[1,2],[a,b]]
 *
 * unzip is its own inverse: unzip(unzip(x)) === x.
 */

/**
 * Group the i-th element of each array together, padding short arrays
 * with undefined so nothing is silently dropped.
 */
function zip(...arrays) {
  const length = Math.max(0, ...arrays.map((a) => a.length));
  return Array.from({ length }, (_, i) => arrays.map((arr) => arr[i]));
}

/** The inverse: transpose the groups back into separate arrays. */
function unzip(groups) {
  if (groups.length === 0) return [];

  const width = Math.max(...groups.map((g) => g.length));
  return Array.from({ length: width }, (_, i) => groups.map((g) => g[i]));
}

/** Combine each group with a function instead of collecting it. */
const zipWith = (fn, ...arrays) => zip(...arrays).map((group) => fn(...group));

/** unzipWith: apply a function to each regrouped array. */
const unzipWith = (groups, fn) => unzip(groups).map((group) => fn(...group));

/** zip into an object: keys array + values array. */
const zipObject = (keys, values) =>
  Object.fromEntries(keys.map((key, i) => [key, values[i]]));

/** Split an array of pairs into two arrays — the common two-column case. */
const unzipPairs = (pairs) => [pairs.map((p) => p[0]), pairs.map((p) => p[1])];

// ---- Examples ----
console.log(zip([1, 2], ['a', 'b']));           // [[1,'a'], [2,'b']]
console.log(unzip([[1, 'a'], [2, 'b']]));       // [[1,2], ['a','b']]
console.log(unzip([[1, 10, 100], [2, 20, 200]]));// [[1,2],[10,20],[100,200]]
console.log(zipWith((a, b) => a + b, [1, 2], [10, 20])); // [11, 22]
console.log(unzipWith([[1, 10], [2, 20]], (a, b) => a + b)); // [3, 30]
console.log(zipObject(['a', 'b'], [1, 2]));     // { a: 1, b: 2 }
console.log(unzipPairs([[1, 'x'], [2, 'y']]));  // [[1,2], ['x','y']]

module.exports = { zip, unzip, zipWith, unzipWith, zipObject, unzipPairs };
