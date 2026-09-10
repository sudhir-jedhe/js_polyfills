/**
 * Determine whether the first object contains equivalent property values
 * to the second object.
 *
 * `matches(source, target)` is a partial deep match: every key in `target`
 * must be present in `source` with a deeply equal value. Extra keys on
 * `source` are ignored — this is lodash's `isMatch`.
 */

/** Strict deep equality, cycle-aware. */
function deepEqual(a, b, seen = new WeakMap()) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key], seen)
  );
}

/**
 * Partial match: does `source` contain everything in `target`?
 * @param {object} source
 * @param {object} target
 * @returns {boolean}
 */
function matches(source, target) {
  if (target === null || typeof target !== 'object') return Object.is(source, target);
  if (source === null || typeof source !== 'object') return false;

  return Object.keys(target).every((key) => {
    const t = target[key];
    const s = source[key];

    if (t !== null && typeof t === 'object' && !(t instanceof Date)) {
      return matches(s, t); // recurse for nested partial matching
    }

    return deepEqual(s, t);
  });
}

/** List the keys where the two objects disagree. */
function diffKeys(a, b) {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  return [...keys].filter((k) => !deepEqual(a?.[k], b?.[k]));
}

// ---- Examples ----
const source = { a: 1, b: { c: 2, d: 3 }, tags: ['x', 'y'] };

console.log(matches(source, { a: 1 }));            // true
console.log(matches(source, { b: { c: 2 } }));     // true  (partial)
console.log(matches(source, { b: { c: 9 } }));     // false
console.log(matches(source, { tags: ['x', 'y'] }));// true

console.log(deepEqual({ a: [1, 2] }, { a: [1, 2] })); // true
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 }));     // false
console.log(diffKeys({ a: 1, b: 2 }, { a: 1, b: 3 })); // ['b']

module.exports = { matches, deepEqual, diffKeys };
