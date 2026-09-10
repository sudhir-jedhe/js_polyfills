/**
 * Loop through a plain object whose members are objects.
 *
 * Object.entries is the modern default. for...in walks the prototype chain,
 * which is the classic source of bugs.
 */

/** entries — the default. */
function forEachEntry(obj, fn) {
  for (const [key, value] of Object.entries(obj)) fn(key, value, obj);
}

/** keys, when you only need the names. */
const eachKey = (obj, fn) => Object.keys(obj).forEach((key) => fn(key, obj[key]));

/** for...in WITH the hasOwnProperty guard — inherited keys excluded. */
function forInOwn(obj, fn) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) fn(key, obj[key]);
  }
}

/** Map over values, keeping the keys. */
const mapValues = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));

/** Map over keys, keeping the values. */
const mapKeys = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k, v), v]));

/** Filter entries by a predicate. */
const filterEntries = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => predicate(v, k)));

/**
 * Walk every nested value, depth first. The callback receives the value and
 * its dotted path, which makes it easy to build flat views of nested config.
 */
function walkDeep(value, fn, path = []) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) walkDeep(child, fn, [...path, key]);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((child, i) => walkDeep(child, fn, [...path, String(i)]));
    return;
  }

  fn(value, path.join('.'));
}

/** Flatten a nested object into { 'a.b.c': value }. */
function flattenObject(obj) {
  const out = {};
  walkDeep(obj, (value, path) => {
    out[path] = value;
  });
  return out;
}

/** Iterate the objects inside an object of objects. */
function forEachMember(obj, fn) {
  for (const [key, member] of Object.entries(obj)) {
    if (member !== null && typeof member === 'object') fn(key, member);
  }
}

// ---- Examples ----
const config = {
  db: { host: 'localhost', port: 5432 },
  cache: { ttl: 300 },
  debug: true,
};

forEachEntry(config, (k, v) => console.log(k, typeof v));
console.log(mapValues({ a: 1, b: 2 }, (n) => n * 10));  // { a: 10, b: 20 }
console.log(mapKeys({ a: 1 }, (k) => k.toUpperCase())); // { A: 1 }
console.log(filterEntries(config, (v) => typeof v === 'object')); // db, cache
console.log(flattenObject(config)); // { 'db.host': 'localhost', ... }

forEachMember(config, (name, member) => console.log(name, Object.keys(member)));

module.exports = { forEachEntry, eachKey, forInOwn, mapValues, mapKeys, filterEntries, walkDeep, flattenObject, forEachMember };
