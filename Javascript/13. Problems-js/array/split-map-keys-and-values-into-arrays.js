/**
 * Split a Map's keys and values into separate arrays.
 *
 * Map exposes keys(), values() and entries() as iterators, so spreading is
 * all it takes. The same shapes for plain objects are here too.
 */

/** Keys and values as two arrays. */
const splitMap = (map) => ({ keys: [...map.keys()], values: [...map.values()] });

/** As a tuple, for destructuring. */
const splitMapTuple = (map) => [[...map.keys()], [...map.values()]];

/** Entries as [key, value] pairs. */
const mapEntries = (map) => [...map.entries()];

/** Rebuild a Map from parallel arrays. */
const mapFromArrays = (keys, values) => new Map(keys.map((key, i) => [key, values[i]]));

/** The same for a plain object. */
const splitObject = (obj) => ({ keys: Object.keys(obj), values: Object.values(obj) });

/** Rebuild an object from parallel arrays. */
const objectFromArrays = (keys, values) =>
  Object.fromEntries(keys.map((key, i) => [key, values[i]]));

/** Convert between Map and object. */
const mapToObject = (map) => Object.fromEntries(map);
const objectToMap = (obj) => new Map(Object.entries(obj));

/** Unzip a list of pairs into two arrays. */
const unzip = (pairs) => [pairs.map((p) => p[0]), pairs.map((p) => p[1])];

/** Filter a Map, returning a new Map. */
const filterMap = (map, predicate) =>
  new Map([...map.entries()].filter(([k, v]) => predicate(v, k)));

/** Map over a Map's values, keeping the keys. */
const mapValues = (map, fn) => new Map([...map.entries()].map(([k, v]) => [k, fn(v, k)]));

/** Sort a Map by its values. */
const sortMapByValue = (map) =>
  new Map([...map.entries()].sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0)));

// ---- Examples ----
const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);

console.log(splitMap(map));            // { keys: ['a','b','c'], values: [1,2,3] }

const [keys, values] = splitMapTuple(map);
console.log(keys, values);

console.log(mapEntries(map));          // [['a',1],['b',2],['c',3]]
console.log(mapFromArrays(['x', 'y'], [10, 20]));
console.log(splitObject({ p: 1, q: 2 }));
console.log(objectFromArrays(['p', 'q'], [1, 2]));
console.log(mapToObject(map));         // { a: 1, b: 2, c: 3 }
console.log(unzip([['a', 1], ['b', 2]]));
console.log(filterMap(map, (v) => v > 1));
console.log(mapValues(map, (v) => v * 10));

module.exports = { splitMap, splitMapTuple, mapEntries, mapFromArrays, splitObject, objectFromArrays, mapToObject, objectToMap, unzip, filterMap, mapValues, sortMapByValue };
