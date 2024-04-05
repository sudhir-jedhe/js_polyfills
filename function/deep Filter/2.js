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

  if (!collection || typeof collection !== "object") throw new TypeError();

  return (function free(part) {
    const obj = {};

    for (const key in part) {
      if (typeof part[key] === "object") {
        const yes = free(part[key]);

        if (yes !== undefined && Object.keys(yes).length > 0) obj[key] = yes;
      } else if (callback(part[key])) obj[key] = part[key];
    }

    return obj;
  })(collection);
}
