/**
 * Intersection and the "not common" elements of two arrays.
 *
 * Intersection: in both.
 * Not common (symmetric difference): in exactly one.
 */

/** Values present in both arrays, deduped. */
function intersection(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((item) => setB.has(item));
}

/** Values in exactly one of the two arrays. */
function notCommon(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  return [
    ...[...setA].filter((item) => !setB.has(item)),
    ...[...setB].filter((item) => !setA.has(item)),
  ];
}

/** Both results in one pass over each array. */
function compare(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  const both = [];
  const onlyA = [];
  const onlyB = [];

  for (const item of setA) (setB.has(item) ? both : onlyA).push(item);
  for (const item of setB) if (!setA.has(item)) onlyB.push(item);

  return { both, onlyA, onlyB, notCommon: [...onlyA, ...onlyB] };
}

/** Across more than two arrays: values that appear in exactly one of them. */
function uniqueToOneArray(...arrays) {
  const counts = new Map();

  for (const arr of arrays) {
    for (const item of new Set(arr)) counts.set(item, (counts.get(item) || 0) + 1);
  }

  return [...counts.entries()].filter(([, n]) => n === 1).map(([item]) => item);
}

/** Object versions, keyed by a function. */
const intersectionBy = (a, b, keyFn) => {
  const keys = new Set(b.map(keyFn));
  return a.filter((item) => keys.has(keyFn(item)));
};

const notCommonBy = (a, b, keyFn) => {
  const keysA = new Set(a.map(keyFn));
  const keysB = new Set(b.map(keyFn));
  return [...a.filter((i) => !keysB.has(keyFn(i))), ...b.filter((i) => !keysA.has(keyFn(i)))];
};

// ---- Examples ----
console.log(intersection([1, 2, 3, 4], [3, 4, 5]));  // [3, 4]
console.log(notCommon([1, 2, 3, 4], [3, 4, 5]));     // [1, 2, 5]
console.log(compare([1, 2, 3], [2, 3, 4]));
// { both: [2,3], onlyA: [1], onlyB: [4], notCommon: [1,4] }
console.log(uniqueToOneArray([1, 2], [2, 3], [3, 4]));// [1, 4]
console.log(intersectionBy([{ id: 1 }, { id: 2 }], [{ id: 2 }], (o) => o.id)); // [{id:2}]

module.exports = { intersection, notCommon, compare, uniqueToOneArray, intersectionBy, notCommonBy };
