/**
 * Get the last item of a JavaScript object.
 *
 * Objects DO have a key order: integer-like keys first in ascending order,
 * then string keys in insertion order, then symbols. "Last" therefore means
 * last in that order — which is why a Map is the better tool when order
 * matters.
 */

/** The last key. */
const lastKey = (obj) => Object.keys(obj).at(-1);

/** The last value. */
const lastValue = (obj) => Object.values(obj).at(-1);

/** The last [key, value] pair. */
const lastEntry = (obj) => Object.entries(obj).at(-1);

/** The first entry, for symmetry. */
const firstEntry = (obj) => Object.entries(obj).at(0);

/** Last n entries, as an object. */
const lastNEntries = (obj, n) => Object.fromEntries(Object.entries(obj).slice(-n));

/** A Map keeps true insertion order, including numeric keys. */
const lastMapEntry = (map) => [...map.entries()].at(-1);

/**
 * The ordering gotcha: integer-like keys are sorted numerically and come
 * FIRST, regardless of when they were inserted.
 */
const showKeyOrder = () => {
  const obj = { b: 1, 2: 2, a: 3, 1: 4 };
  return { keys: Object.keys(obj), last: lastKey(obj) };
};

/** Remove and return the last entry. */
function popLastEntry(obj) {
  const key = lastKey(obj);
  if (key === undefined) return undefined;

  const value = obj[key];
  delete obj[key];
  return [key, value];
}

// ---- Examples ----
const obj = { a: 1, b: 2, c: 3 };

console.log(lastKey(obj));         // 'c'
console.log(lastValue(obj));       // 3
console.log(lastEntry(obj));       // ['c', 3]
console.log(firstEntry(obj));      // ['a', 1]
console.log(lastNEntries(obj, 2)); // { b: 2, c: 3 }
console.log(showKeyOrder());       // keys: ['1','2','b','a'] — integers first
console.log(lastMapEntry(new Map([['x', 1], ['y', 2]]))); // ['y', 2]
console.log(popLastEntry({ ...obj })); // ['c', 3]

module.exports = { lastKey, lastValue, lastEntry, firstEntry, lastNEntries, lastMapEntry, popLastEntry, showKeyOrder };
