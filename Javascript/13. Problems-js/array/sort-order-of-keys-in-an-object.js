/**
 * Control the order of keys in a JavaScript object.
 *
 * The spec's rule: integer-like keys come first in ascending numeric order,
 * then string keys in insertion order, then symbols. So you can control the
 * order of string keys but never of integer-like ones.
 */

/** Keys sorted alphabetically. */
const sortKeys = (obj) =>
  Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

/** Keys sorted alphabetically, at every nesting level. */
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeysDeep(v)])
    );
  }

  return value;
}

/** Keys in an explicit order; anything not listed goes to the end. */
function orderKeys(obj, order) {
  const rank = new Map(order.map((key, i) => [key, i]));

  return Object.fromEntries(
    Object.entries(obj).sort(
      ([a], [b]) => (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity)
    )
  );
}

/** Keys sorted by their VALUES. */
const sortKeysByValue = (obj) =>
  Object.fromEntries(Object.entries(obj).sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0)));

/** The integer-key rule, demonstrated. */
const showKeyOrderRule = () => {
  const obj = { b: 1, 2: 2, a: 3, 1: 4, [Symbol('s')]: 5 };
  return {
    stringKeys: Object.keys(obj),      // ['1', '2', 'b', 'a']
    allKeys: Reflect.ownKeys(obj).map(String),
    note: 'integer-like keys are sorted numerically and always come first',
  };
};

/** A Map preserves true insertion order for EVERY key type. */
const orderedMap = (entries) => new Map(entries);

/** Sorted JSON, so two structurally identical objects stringify identically. */
const stableStringify = (value) => JSON.stringify(sortKeysDeep(value));

// ---- Examples ----
const config = { zebra: 1, apple: 2, mango: 3 };

console.log(sortKeys(config));                    // apple, mango, zebra
console.log(orderKeys(config, ['mango', 'zebra']));// mango, zebra, apple
console.log(sortKeysByValue(config));             // zebra, apple, mango
console.log(sortKeysDeep({ b: { d: 1, c: 2 }, a: 3 }));
console.log(showKeyOrderRule());
console.log(stableStringify({ b: 1, a: { d: 2, c: 3 } }));
// {"a":{"c":3,"d":2},"b":1}

module.exports = { sortKeys, sortKeysDeep, orderKeys, sortKeysByValue, orderedMap, stableStringify, showKeyOrderRule };
