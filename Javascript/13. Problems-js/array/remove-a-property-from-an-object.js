/**
 * Remove a property from a JavaScript object.
 *
 * `delete` mutates; destructuring and filtering produce a new object.
 * Which one you want depends on whether anything else holds a reference.
 */

/** delete — MUTATES the object. */
function removeProperty(obj, key) {
  delete obj[key];
  return obj;
}

/** Destructuring rest — non-mutating, best when the key is known. */
function withoutProperty(obj, key) {
  const { [key]: removed, ...rest } = obj;
  return rest;
}

/** Remove several keys, non-mutating. */
function omit(obj, keys) {
  const drop = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !drop.has(k)));
}

/** Keep only the listed keys. */
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

/** Remove by predicate: drop every null or undefined value, say. */
const omitBy = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => !predicate(v, k)));

/** Remove a key at every nesting level. */
function omitDeep(value, keys) {
  const drop = new Set(keys);

  if (Array.isArray(value)) return value.map((v) => omitDeep(v, keys));

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (!drop.has(k)) out[k] = omitDeep(v, keys);
    }
    return out;
  }

  return value;
}

/** Setting to undefined is NOT the same as deleting — the key remains. */
const compareDeleteAndUndefined = () => {
  const a = { x: 1 };
  const b = { x: 1 };

  delete a.x;
  b.x = undefined;

  return { deleted: 'x' in a, undefinedAssigned: 'x' in b }; // false, true
};

/** Remove from a Map. */
const removeFromMap = (map, key) => {
  map.delete(key);
  return map;
};

// ---- Examples ----
const user = { id: 1, name: 'Ada', password: 'secret' };

console.log(withoutProperty(user, 'password'));  // { id, name }
console.log(user.password);                      // 'secret' — original untouched
console.log(omit(user, ['id', 'password']));     // { name: 'Ada' }
console.log(pick(user, ['id', 'name']));         // { id: 1, name: 'Ada' }
console.log(omitBy({ a: 1, b: null }, (v) => v == null)); // { a: 1 }
console.log(JSON.stringify(omitDeep({ a: 1, _id: 2, b: { _id: 3 } }, ['_id'])));
console.log(compareDeleteAndUndefined());        // { deleted: false, undefinedAssigned: true }

module.exports = { removeProperty, withoutProperty, omit, pick, omitBy, omitDeep, removeFromMap, compareDeleteAndUndefined };
