/**
 * undefinedToNull()
 *
 * Deeply replace every `undefined` value inside an object/array with `null`,
 * leaving everything else untouched. Returns a new structure; the input is
 * not mutated.
 */

/**
 * @param {*} value
 * @returns {*}
 */
function undefinedToNull(value) {
  if (value === undefined) return null;

  if (Array.isArray(value)) {
    // Holes in sparse arrays read as undefined and become null too.
    return Array.from(value, (item) => undefinedToNull(item));
  }

  if (value !== null && typeof value === 'object') {
    // Preserve plain objects only; Date/Map/RegExp etc. pass through as-is.
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return value;
    }
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = undefinedToNull(value[key]);
    }
    return out;
  }

  return value;
}

// ---- Examples ----
console.log(undefinedToNull({ a: undefined, b: 'BFE.dev' }));
// { a: null, b: 'BFE.dev' }

console.log(undefinedToNull({ a: ['BFE.dev', undefined, 'bfe.dev'] }));
// { a: [ 'BFE.dev', null, 'bfe.dev' ] }

console.log(undefinedToNull({ a: { b: { c: undefined } } }));
// { a: { b: { c: null } } }

console.log(undefinedToNull(undefined)); // null
console.log(undefinedToNull(0));         // 0

module.exports = { undefinedToNull };
