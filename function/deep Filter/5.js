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
  return Object.keys(collection).reduce((acc, curr, idx) => {
    if (typeof collection[curr] === "object") {
      const subObj = filter(collection[curr], callback);
      if (Object.keys(subObj).length > 0) {
        acc[curr] = subObj;
      }
    } else if (callback(collection[curr])) {
      acc[curr] = collection[curr];
    }
    return acc;
  }, {});
}
