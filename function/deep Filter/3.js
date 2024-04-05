/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
// DO NOT CHANGE FUNCTION NAMES

const checkIfEmptyObject = (obj) => {
  if (obj) {
    return Object.keys(obj)?.length > 0 ? false : true;
  }
};

function getFilteredObject(collection, callback) {
  const keysOfObject = Object.keys(collection);

  const output = keysOfObject.reduce((acc, cur) => {
    if (typeof collection[cur] === "object") {
      const filteredValue = getFilteredObject(collection[cur], callback);
      const isEmpty = checkIfEmptyObject(filteredValue);
      return isEmpty ? acc : { ...acc, [cur]: filteredValue };
    }

    // if not object do this

    const shouldAddToResult = callback(collection[cur]);

    if (shouldAddToResult) {
      return { ...acc, [cur]: collection[cur] };
    }
    return acc;
  }, {});
  return output;
}

function filter(collection, callback) {
  // DO NOT REMOVE
  "use strict";

  // write your code below

  return getFilteredObject(collection, callback);
}
