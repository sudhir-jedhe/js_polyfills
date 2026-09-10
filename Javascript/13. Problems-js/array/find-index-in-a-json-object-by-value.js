/**
 * Find the index of an object in an array by one of its values.
 *
 * findIndex is the direct answer; the variants cover nested paths,
 * multiple matches and building an index for repeated lookups.
 */

/** Index of the first object whose `key` equals `value`, or -1. */
const findIndexByValue = (arr, key, value) => arr.findIndex((item) => item[key] === value);

/** Every matching index. */
const findAllIndexesByValue = (arr, key, value) =>
  arr.reduce((acc, item, i) => {
    if (item[key] === value) acc.push(i);
    return acc;
  }, []);

/** The object itself rather than its index. */
const findByValue = (arr, key, value) => arr.find((item) => item[key] === value);

/** Match on a nested path: findIndexByPath(users, 'address.city', 'Pune'). */
function findIndexByPath(arr, path, value) {
  const keys = String(path).replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean);

  const read = (obj) => keys.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

  return arr.findIndex((item) => read(item) === value);
}

/** Match on any of several keys. */
const findIndexByAnyKey = (arr, keys, value) =>
  arr.findIndex((item) => keys.some((key) => item[key] === value));

/**
 * Build a value -> index map once. O(n) to build, O(1) per lookup — worth
 * it as soon as you search the same array more than a couple of times.
 */
function indexByKey(arr, key) {
  const index = new Map();
  arr.forEach((item, i) => {
    if (!index.has(item[key])) index.set(item[key], i);
  });
  return index;
}

/** Deep match against a partial object. */
const findIndexByPartial = (arr, partial) =>
  arr.findIndex((item) => Object.entries(partial).every(([k, v]) => item[k] === v));

// ---- Examples ----
const users = [
  { id: 1, name: 'Ada', address: { city: 'Pune' } },
  { id: 2, name: 'Bob', address: { city: 'Delhi' } },
  { id: 3, name: 'Ada', address: { city: 'Pune' } },
];

console.log(findIndexByValue(users, 'name', 'Ada'));     // 0
console.log(findAllIndexesByValue(users, 'name', 'Ada'));// [0, 2]
console.log(findByValue(users, 'id', 2).name);           // 'Bob'
console.log(findIndexByPath(users, 'address.city', 'Delhi')); // 1
console.log(findIndexByAnyKey(users, ['id', 'name'], 'Bob')); // 1
console.log(indexByKey(users, 'id').get(3));             // 2
console.log(findIndexByPartial(users, { name: 'Ada', id: 3 })); // 2

module.exports = { findIndexByValue, findAllIndexesByValue, findByValue, findIndexByPath, findIndexByAnyKey, indexByKey, findIndexByPartial };
