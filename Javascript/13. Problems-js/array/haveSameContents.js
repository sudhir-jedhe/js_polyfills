/**
 * Check whether two arrays have the same contents.
 *
 * Three different meanings, and they give different answers:
 *   - same elements in the same order
 *   - same elements as a SET (order and duplicates ignored)
 *   - same MULTISET (order ignored, duplicate counts must match)
 */

/** Same order, same values. */
const sameOrder = (a, b) => a.length === b.length && a.every((v, i) => Object.is(v, b[i]));

/** Same set of distinct values. */
function haveSameElements(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  return setA.size === setB.size && [...setA].every((v) => setB.has(v));
}

/**
 * Same multiset: [1,1,2] and [1,2,2] are NOT the same, even though the
 * distinct values match.
 */
function haveSameContents(a, b) {
  if (a.length !== b.length) return false;

  const counts = new Map();
  for (const item of a) counts.set(item, (counts.get(item) || 0) + 1);

  for (const item of b) {
    const left = counts.get(item);
    if (!left) return false;
    counts.set(item, left - 1);
  }

  return true;
}

/** Sort and compare — simpler, O(n log n), and needs comparable values. */
const haveSameContentsSorted = (a, b) => {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => Object.is(v, sb[i]));
};

/** Deep comparison for arrays of objects. */
function haveSameContentsDeep(a, b) {
  const key = (v) => JSON.stringify(v);
  return haveSameContents(a.map(key), b.map(key));
}

/** By a key function, for objects with an identity field. */
const haveSameContentsBy = (a, b, keyFn) =>
  haveSameContents(a.map(keyFn), b.map(keyFn));

// ---- Examples ----
console.log(sameOrder([1, 2, 3], [1, 2, 3]));           // true
console.log(sameOrder([1, 2, 3], [3, 2, 1]));           // false
console.log(haveSameElements([1, 2, 2], [2, 1]));       // true  (as sets)
console.log(haveSameContents([1, 2, 2], [2, 1]));       // false (lengths differ)
console.log(haveSameContents([1, 2, 2], [2, 2, 1]));    // true
console.log(haveSameContentsSorted(['b', 'a'], ['a', 'b'])); // true
console.log(haveSameContentsDeep([{ a: 1 }], [{ a: 1 }]));   // true
console.log(haveSameContentsBy([{ id: 1 }], [{ id: 1, x: 9 }], (o) => o.id)); // true

module.exports = { sameOrder, haveSameElements, haveSameContents, haveSameContentsSorted, haveSameContentsDeep, haveSameContentsBy };
