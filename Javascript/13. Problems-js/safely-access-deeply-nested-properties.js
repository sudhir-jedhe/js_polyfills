/**
 * Safely access deeply-nested properties in JavaScript objects.
 *
 * A `get(obj, path, defaultValue)` helper in the spirit of lodash.get:
 * it never throws on a missing intermediate value and falls back to
 * `defaultValue` when the resolved value is `undefined`.
 *
 * Supported paths: 'a.b.c', 'a[0].b', ['a', 0, 'b'].
 */

/**
 * Turn 'a.b[0].c' into ['a', 'b', '0', 'c'].
 * @param {string} path
 * @returns {string[]}
 */
function toPathArray(path) {
  return String(path)
    .replace(/\[(\w+)\]/g, '.$1') // a[0]  -> a.0
    .replace(/^\./, '')
    .split('.')
    .filter(Boolean);
}

/**
 * @param {object} obj
 * @param {string | Array<string|number>} path
 * @param {*} [defaultValue]
 * @returns {*}
 */
function get(obj, path, defaultValue = undefined) {
  const keys = Array.isArray(path) ? path : toPathArray(path);

  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue;
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

// ---- Examples ----
const data = {
  user: {
    name: 'Sudhir',
    addresses: [{ city: 'Pune', zip: null }],
  },
};

console.log(get(data, 'user.name'));                 // 'Sudhir'
console.log(get(data, 'user.addresses[0].city'));    // 'Pune'
console.log(get(data, 'user.addresses[0].zip', 'NA'));// null (present, so kept)
console.log(get(data, 'user.addresses[3].city'));    // undefined
console.log(get(data, 'user.phone.mobile', 'none')); // 'none'
console.log(get(data, ['user', 'addresses', 0, 'city'])); // 'Pune'

module.exports = { get, toPathArray };
