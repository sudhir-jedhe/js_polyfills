/**
 * Get a key in a JavaScript object by its value.
 *
 * Reverse lookup. Values are not unique in general, so both a "first match"
 * and an "all matches" version are useful.
 */

/**
 * @param {object} obj
 * @param {*} value
 * @returns {string | undefined} the first key whose value matches
 */
function keyByValue(obj, value) {
  return Object.keys(obj).find((key) => Object.is(obj[key], value));
}

/** Every key holding this value. */
const keysByValue = (obj, value) =>
  Object.keys(obj).filter((key) => Object.is(obj[key], value));

/** entries()/find() variant — returns the [key, value] pair. */
function entryByValue(obj, value) {
  return Object.entries(obj).find(([, v]) => Object.is(v, value));
}

/** Build a value -> key map once, for repeated lookups. O(1) per lookup. */
function invert(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}

/** Inversion that keeps every key per value. */
function invertBy(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    (out[v] ||= []).push(k);
  }
  return out;
}

// ---- Examples ----
const roles = { alice: 'admin', bob: 'user', carol: 'admin' };

console.log(keyByValue(roles, 'admin'));   // 'alice'
console.log(keysByValue(roles, 'admin'));  // ['alice', 'carol']
console.log(entryByValue(roles, 'user'));  // ['bob', 'user']
console.log(keyByValue(roles, 'ghost'));   // undefined

console.log(invert({ a: 1, b: 2 }));       // { '1': 'a', '2': 'b' }
console.log(invertBy(roles));              // { admin: ['alice','carol'], user: ['bob'] }

module.exports = { keyByValue, keysByValue, entryByValue, invert, invertBy };
