/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
// DO NOT CHANGE FUNCTION NAMES

// Simple utility to check if an object is empty
function isObjEmpty(obj) {
  return !Object.keys(obj).length;
}

function filter(collection, callback) {
  // DO NOT REMOVE
  "use strict";

  // validation checks
  if (!collection) {
    throw new TypeError("An argument for collection was not provided");
  }
  if (!callback) {
    throw new TypeError("An argument for callback was not provided");
  }
  if (typeof collection !== "object") {
    throw new TypeError("Collection must be of type object");
  }
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be of type function");
  }

  function filterRecurse(obj) {
    const res = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v === "object") {
        // If filtered object is empty, then the key is removed from object
        const filteredValue = filterRecurse(v);
        if (!isObjEmpty(filteredValue)) {
          res[k] = filteredValue;
        }
      } else {
        if (callback(v)) {
          res[k] = v;
        }
      }
    });

    return res;
  }

  return filterRecurse(collection);
}
