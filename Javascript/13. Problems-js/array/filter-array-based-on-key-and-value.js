/**
 * Filter an array of objects based on a key and value.
 *
 * From the simple "one key equals one value" case up to a small
 * multi-criteria filter of the kind a table UI needs.
 */

/** Exact match on one key. */
const filterByKeyValue = (arr, key, value) => arr.filter((item) => item[key] === value);

/** Match any of several values for one key. */
const filterByKeyIn = (arr, key, values) => {
  const set = new Set(values);
  return arr.filter((item) => set.has(item[key]));
};

/** Case-insensitive substring match — what a search box usually wants. */
const filterByKeyContains = (arr, key, term) =>
  arr.filter((item) => String(item[key] ?? '').toLowerCase().includes(String(term).toLowerCase()));

/**
 * Match every key/value pair in `criteria`. An array value means
 * "any of these"; a function means "run this predicate".
 */
function filterByCriteria(arr, criteria) {
  const entries = Object.entries(criteria);

  return arr.filter((item) =>
    entries.every(([key, expected]) => {
      if (typeof expected === 'function') return expected(item[key], item);
      if (Array.isArray(expected)) return expected.includes(item[key]);
      return item[key] === expected;
    })
  );
}

/** Search a term across several keys at once. */
const searchAcrossKeys = (arr, keys, term) => {
  const needle = String(term).toLowerCase();
  return arr.filter((item) =>
    keys.some((key) => String(item[key] ?? '').toLowerCase().includes(needle))
  );
};

// ---- Examples ----
const users = [
  { id: 1, name: 'Ada', role: 'admin', age: 36 },
  { id: 2, name: 'Bob', role: 'user', age: 24 },
  { id: 3, name: 'Cid', role: 'admin', age: 41 },
];

console.log(filterByKeyValue(users, 'role', 'admin').map((u) => u.name)); // ['Ada','Cid']
console.log(filterByKeyIn(users, 'id', [1, 3]).map((u) => u.name));      // ['Ada','Cid']
console.log(filterByKeyContains(users, 'name', 'a').map((u) => u.name)); // ['Ada']

console.log(filterByCriteria(users, { role: 'admin', age: (n) => n > 40 }).map((u) => u.name));
// ['Cid']

console.log(searchAcrossKeys(users, ['name', 'role'], 'ad').map((u) => u.name)); // ['Ada','Cid']

module.exports = { filterByKeyValue, filterByKeyIn, filterByKeyContains, filterByCriteria, searchAcrossKeys };
