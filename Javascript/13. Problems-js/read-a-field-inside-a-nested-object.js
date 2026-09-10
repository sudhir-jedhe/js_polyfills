/**
 * Read a field inside a nested object.
 *
 * Resolve a dotted / bracketed path against an object without throwing on
 * missing intermediates. Also includes the `set` counterpart.
 */

/** 'a.b[0].c' -> ['a', 'b', '0', 'c'] */
const toPath = (path) =>
  Array.isArray(path)
    ? path.map(String)
    : String(path).replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.').filter(Boolean);

/**
 * @param {object} obj
 * @param {string | Array<string|number>} path
 * @param {*} [fallback]
 */
function readField(obj, path, fallback = undefined) {
  let current = obj;
  for (const key of toPath(path)) {
    if (current == null) return fallback;
    current = current[key];
  }
  return current === undefined ? fallback : current;
}

/**
 * Set a value at a path, creating intermediate objects/arrays as needed.
 * Numeric keys create arrays.
 */
function setField(obj, path, value) {
  const keys = toPath(path);
  let current = obj;

  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      current[key] = value;
      return;
    }
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  });

  return obj;
}

// ---- Examples ----
const user = { profile: { contacts: [{ email: 'a@b.com' }] } };

console.log(readField(user, 'profile.contacts[0].email'));      // 'a@b.com'
console.log(readField(user, 'profile.contacts[1].email', '-')); // '-'
console.log(readField(user, 'profile.age', 0));                 // 0

console.log(JSON.stringify(setField({}, 'a.b[0].c', 42)));
// {"a":{"b":[{"c":42}]}}

module.exports = { readField, setField, toPath };
