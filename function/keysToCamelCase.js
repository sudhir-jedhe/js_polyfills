/**********************************************Implement a function to convert all object keys to camel case *****************************************/
function keysToCamelCase(obj) {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Input must be a non-null object.");
  }

  const camelCasedObject = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      camelCasedObject[camelCaseKey] = obj[key];
    }
  }

  return camelCasedObject;
}

// Example usage:

const snakeCaseObject = {
  first_name: "John",
  last_name: "Doe",
  age_group: "Adult",
};

const camelCaseObject = keysToCamelCase(snakeCaseObject);

console.log(camelCaseObject);
// Output: { firstName: 'John', lastName: 'Doe', ageGroup: 'Adult' }

/********************************************** */

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function giveKey(string) {
  let parsedString = string.toLowerCase();

  return parsedString
    .replace(/(?<=[^a-zA-Z])([a-z]+)/g, (match, p0) => {
      return capitalize(p0);
    })
    .replace(/[^a-zA-Z0-9]/g, "");
}

function forObj(collection) {
  const isCollectionObject = typeof collection === "object";

  // if not object or null then return original input
  if (!isCollectionObject || collection === null) {
    return collection;
  }
  return Object.keys(collection).reduce((acc, each) => {
    if (typeof collection[each] === "object") {
      if (Array.isArray(collection[each])) {
        let key = giveKey(each);
        acc[key] = collection[each];
      } else {
        let key = giveKey(each);
        acc[key] = camelCaseKeys(collection[each]);
      }
    } else {
      let key = giveKey(each);
      acc[key] = collection[each];
    }

    return acc;
  }, {});
}

function camelCaseKeys(collection) {
  if (Array.isArray(collection)) {
    return collection.map((each) => camelCaseKeys(each));
  } else {
    return forObj(collection);
  }
}

/************************************************************* */

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {string} string
 * @return {string}
 */
function camelCase(string) {
  let parsedString = string.toLowerCase();

  return parsedString
    .replace(/(?<=[^a-zA-Z])([a-z]+)/g, (match, p0) => {
      return capitalize(p0);
    })
    .replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * @param {object|array} collection
 * @return {object}
 */
function camelCaseKeys(collection) {
  // checking if the input collection is an array
  const isCollectionArray = Array.isArray(collection);

  if (isCollectionArray) {
    // if empty array then return the original input
    if (!collection.length) {
      return collection;
    }

    // iterate over the array and
    // invoke the camelCaseKeys method on each item
    return collection.map((item) => camelCaseKeys(item));
  }

  // check if collection is object
  const isCollectionObject = typeof collection === "object";

  // if not object or null then return original input
  if (!isCollectionObject || collection === null) {
    return collection;
  }

  // get each key and value
  // [['total_question', 1], ...]
  const keyValues = Object.entries(collection);

  // iterate over the key value pair and convert to camelCase
  const convertedCollection = keyValues.map(([key, value]) => {
    return [
      camelCase(key),
      typeof value === "object" ? camelCaseKeys(value) : value,
    ];
  });

  // reconstruct the original collection and return
  return Object.fromEntries(convertedCollection);
}

/*************************************** */

function camelCaseKeys(collection) {
  "use strict";
  // write your code below
  if (isPrimitive(collection)) {
    return collection;
  }
  if (Array.isArray(collection)) {
    return camelCasedKeysArray(collection);
  }
  return camelCasedKeysObject(collection);
}

function camelCasedString(str) {
  let firstLetterAfterNonLetter = false;
  return str
    .split("")
    .map((char, i) => {
      if (i !== 0) {
        let newChar = char;
        if (!str[i].toLowerCase().match(/[a-z]/i)) {
          firstLetterAfterNonLetter = true;
          if (!str[i].toLowerCase().match(/[0-9]/i)) {
            newChar = "";
            console.log(newChar);
            return newChar;
          }
        }
        if (str[i].toLowerCase().match(/[a-z]/i) && firstLetterAfterNonLetter) {
          firstLetterAfterNonLetter = false;
          newChar = char.toUpperCase();
        } else {
          newChar = char.toLowerCase();
        }
        console.log(newChar);
        return newChar;
      }
      return char.toLowerCase();
    })
    .join("");
}

function isPrimitive(val) {
  if (!val || typeof val !== "object") {
    return true;
  }
  return false;
}

function camelCasedKeysObject(collection) {
  let modObj = {};
  //go thru each key in obj
  for (const key in collection) {
    //get the camelCasedversion for it
    let camelCaseKey = camelCasedString(key);
    if (isPrimitive(collection[key])) {
      //add the new key and the old value from it
      //in the new object, if the value is primitive
      modObj = { ...modObj, [camelCaseKey]: collection[key] };
    } else {
      //else set the value as camelCased version of the old value
      modObj = { ...modObj, [camelCaseKey]: camelCaseKeys(collection[key]) };
    }
  }
  return modObj;
}

function camelCasedKeysArray(collection) {
  let modArr = [];
  for (const element of collection) {
    if (isPrimitive(element)) {
      modArr = [...modArr, element];
    } else {
      modArr = [...modArr, camelCaseKeys(element)];
    }
  }
  //go through each element, if an object
  //replace it with camelCasedversion of it in the array
  return modArr;
}
