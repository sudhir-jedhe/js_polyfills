/**
 * omit() and pick().
 *
 * omit(obj, keys) returns a shallow copy without the listed keys.
 * pick(obj, keys) is the complement.
 */

/**
 * @template T
 * @param {T} obj
 * @param {string[]} keys
 * @returns {Partial<T>}
 */
function omit(obj, keys) {
  const drop = new Set(keys);
  const out = {};

  for (const key of Object.keys(obj)) {
    if (!drop.has(key)) out[key] = obj[key];
  }

  return out;
}

/** Clone-and-delete flavour. */
const omitDelete = (obj, ...keys) => {
  const clone = { ...obj };
  for (const key of keys) delete clone[key];
  return clone;
};

/** Keep only the listed keys. */
function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) out[key] = obj[key];
  }
  return out;
}

/** Drop by predicate rather than by name. */
const omitBy = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => !predicate(v, k)));

/** Deep omit — removes the keys at every nesting level. */
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

// ---- Examples ----
const user = { id: 1, name: 'Sudhir', password: 'secret', email: 'a@b.com' };

console.log(omit(user, ['password']));       // { id, name, email }
console.log(omitDelete(user, 'id', 'email'));// { name, password }
console.log(pick(user, ['id', 'name']));     // { id: 1, name: 'Sudhir' }
console.log(omitBy({ a: 1, b: null, c: 3 }, (v) => v == null)); // { a: 1, c: 3 }

console.log(JSON.stringify(omitDeep({ a: 1, _id: 2, b: { _id: 3, c: 4 } }, ['_id'])));
// {"a":1,"b":{"c":4}}

module.exports = { omit, omitDelete, pick, omitBy, omitDeep };
