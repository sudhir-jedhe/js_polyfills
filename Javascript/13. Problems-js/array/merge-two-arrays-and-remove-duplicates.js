/**
 * Merge two arrays and remove duplicate items.
 *
 * A Set is the shortest correct answer and preserves first-appearance
 * order. The variants cover objects, key functions and deep values.
 */

/** Merge and dedupe — the union. */
const mergeUnique = (a, b) => [...new Set([...a, ...b])];

/** Any number of arrays. */
const mergeAllUnique = (...arrays) => [...new Set(arrays.flat())];

/** Dedupe by a key, for objects. Later entries win. */
function mergeUniqueBy(a, b, keyFn) {
  const byKey = new Map();
  for (const item of [...a, ...b]) byKey.set(keyFn(item), item);
  return [...byKey.values()];
}

/** Dedupe by a key, but EARLIER entries win. */
function mergeUniqueByFirst(a, b, keyFn) {
  const byKey = new Map();
  for (const item of [...a, ...b]) {
    const key = keyFn(item);
    if (!byKey.has(key)) byKey.set(key, item);
  }
  return [...byKey.values()];
}

/** Merge objects by key, combining their fields rather than replacing. */
function mergeDeepBy(a, b, keyFn) {
  const byKey = new Map();

  for (const item of [...a, ...b]) {
    const key = keyFn(item);
    byKey.set(key, byKey.has(key) ? { ...byKey.get(key), ...item } : item);
  }

  return [...byKey.values()];
}

/** Deep dedupe by structural equality (small arrays only — JSON is slow). */
const mergeUniqueDeep = (a, b) => {
  const seen = new Map();
  for (const item of [...a, ...b]) {
    const key = JSON.stringify(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
};

/** Merge two SORTED arrays and dedupe in one O(m + n) pass. */
function mergeSortedUnique(a, b) {
  const out = [];
  let i = 0;
  let j = 0;

  const push = (value) => {
    if (out[out.length - 1] !== value) out.push(value);
  };

  while (i < a.length && j < b.length) push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) push(a[i++]);
  while (j < b.length) push(b[j++]);

  return out;
}

// ---- Examples ----
console.log(mergeUnique([1, 2, 3], [3, 4, 5]));      // [1,2,3,4,5]
console.log(mergeAllUnique([1], [1, 2], [2, 3]));    // [1,2,3]
console.log(mergeUniqueBy([{ id: 1, v: 'a' }], [{ id: 1, v: 'b' }], (o) => o.id));
// [{ id: 1, v: 'b' }] — later wins
console.log(mergeUniqueByFirst([{ id: 1, v: 'a' }], [{ id: 1, v: 'b' }], (o) => o.id));
// [{ id: 1, v: 'a' }]
console.log(mergeDeepBy([{ id: 1, a: 1 }], [{ id: 1, b: 2 }], (o) => o.id));
// [{ id: 1, a: 1, b: 2 }]
console.log(mergeUniqueDeep([{ x: 1 }], [{ x: 1 }, { x: 2 }])); // 2 items
console.log(mergeSortedUnique([1, 2, 3], [2, 3, 4]));           // [1,2,3,4]

module.exports = { mergeUnique, mergeAllUnique, mergeUniqueBy, mergeUniqueByFirst, mergeDeepBy, mergeUniqueDeep, mergeSortedUnique };
