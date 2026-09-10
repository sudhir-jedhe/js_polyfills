/**
 * Remove objects from an "associative array" (an object used as a map).
 *
 * delete mutates; the Object.fromEntries variants build a new object. When
 * keys are added and removed constantly, a Map is the better structure.
 */

/** Remove one key — MUTATES. */
function removeKey(obj, key) {
  delete obj[key];
  return obj;
}

/** Remove several keys — MUTATES. */
function removeKeys(obj, keys) {
  for (const key of keys) delete obj[key];
  return obj;
}

/** Non-mutating removal of one key. */
const withoutKey = (obj, key) => {
  const { [key]: dropped, ...rest } = obj;
  return rest;
};

/** Non-mutating removal of several keys. */
function withoutKeys(obj, keys) {
  const drop = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !drop.has(k)));
}

/** Remove entries whose VALUE matches a predicate. */
const removeByValue = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => !predicate(v, k)));

/** Remove nested objects matching a predicate, at any depth. */
function removeDeepWhere(value, predicate) {
  if (Array.isArray(value)) {
    return value.filter((v) => !predicate(v)).map((v) => removeDeepWhere(v, predicate));
  }

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (predicate(v, k)) continue;
      out[k] = removeDeepWhere(v, predicate);
    }
    return out;
  }

  return value;
}

/** Remove entries older than a cutoff — the common cache-eviction shape. */
const removeExpired = (store, now = Date.now()) =>
  Object.fromEntries(Object.entries(store).filter(([, entry]) => entry.expiresAt > now));

/** The Map equivalent, which is what you actually want for this workload. */
function removeFromMap(map, keys) {
  for (const key of keys) map.delete(key);
  return map;
}

/** Delete every key, keeping the same object reference. */
function clearObject(obj) {
  for (const key of Object.keys(obj)) delete obj[key];
  return obj;
}

// ---- Examples ----
const store = {
  a: { id: 1, active: true },
  b: { id: 2, active: false },
  c: { id: 3, active: false },
};

console.log(withoutKey(store, 'b'));                    // a and c
console.log(withoutKeys(store, ['b', 'c']));            // only a
console.log(removeByValue(store, (v) => !v.active));    // only a
console.log(Object.keys(store));                        // unchanged: a, b, c

console.log(removeExpired({
  x: { expiresAt: Date.now() + 1000 },
  y: { expiresAt: Date.now() - 1000 },
})); // only x

console.log(removeFromMap(new Map([['a', 1], ['b', 2]]), ['a']));

module.exports = { removeKey, removeKeys, withoutKey, withoutKeys, removeByValue, removeDeepWhere, removeExpired, removeFromMap, clearObject };
