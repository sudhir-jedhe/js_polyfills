/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
// DO NOT CHANGE FUNCTION NAMES

function filter(collection, callback) {
  // DO NOT REMOVE
  "use strict";

  // write your code below
  return filterByRecursion(collection, callback);
}

const filterByRecursion = (collection, callback) => {
  Object.keys(collection).map((ele) => {
    if (typeof collection[ele] === "object") {
      const val = filterByRecursion(collection[ele], callback);
      if (Object.keys(val).length === 0 && val.constructor === Object) {
        delete collection[ele];
      }
    } else {
      if (!callback(collection[ele])) {
        delete collection[ele];
      }
    }
  });
  return collection;
};
