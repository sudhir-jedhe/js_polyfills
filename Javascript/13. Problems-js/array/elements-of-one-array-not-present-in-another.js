/**
 * Elements of one array that are not present in another.
 *
 * A Set turns the O(n * m) nested scan into O(n + m).
 */

/** In `a` but not in `b`. */
function difference(a, b) {
  const exclude = new Set(b);
  return a.filter((item) => !exclude.has(item));
}

/** Unique values in `a` but not in `b`. */
const uniqueDifference = (a, b) => [...new Set(difference(a, b))];

/** In exactly one of the two arrays. */
function symmetricDifference(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  return [...a.filter((item) => !setB.has(item)), ...b.filter((item) => !setA.has(item))];
}

/** Difference by a key, for objects. */
function differenceBy(a, b, keyFn) {
  const exclude = new Set(b.map(keyFn));
  return a.filter((item) => !exclude.has(keyFn(item)));
}

/** Difference by a comparator, when no single key identifies an item. */
const differenceWith = (a, b, isEqual) =>
  a.filter((itemA) => !b.some((itemB) => isEqual(itemA, itemB)));

/**
 * Multiset difference: removes only as many copies as `b` contains.
 * [1,1,1] minus [1] -> [1,1]
 */
function differenceWithCounts(a, b) {
  const counts = new Map();
  for (const item of b) counts.set(item, (counts.get(item) || 0) + 1);

  return a.filter((item) => {
    const left = counts.get(item) || 0;
    if (left > 0) {
      counts.set(item, left - 1);
      return false;
    }
    return true;
  });
}

// ---- Examples ----
console.log(difference([1, 2, 3, 4], [2, 4]));         // [1, 3]
console.log(uniqueDifference([1, 1, 2, 3], [3]));      // [1, 2]
console.log(symmetricDifference([1, 2, 3], [3, 4]));   // [1, 2, 4]
console.log(differenceBy([{ id: 1 }, { id: 2 }], [{ id: 2 }], (o) => o.id)); // [{id:1}]
console.log(differenceWith([{ x: 1 }], [{ x: 1 }], (a, b) => a.x === b.x));  // []
console.log(differenceWithCounts([1, 1, 1, 2], [1, 2]));// [1, 1]

module.exports = { difference, uniqueDifference, symmetricDifference, differenceBy, differenceWith, differenceWithCounts };
