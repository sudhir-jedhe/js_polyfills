sortBy;
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
// Do not change function Namespace

function sortBy(collection, property) {
  // do not remove
  "use strict";
  const result = [...collection];
  result.sort((a, b) => {
    const keys = property.split(".");
    const aItem = keys.reduce((result, item) => {
      if (result[item] !== undefined) {
        return result[item];
      } else {
      }
    }, a);
    const bItem = keys.reduce((result, item) => {
      if (result[item] !== undefined) {
        return result[item];
      } else {
      }
    }, b);
    if (aItem == undefined || bItem == undefined) return 0;

    return aItem - bItem;
  });
  return result;
}

const arrayOne = [{ a: 1 }, { a: 3 }, { a: 2 }];

// expected output: [{a: 1}, {a: 2}, {a: 3}];
sortBy(arrayOne, "a");

const arrayTwo = [
  { a: 1, b: "z" },
  { a: 2, b: "y" },
  { a: 1, b: "x" },
  { a: 2, b: "w" },
];

// expected output: [{a: 1, b: 'z'}, {a: 1, b: 'x'}, {a: 2, b: 'y'}, {a: 2, b: 'w'}];
sortBy(arrayTwo, "a");

const arrayThree = [
  { a: 1, b: { c: 4 } },
  { a: 2, b: { c: 2 } },
  { a: 3, b: { c: 1 } },
  { a: 4, b: { c: 0 } },
];

// expected output: [{"a":4,"b":{"c":0}},{"a":3,"b":{"c":1}},{"a":2,"b":{"c":2}},{"a":1,"b":{"c":4}}]
sortBy(arrayThree, "b.c");

/***************************** */

function sortBy(collection, property) {
  // do not remove
  "use strict";

  // write your solution below
  return collection.sort((firstObj, secondObj) => {
    let propArray = property.split(".");
    let aitem = propArray.reduce((acc, curr, i) => {
      return acc ? acc[curr] : undefined;
    }, firstObj);
    let bitem = propArray.reduce((acc, curr) => {
      return acc ? acc[curr] : undefined;
    }, secondObj);
    if (aitem == undefined || bitem == undefined) return 0;
    return aitem - bitem;
  });
}

// console.log(s)


/**************************************** */


Given an array arr and a function fn, return a sorted array sortedArr. You can assume fn only returns numbers and those numbers determine the sort order of sortedArr. sortedArr must be sorted in ascending order by fn output.

You may assume that fn will never duplicate numbers for a given array.

 

Example 1:

Input: arr = [5, 4, 1, 2, 3], fn = (x) => x
Output: [1, 2, 3, 4, 5]
Explanation: fn simply returns the number passed to it so the array is sorted in ascending order.
Example 2:

Input: arr = [{"x": 1}, {"x": 0}, {"x": -1}], fn = (d) => d.x
Output: [{"x": -1}, {"x": 0}, {"x": 1}]
Explanation: fn returns the value for the "x" key. So the array is sorted based on that value.
Example 3:

Input: arr = [[3, 4], [5, 2], [10, 1]], fn = (x) => x[1]
Output: [[10, 1], [5, 2], [3, 4]]
Explanation: arr is sorted in ascending order by number at index=1.


function sortBy(arr, fn) {
  return arr.slice().sort((a, b) => fn(a) - fn(b));
}
