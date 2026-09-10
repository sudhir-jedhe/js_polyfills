/**
 * Count grouped elements.
 *
 * Group by a key function and return the SIZE of each group rather than the
 * items — lodash's countBy.
 */

/**
 * @template T
 * @param {T[]} arr
 * @param {string | ((item:T) => string)} key property name or key function
 * @returns {Record<string, number>}
 */
function countBy(arr, key) {
  const keyOf = typeof key === 'function' ? key : (item) => item[key];

  return arr.reduce((acc, item) => {
    const group = keyOf(item);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
}

/** Map version — keeps non-string keys intact. */
function countByMap(arr, keyFn) {
  const counts = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

/** The groups themselves, not just the counts. */
function groupBy(arr, key) {
  const keyOf = typeof key === 'function' ? key : (item) => item[key];

  return arr.reduce((acc, item) => {
    (acc[keyOf(item)] ||= []).push(item);
    return acc;
  }, {});
}

/** Counts sorted by frequency, highest first. */
const countsSorted = (arr, key) =>
  Object.entries(countBy(arr, key)).sort((a, b) => b[1] - a[1]);

/** Sum a numeric field per group, rather than counting rows. */
function sumBy(arr, key, valueKey) {
  const keyOf = typeof key === 'function' ? key : (item) => item[key];

  return arr.reduce((acc, item) => {
    const group = keyOf(item);
    acc[group] = (acc[group] || 0) + Number(item[valueKey] || 0);
    return acc;
  }, {});
}

// ---- Examples ----
const orders = [
  { region: 'east', total: 100 },
  { region: 'west', total: 50 },
  { region: 'east', total: 75 },
];

console.log(countBy(orders, 'region'));            // { east: 2, west: 1 }
console.log(countBy([6.1, 4.2, 6.3], Math.floor)); // { '4': 1, '6': 2 }
console.log(countBy(['one', 'two', 'three'], (w) => w.length)); // { '3': 2, '5': 1 }
console.log(groupBy(orders, 'region').east.length);// 2
console.log(countsSorted(orders, 'region'));       // [['east',2], ['west',1]]
console.log(sumBy(orders, 'region', 'total'));     // { east: 175, west: 50 }

module.exports = { countBy, countByMap, groupBy, countsSorted, sumBy };
