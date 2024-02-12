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
