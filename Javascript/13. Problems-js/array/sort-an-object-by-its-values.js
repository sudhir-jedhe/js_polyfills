/**
 * Sort an "associative array" (an object) by its values.
 *
 * Objects preserve insertion order for string keys, so rebuilding one from
 * sorted entries does produce a predictably ordered object — with the
 * caveat that integer-like keys always jump to the front, in numeric order.
 */

/** Sorted ascending by value. */
const sortByValue = (obj) =>
  Object.fromEntries(Object.entries(obj).sort((a, b) => compare(a[1], b[1])));

/** Sorted descending by value. */
const sortByValueDesc = (obj) =>
  Object.fromEntries(Object.entries(obj).sort((a, b) => compare(b[1], a[1])));

/** Sorted by key. */
const sortByKey = (obj) =>
  Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

/** A comparator that copes with mixed value types. */
function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/** Sort by a field inside each value. */
const sortByNestedValue = (obj, key) =>
  Object.fromEntries(Object.entries(obj).sort((a, b) => compare(a[1][key], b[1][key])));

/** With a custom comparator over [key, value] pairs. */
const sortEntries = (obj, comparator) =>
  Object.fromEntries(Object.entries(obj).sort(comparator));

/**
 * A Map keeps EVERY key in insertion order, including numeric ones — the
 * reason to prefer it when order genuinely matters.
 */
const sortMapByValue = (map) => new Map([...map.entries()].sort((a, b) => compare(a[1], b[1])));

/** The integer-key gotcha, demonstrated. */
const integerKeyOrdering = () => {
  const obj = sortByValue({ 10: 'a', 2: 'b', x: 'c' });
  return { keys: Object.keys(obj), note: 'integer-like keys sort numerically and come first' };
};

/** The top n entries by value. */
const topNByValue = (obj, n) =>
  Object.entries(obj)
    .sort((a, b) => compare(b[1], a[1]))
    .slice(0, n);

// ---- Examples ----
const scores = { alice: 82, bob: 95, carol: 71 };

console.log(sortByValue(scores));      // { carol: 71, alice: 82, bob: 95 }
console.log(sortByValueDesc(scores));  // { bob: 95, alice: 82, carol: 71 }
console.log(sortByKey(scores));        // alice, bob, carol
console.log(sortByNestedValue({ a: { n: 2 }, b: { n: 1 } }, 'n')); // b then a
console.log(sortMapByValue(new Map([['x', 3], ['y', 1]])));
console.log(integerKeyOrdering());
console.log(topNByValue(scores, 2));   // [['bob',95], ['alice',82]]

module.exports = { sortByValue, sortByValueDesc, sortByKey, sortByNestedValue, sortEntries, sortMapByValue, topNByValue, compare };
