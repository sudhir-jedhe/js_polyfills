/*********************set a value in an object by providing a path ******************* */
function setValueByPath(obj, path, value) {
  const pathArray = path.split(".");
  let currentObj = obj; // {}

  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i]; // user
    if (!currentObj[key] || typeof currentObj[key] !== "object") {
      currentObj[key] = {};
    }
    currentObj = currentObj[key]; // { user: {} }
  }

  const lastKey = pathArray[pathArray.length - 1];
  currentObj[lastKey] = value;
}

// Example usage:
const myObject = {};

setValueByPath(myObject, "user.name.first", "John");
setValueByPath(myObject, "user.name.last", "Doe");
setValueByPath(myObject, "user.age", 30);

console.log(myObject);
/*
Output:
{
  user: {
      name: {
          first: 'John',
          last: 'Doe'
      },
      age: 30
  }
}
*/

/************************************** */
function set(object, path, value) {
  // write your code below

  const isObjectInvalid = !object || typeof object !== "object";

  // escape condition
  // return null if object/path is invalid
  if (isObjectInvalid || !path) {
    return null;
  }

  // cleaning the path if type is string
  if (typeof path === "string") {
    path = path.replaceAll("[", ".");
    path = path.replaceAll("]", ".");
    path = path.split(".");
  }

  // filtering out empty values
  path = path.filter(Boolean);

  let i;
  let currentKey;
  let currentItem = object;

  for (i = 0; i < path.length; i++) {
    currentKey = path[i];

    // handling missing portion of the object case
    if (!Object.prototype.hasOwnProperty.call(currentItem, currentKey)) {
      // 'x' => isNaN('x' && Number('x')) => isNaN('x' && NaN) => isNaN(NaN) => true
      // '0' => isNaN('0' && Number('0')) => isNaN('0' && 0) => isNaN(0) => false
      const isNonArrayMissingIndex = isNaN(path[i + 1] && Number(path[i + 1]));

      // creating object for all missing keys
      if (isNonArrayMissingIndex) {
        currentItem[currentKey] = {};
      } else {
        // handling array missing index case
        currentItem[currentKey] = [];
      }
    }

    // if the last key then set the value
    if (i === path.length - 1) {
      currentItem[currentKey] = value;
    } else {
      // updating currentItem
      currentItem = currentItem[currentKey];
    }
  }

  // return the original object
  return object;
}

/**************************************************** */

function set(object, path, value) {
  // DO NOT REMOVE
  "use strict";

  if (!object || typeof object !== "object" || path === "") return object;

  let paths;

  if (!Array.isArray(path)) {
    path = path.trim();
    path = path.replaceAll("[", ".");
    path = path.replaceAll("]", ".");
    paths = path.split(".").filter((part) => part !== "");
  } else paths = path;

  let obj = object;

  paths.forEach((path, index) => {
    if (!obj[path]) {
      if (parseInt(paths[index + 1]) >= 0) obj[path] = [];
      else obj[path] = {};
    }
    if (index === paths.length - 1) obj[path] = value;
    obj = obj[path];
  });

  return object;
}
