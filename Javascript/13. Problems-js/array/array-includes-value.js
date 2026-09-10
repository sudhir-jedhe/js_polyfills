/**
 * Check whether an array includes a value.
 *
 * includes() uses SameValueZero, so it finds NaN — indexOf uses strict
 * equality and does not. For objects you need a predicate, since two
 * structurally identical objects are different references.
 */

/** The modern answer. */
const includes = (arr, value) => arr.includes(value);

/** indexOf — the pre-ES2016 form. Note the NaN difference. */
const includesIndexOf = (arr, value) => arr.indexOf(value) !== -1;

/** Objects: match by a key. */
const includesById = (arr, id, key = 'id') => arr.some((item) => item[key] === id);

/** Objects: deep structural match. */
function includesDeep(arr, value) {
  const serialised = JSON.stringify(value);
  return arr.some((item) => JSON.stringify(item) === serialised);
}

/** A Set is the right structure when you check membership repeatedly. */
function makeMembershipTest(arr) {
  const set = new Set(arr);
  return (value) => set.has(value);
}

/** Does the array contain ANY / ALL of these values? */
const includesAny = (arr, values) => values.some((v) => arr.includes(v));
const includesAll = (arr, values) => values.every((v) => arr.includes(v));

// ---- Examples ----
console.log(includes([1, 2, 3], 2));            // true
console.log(includes([NaN], NaN));              // true
console.log(includesIndexOf([NaN], NaN));       // false  <- the difference
console.log(includes([1, 2], '2'));             // false  (no coercion)

console.log(includesById([{ id: 1 }, { id: 2 }], 2));      // true
console.log(includesDeep([{ a: 1 }], { a: 1 }));           // true

const isKnown = makeMembershipTest(['a', 'b', 'c']);
console.log(isKnown('b'), isKnown('z'));        // true false
console.log(includesAny([1, 2, 3], [5, 3]));    // true
console.log(includesAll([1, 2, 3], [1, 4]));    // false

module.exports = { includes, includesIndexOf, includesById, includesDeep, makeMembershipTest, includesAny, includesAll };
