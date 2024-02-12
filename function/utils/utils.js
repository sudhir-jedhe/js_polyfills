/**
 * @template T
 * @param {T} value
 * @return {T}
 */
export default function deepClone(value) {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, deepClone(value)])
  );
}
// There are generally two ways we can traverse an object:

// Loop through the keys with the good old for ... in statement. Converting the
// object into an array of keys with Object.keys(), or an array of a key-value
// tuple with Object.entries(). With the for ... in statement, inherited
// enumerable properties are processed as well. On the other hand, Object.keys()
// and Object.entries() only care about the properties directly defined on the
// object, and this is usually what we want.

// Edge Cases Non-enumerable and symbol-keyed properties are ignored. Property
// descriptors are not respected and copied into the cloned object. If the
// object has circular references, the current solution will break and cause a
// stack overflow by recursing into an infinite loop. Prototypes are not copied.
// We will address these edge cases in Deep
