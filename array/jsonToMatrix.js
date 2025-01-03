// Array-of-Objects-to-Matrix

// Write a function that converts an array of objects arr into a matrix m.

// arr is an array of objects or arrays. Each item in the array can be deeply nested with child arrays and child objects. It can also contain numbers, strings, booleans, and null values.

// The first row m should be the column names. If there is no nesting, the column names are the unique keys within the objects. If there is nesting, the column names are the respective paths in the object separated by ".".

// Each of the remaining rows corresponds to an object in arr. Each value in the matrix corresponds to a value in an object. If a given object doesn't contain a value for a given column, the cell should contain an empty string "".

// The columns in the matrix should be in lexographically ascending order.

 

// Example 1:

// Input: 
// arr = [
//   {"b": 1, "a": 2},
//   {"b": 3, "a": 4}
// ]
// Output: 
// [
//   ["a", "b"],
//   [2, 1],
//   [4, 3]
// ]

// Explanation:
// There are two unique column names in the two objects: "a" and "b".
// "a" corresponds with [2, 4].
// "b" coresponds with [1, 3].
// Example 2:

// Input: 
// arr = [
//   {"a": 1, "b": 2},
//   {"c": 3, "d": 4},
//   {}
// ]
// Output: 
// [
//   ["a", "b", "c", "d"],
//   [1, 2, "", ""],
//   ["", "", 3, 4],
//   ["", "", "", ""]
// ]

// Explanation:
// There are 4 unique column names: "a", "b", "c", "d".
// The first object has values associated with "a" and "b".
// The second object has values associated with "c" and "d".
// The third object has no keys, so it is just a row of empty strings.
// Example 3:

// Input: 
// arr = [
//   {"a": {"b": 1, "c": 2}},
//   {"a": {"b": 3, "d": 4}}
// ]
// Output: 
// [
//   ["a.b", "a.c", "a.d"],
//   [1, 2, ""],
//   [3, "", 4]
// ]

// Explanation:
// In this example, the objects are nested. The keys represent the full path to each value separated by periods.
// There are three paths: "a.b", "a.c", "a.d".
// Example 4:

// Input: 
// arr = [
//   [{"a": null}],
//   [{"b": true}],
//   [{"c": "x"}]
// ]
// Output: 
// [
//   ["0.a", "0.b", "0.c"],
//   [null, "", ""],
//   ["", true, ""],
//   ["", "", "x"]
// ]

// Explanation:
// Arrays are also considered objects with their keys being their indices.
// Each array has one element so the keys are "0.a", "0.b", and "0.c".
// Example 5:

// Input: 
// arr = [
//   {},
//   {},
//   {},
// ]
// Output: 
// [
//   [],
//   [],
//   [],
//   []
// ]

// Explanation:
// There are no keys so every row is an empty array.

function jsonToMatrix(arr: any[]): (string | number | boolean | null)[] {
    const dfs = (key: string, obj: any) => {
        if (
            typeof obj === 'number' ||
            typeof obj === 'string' ||
            typeof obj === 'boolean' ||
            obj === null
        ) {
            return { [key]: obj };
        }
        const res: any[] = [];
        for (const [k, v] of Object.entries(obj)) {
            const newKey = key ? `${key}.${k}` : `${k}`;
            res.push(dfs(newKey, v));
        }
        return res.flat();
    };

    const kv = arr.map(obj => dfs('', obj));
    const keys = [
        ...new Set(
            kv
                .flat()
                .map(obj => Object.keys(obj))
                .flat(),
        ),
    ].sort();
    const ans: any[] = [keys];
    for (const row of kv) {
        const newRow: any[] = [];
        for (const key of keys) {
            const v = row.find(r => r.hasOwnProperty(key))?.[key];
            newRow.push(v === undefined ? '' : v);
        }
        ans.push(newRow);
    }
    return ans;
}
