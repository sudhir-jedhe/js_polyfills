/**
 * Remove falsy values from an array.
 *
 * The six falsy values in JavaScript: false, 0, '', null, undefined, NaN
 * (and 0n for BigInt). filter(Boolean) removes all of them.
 */

/** The idiomatic one-liner. */
const compact = (arr) => arr.filter(Boolean);

/** Explicit predicate, if `filter(Boolean)` reads as too clever. */
const compactExplicit = (arr) => arr.filter((item) => !!item);

/** Remove only null and undefined, keeping 0, '' and false. */
const removeNullish = (arr) => arr.filter((item) => item != null);

/** Remove empty strings and whitespace-only strings too. */
const compactStrings = (arr) =>
  arr.filter((item) => (typeof item === 'string' ? item.trim() !== '' : Boolean(item)));

/** Deep version: also cleans nested arrays and object values. */
function compactDeep(value) {
  if (Array.isArray(value)) {
    return value.map(compactDeep).filter(Boolean);
  }

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const cleaned = compactDeep(v);
      if (cleaned) out[k] = cleaned;
    }
    return Object.keys(out).length ? out : null;
  }

  return value;
}

/** Drop falsy VALUES from an object. */
const compactObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => Boolean(v)));

// ---- Examples ----
console.log(compact([0, 1, false, 2, '', 3, null, undefined, NaN])); // [1, 2, 3]
console.log(compactExplicit(['a', '', 'b']));       // ['a', 'b']
console.log(removeNullish([0, null, '', undefined, false])); // [0, '', false]
console.log(compactStrings(['a', '   ', 'b', 0]));  // ['a', 'b']
console.log(compactObject({ a: 1, b: 0, c: 'x', d: null })); // { a: 1, c: 'x' }
console.log(compactDeep([1, [0, 2, [null, 3]], '']));// [1, [2, [3]]]

module.exports = { compact, compactExplicit, removeNullish, compactStrings, compactDeep, compactObject };
