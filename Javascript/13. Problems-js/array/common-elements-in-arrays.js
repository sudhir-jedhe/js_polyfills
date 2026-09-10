/**
 * Find the common elements of two or more arrays (intersection).
 *
 * A Set makes it O(n + m). The variants below cover multiple arrays,
 * duplicate handling and objects.
 */

/** Unique values present in both arrays. */
function intersection(a, b) {
  const setB = new Set(b);
  return [...new Set(a.filter((item) => setB.has(item)))];
}

/**
 * Multiset intersection: keeps duplicates up to the smaller count.
 * [1,1,2] and [1,1,1] -> [1,1]
 */
function intersectionWithDuplicates(a, b) {
  const counts = new Map();
  for (const item of b) counts.set(item, (counts.get(item) || 0) + 1);

  const out = [];
  for (const item of a) {
    const left = counts.get(item) || 0;
    if (left > 0) {
      out.push(item);
      counts.set(item, left - 1);
    }
  }

  return out;
}

/** Common to ALL of several arrays. */
function intersectionMany(...arrays) {
  if (arrays.length === 0) return [];

  return arrays.reduce((acc, arr) => {
    const set = new Set(arr);
    return acc.filter((item) => set.has(item));
  }, [...new Set(arrays[0])]);
}

/** Intersection of objects by a key. */
function intersectionBy(a, b, keyFn) {
  const keys = new Set(b.map(keyFn));
  return a.filter((item) => keys.has(keyFn(item)));
}

/** In a but not in b. */
const difference = (a, b) => {
  const setB = new Set(b);
  return a.filter((item) => !setB.has(item));
};

/** In exactly one of the two. */
const symmetricDifference = (a, b) => [...difference(a, b), ...difference(b, a)];

/** All values from both, deduped. */
const union = (...arrays) => [...new Set(arrays.flat())];

// ---- Examples ----
console.log(intersection([1, 2, 3, 4], [3, 4, 5]));        // [3, 4]
console.log(intersectionWithDuplicates([1, 1, 2], [1, 1, 1])); // [1, 1]
console.log(intersectionMany([1, 2, 3], [2, 3, 4], [3, 2])); // [2, 3]
console.log(intersectionBy([{ id: 1 }, { id: 2 }], [{ id: 2 }], (o) => o.id)); // [{id:2}]
console.log(difference([1, 2, 3], [2]));                   // [1, 3]
console.log(symmetricDifference([1, 2], [2, 3]));          // [1, 3]
console.log(union([1, 2], [2, 3]));                        // [1, 2, 3]

module.exports = { intersection, intersectionWithDuplicates, intersectionMany, intersectionBy, difference, symmetricDifference, union };
