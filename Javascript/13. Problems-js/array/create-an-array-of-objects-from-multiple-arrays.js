/**
 * Create an array of objects from multiple parallel arrays.
 *
 * ['a','b'] + [1,2] -> [{key:'a', value:1}, {key:'b', value:2}]
 */

/** Two parallel arrays into named fields. */
const toObjects = (keys, values, keyName = 'key', valueName = 'value') =>
  keys.map((key, i) => ({ [keyName]: key, [valueName]: values[i] }));

/**
 * Any number of parallel arrays, with a field name for each.
 * zipToObjects(['id','name'], [[1,2], ['a','b']])
 *   -> [{id:1, name:'a'}, {id:2, name:'b'}]
 */
function zipToObjects(fieldNames, arrays) {
  const length = Math.max(0, ...arrays.map((a) => a.length));

  return Array.from({ length }, (_, i) =>
    Object.fromEntries(fieldNames.map((name, f) => [name, arrays[f][i]]))
  );
}

/** Column-oriented data (a table) into row objects. */
const columnsToRows = (columns) => zipToObjects(Object.keys(columns), Object.values(columns));

/** And back: row objects into columns. */
function rowsToColumns(rows) {
  const keys = [...new Set(rows.flatMap(Object.keys))];
  return Object.fromEntries(keys.map((key) => [key, rows.map((row) => row[key])]));
}

/** Merge objects positionally: [{a:1}] + [{b:2}] -> [{a:1, b:2}]. */
const mergeParallel = (...arrays) => {
  const length = Math.max(0, ...arrays.map((a) => a.length));
  return Array.from({ length }, (_, i) => Object.assign({}, ...arrays.map((a) => a[i])));
};

/** Index an array of objects by a key, for O(1) lookup. */
const indexBy = (arr, key) => Object.fromEntries(arr.map((item) => [item[key], item]));

// ---- Examples ----
console.log(toObjects(['a', 'b'], [1, 2]));
// [{ key: 'a', value: 1 }, { key: 'b', value: 2 }]

console.log(zipToObjects(['id', 'name'], [[1, 2], ['Ada', 'Bob']]));
// [{ id: 1, name: 'Ada' }, { id: 2, name: 'Bob' }]

console.log(columnsToRows({ id: [1, 2], name: ['x', 'y'] }));
console.log(rowsToColumns([{ id: 1, name: 'x' }, { id: 2, name: 'y' }]));
console.log(mergeParallel([{ a: 1 }], [{ b: 2 }])); // [{ a: 1, b: 2 }]
console.log(indexBy([{ id: 'x', n: 1 }], 'id'));    // { x: { id: 'x', n: 1 } }

module.exports = { toObjects, zipToObjects, columnsToRows, rowsToColumns, mergeParallel, indexBy };
