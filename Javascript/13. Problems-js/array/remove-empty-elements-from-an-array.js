/**
 * Remove empty elements from an array.
 *
 * "Empty" means different things: falsy values, nullish values, empty
 * strings, empty objects/arrays, or the HOLES in a sparse array. Each has
 * its own function here.
 */

/** Remove all falsy values: false, 0, '', null, undefined, NaN. */
const removeFalsy = (arr) => arr.filter(Boolean);

/** Remove only null and undefined — keeps 0, '' and false. */
const removeNullish = (arr) => arr.filter((v) => v != null);

/** Remove empty and whitespace-only strings, plus nullish. */
const removeEmptyStrings = (arr) =>
  arr.filter((v) => v != null && String(v).trim() !== '');

/**
 * Remove HOLES from a sparse array. filter skips holes automatically, so
 * this also collapses [1, , 3] to [1, 3].
 */
const removeHoles = (arr) => arr.filter(() => true);

/** Remove empty objects and empty arrays too. */
const removeEmptyValues = (arr) =>
  arr.filter((v) => {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim() !== '';
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return true;
  });

/** Deep clean: applies removeEmptyValues at every nesting level. */
function removeEmptyDeep(value) {
  if (Array.isArray(value)) {
    return removeEmptyValues(value.map(removeEmptyDeep));
  }

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const cleaned = removeEmptyDeep(v);
      if (cleaned != null && !(typeof cleaned === 'string' && cleaned.trim() === '')) {
        out[k] = cleaned;
      }
    }
    return out;
  }

  return value;
}

// ---- Examples ----
console.log(removeFalsy([1, 0, '', 'a', null, undefined, NaN, false])); // [1, 'a']
console.log(removeNullish([0, null, '', undefined, false]));  // [0, '', false]
console.log(removeEmptyStrings(['a', '', '  ', 'b', null]));  // ['a', 'b']
console.log(removeHoles([1, , 3].map((x) => x)).length);      // 2
console.log(removeEmptyValues([{}, { a: 1 }, [], [1], 'x', ''])); // [{a:1}, [1], 'x']
console.log(JSON.stringify(removeEmptyDeep({ a: '', b: { c: 1, d: null } })));
// {"b":{"c":1}}

module.exports = { removeFalsy, removeNullish, removeEmptyStrings, removeHoles, removeEmptyValues, removeEmptyDeep };
