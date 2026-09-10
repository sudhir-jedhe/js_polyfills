/**
 * Sort an array of objects by two (or more) fields.
 *
 * The `||` chain is the idiom: fall through to the next comparator only
 * when the previous one ties.
 */

/** Two fields, both ascending. */
const sortByTwo = (arr, first, second) =>
  [...arr].sort((a, b) => compare(a[first], b[first]) || compare(a[second], b[second]));

/** A comparator that handles numbers, strings, dates and nullish values. */
function compare(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;  // nullish sorts last
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a - b;

  return String(a).localeCompare(String(b));
}

/**
 * Any number of fields, each with its own direction.
 * sortByFields(users, [['dept', 'asc'], ['age', 'desc']])
 */
function sortByFields(arr, fields) {
  return [...arr].sort((a, b) => {
    for (const [key, direction = 'asc'] of fields) {
      const result = compare(a[key], b[key]) * (direction === 'desc' ? -1 : 1);
      if (result !== 0) return result;
    }
    return 0;
  });
}

/** Build a reusable comparator from a list of key functions. */
const comparatorBy = (...keyFns) => (a, b) => {
  for (const keyFn of keyFns) {
    const result = compare(keyFn(a), keyFn(b));
    if (result !== 0) return result;
  }
  return 0;
};

/** Descending shortcut. */
const desc = (comparator) => (a, b) => -comparator(a, b);

/**
 * Sort by a fixed priority order, e.g. status: open, pending, closed.
 * Anything not in the list sorts last.
 */
function sortByPriority(arr, key, order) {
  const rank = new Map(order.map((value, i) => [value, i]));
  return [...arr].sort(
    (a, b) => (rank.get(a[key]) ?? Infinity) - (rank.get(b[key]) ?? Infinity)
  );
}

/**
 * Array.prototype.sort is stable in every modern engine, so sorting by the
 * secondary key first and the primary key second gives the same result.
 */
const sortStableTwoPass = (arr, first, second) =>
  [...arr].sort((a, b) => compare(a[second], b[second])).sort((a, b) => compare(a[first], b[first]));

// ---- Examples ----
const people = [
  { name: 'Cid', dept: 'eng', age: 30 },
  { name: 'Ada', dept: 'eng', age: 25 },
  { name: 'Bob', dept: 'art', age: 30 },
];

console.log(sortByTwo(people, 'dept', 'age').map((p) => p.name)); // ['Bob','Ada','Cid']
console.log(sortByFields(people, [['dept', 'asc'], ['age', 'desc']]).map((p) => p.name));
console.log([...people].sort(comparatorBy((p) => p.dept, (p) => p.name)).map((p) => p.name));
console.log(sortByPriority(
  [{ s: 'closed' }, { s: 'open' }, { s: 'pending' }],
  's',
  ['open', 'pending', 'closed']
).map((o) => o.s));
console.log(sortStableTwoPass(people, 'dept', 'age').map((p) => p.name));

module.exports = { sortByTwo, sortByFields, comparatorBy, compare, desc, sortByPriority, sortStableTwoPass };
