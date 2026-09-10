/**
 * Create an array of unique values from multiple arrays using Set.
 *
 * Union, intersection, difference and symmetric difference — the four set
 * operations, each written with Set.
 */

/** Every distinct value across all the arrays. */
const union = (...arrays) => [...new Set(arrays.flat())];

/** Values present in EVERY array. */
function intersection(...arrays) {
  if (arrays.length === 0) return [];

  const [first, ...rest] = arrays;
  const sets = rest.map((arr) => new Set(arr));

  return [...new Set(first)].filter((item) => sets.every((set) => set.has(item)));
}

/** In the first array but in none of the others. */
function difference(first, ...others) {
  const exclude = new Set(others.flat());
  return [...new Set(first)].filter((item) => !exclude.has(item));
}

/** In exactly one of the two arrays. */
function symmetricDifference(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  return [
    ...[...setA].filter((item) => !setB.has(item)),
    ...[...setB].filter((item) => !setA.has(item)),
  ];
}

/** Values appearing in MORE than one array. */
function sharedValues(...arrays) {
  const counts = new Map();

  for (const arr of arrays) {
    for (const item of new Set(arr)) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
  }

  return [...counts.entries()].filter(([, n]) => n > 1).map(([item]) => item);
}

/** Set operations on objects, keyed by a function. */
function unionBy(arrays, keyFn) {
  const seen = new Set();
  const out = [];

  for (const item of arrays.flat()) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

// ---- Examples ----
console.log(union([1, 2], [2, 3], [3, 4]));            // [1, 2, 3, 4]
console.log(intersection([1, 2, 3], [2, 3, 4], [3, 2]));// [2, 3]
console.log(difference([1, 2, 3, 4], [2], [4]));       // [1, 3]
console.log(symmetricDifference([1, 2, 3], [3, 4]));   // [1, 2, 4]
console.log(sharedValues([1, 2], [2, 3], [3, 4]));     // [2, 3]
console.log(unionBy([[{ id: 1 }], [{ id: 1 }, { id: 2 }]], (o) => o.id)); // 2 items

module.exports = { union, intersection, difference, symmetricDifference, sharedValues, unionBy };
