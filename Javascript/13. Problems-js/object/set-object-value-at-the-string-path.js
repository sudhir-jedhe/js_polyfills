/**
 * Set an object value at a string path.
 *
 * set(obj, 'a.b[0].c', value) creates the intermediate containers as it
 * goes — arrays for numeric segments, objects otherwise.
 */

/** 'a.b[0].c' -> ['a', 'b', '0', 'c'] */
function toPath(path) {
  if (Array.isArray(path)) return path.map(String);
  return String(path)
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
    .filter(Boolean);
}

/**
 * Mutates and returns `obj`.
 * @param {object} obj
 * @param {string | Array<string|number>} path
 * @param {*} value
 */
function set(obj, path, value) {
  const keys = toPath(path);
  if (keys.length === 0) return obj;

  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextIsIndex = /^\d+$/.test(keys[i + 1]);

    if (current[key] === null || typeof current[key] !== 'object') {
      current[key] = nextIsIndex ? [] : {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

/** Non-mutating version: returns a new object, structurally sharing the rest. */
function setImmutable(obj, path, value) {
  const keys = toPath(path);
  if (keys.length === 0) return value;

  const [head, ...rest] = keys;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };

  clone[head] =
    rest.length === 0
      ? value
      : setImmutable(obj?.[head] ?? (/^\d+$/.test(rest[0]) ? [] : {}), rest, value);

  return clone;
}

/** Read counterpart. */
function get(obj, path, fallback) {
  let current = obj;
  for (const key of toPath(path)) {
    if (current == null) return fallback;
    current = current[key];
  }
  return current === undefined ? fallback : current;
}

// ---- Examples ----
console.log(JSON.stringify(set({}, 'a.b.c', 1)));            // {"a":{"b":{"c":1}}}
console.log(JSON.stringify(set({}, 'a[0].b', 'x')));         // {"a":[{"b":"x"}]}
console.log(JSON.stringify(set({ a: { z: 9 } }, 'a.b', 2))); // {"a":{"z":9,"b":2}}

const original = { a: { b: 1 } };
console.log(JSON.stringify(setImmutable(original, 'a.c', 2)), JSON.stringify(original));
// {"a":{"b":1,"c":2}} {"a":{"b":1}}

console.log(get({ a: [{ b: 5 }] }, 'a[0].b')); // 5

module.exports = { set, setImmutable, get, toPath };
