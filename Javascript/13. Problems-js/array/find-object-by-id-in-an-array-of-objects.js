/**
 * Find an object by id in an array of objects.
 *
 * find() is the direct answer; a Map is the right answer as soon as you
 * look things up repeatedly.
 */

/** The object, or undefined. */
const findById = (arr, id, key = 'id') => arr.find((item) => item[key] === id);

/** Its index, or -1. */
const findIndexById = (arr, id, key = 'id') => arr.findIndex((item) => item[key] === id);

/** All objects with that id (when ids are not unique). */
const findAllById = (arr, id, key = 'id') => arr.filter((item) => item[key] === id);

/**
 * Build an id -> object index once. O(n) to build, O(1) per lookup — worth
 * it from the second lookup onward.
 */
const indexById = (arr, key = 'id') => new Map(arr.map((item) => [item[key], item]));

/** Find in a NESTED structure, following a children field. */
function findByIdDeep(items, id, { key = 'id', childrenKey = 'children' } = {}) {
  for (const item of items) {
    if (item[key] === id) return item;

    const children = item[childrenKey];
    if (Array.isArray(children)) {
      const found = findByIdDeep(children, id, { key, childrenKey });
      if (found) return found;
    }
  }

  return undefined;
}

/** Update an object by id, returning a NEW array. */
const updateById = (arr, id, changes, key = 'id') =>
  arr.map((item) => (item[key] === id ? { ...item, ...changes } : item));

/** Remove by id. */
const removeById = (arr, id, key = 'id') => arr.filter((item) => item[key] !== id);

/** Upsert: replace when present, append when not. */
function upsertById(arr, item, key = 'id') {
  const index = arr.findIndex((existing) => existing[key] === item[key]);
  if (index === -1) return [...arr, item];

  const out = [...arr];
  out[index] = { ...out[index], ...item };
  return out;
}

// ---- Examples ----
const users = [
  { id: 1, name: 'Ada', children: [{ id: 11, name: 'Nested' }] },
  { id: 2, name: 'Bob' },
];

console.log(findById(users, 2));            // { id: 2, name: 'Bob' }
console.log(findIndexById(users, 2));       // 1
console.log(findById(users, 99));           // undefined
console.log(indexById(users).get(1).name);  // 'Ada'
console.log(findByIdDeep(users, 11));       // { id: 11, name: 'Nested' }
console.log(updateById(users, 2, { name: 'Bobby' })[1]);
console.log(removeById(users, 1).length);   // 1
console.log(upsertById(users, { id: 3, name: 'Cid' }).length); // 3

module.exports = { findById, findIndexById, findAllById, indexById, findByIdDeep, updateById, removeById, upsertById };
