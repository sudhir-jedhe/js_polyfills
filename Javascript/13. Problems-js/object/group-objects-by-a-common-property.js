/**
 * Group objects in an array by a common property.
 *
 * Two shapes are useful: a dictionary keyed by the property value
 * (lodash's groupBy) and a plain array of arrays.
 */

/**
 * @template T
 * @param {T[]} items
 * @param {string | ((item:T) => string)} key property name or key function
 * @returns {Record<string, T[]>}
 */
function groupBy(items, key) {
  const keyOf = typeof key === 'function' ? key : (item) => item[key];

  return items.reduce((acc, item) => {
    const group = keyOf(item);
    (acc[group] ||= []).push(item);
    return acc;
  }, {});
}

/** Array of arrays instead of a dictionary. */
const groupToArrays = (items, key) => Object.values(groupBy(items, key));

/** Preserves non-string keys (objects, numbers, null) by using a Map. */
function groupByMap(items, key) {
  const keyOf = typeof key === 'function' ? key : (item) => item[key];
  const map = new Map();

  for (const item of items) {
    const group = keyOf(item);
    if (!map.has(group)) map.set(group, []);
    map.get(group).push(item);
  }

  return map;
}

/** Count per group rather than collecting the items. */
const countBy = (items, key) =>
  Object.fromEntries(Object.entries(groupBy(items, key)).map(([k, v]) => [k, v.length]));

// ---- Examples ----
const people = [
  { name: 'Ann', dept: 'eng' },
  { name: 'Bob', dept: 'sales' },
  { name: 'Cid', dept: 'eng' },
];

console.log(groupBy(people, 'dept'));
// { eng: [Ann, Cid], sales: [Bob] }

console.log(groupToArrays(people, 'dept').map((g) => g.map((p) => p.name)));
// [['Ann','Cid'], ['Bob']]

console.log(groupBy([6.1, 4.2, 6.3], Math.floor)); // { '4': [4.2], '6': [6.1, 6.3] }
console.log(countBy(people, 'dept'));              // { eng: 2, sales: 1 }

// Object.groupBy is the modern built-in (Node 21+ / ES2024).

module.exports = { groupBy, groupToArrays, groupByMap, countBy };
