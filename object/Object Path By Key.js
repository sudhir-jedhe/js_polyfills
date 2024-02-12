function getObjectValue(obj, keys) {
  // Split the keys into an array
  const keyArray = keys.split(".");

  // Traverse the object using the keys
  let value = obj;
  for (let key of keyArray) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      // If any key is not found or value is not an object, return undefined
      return undefined;
    }
  }

  return value;
}

// Example usage:
const obj = {
  a: {
    b: {
      c: 123,
    },
  },
};

const keys = "a.b.c";
const value = getObjectValue(obj, keys);
console.log("Value:", value); // Output: 123

/**************************** */
function getObjectPathByKey(obj, path) {
  // Split the path string into an array of keys
  const keys = path.split(".");

  // Iterate over the keys to access nested properties
  let currentObj = obj;
  for (let key of keys) {
    // If the current object doesn't have the key, return undefined
    if (!currentObj || !currentObj.hasOwnProperty(key)) {
      return undefined;
    }
    // Move to the next nested object
    currentObj = currentObj[key];
  }

  // Return the value found at the end of the path
  return currentObj;
}

// Example usage:
const data = {
  foo: {
    bar: {
      baz: "value",
    },
  },
};

const path = "foo.bar.baz";
console.log(getObjectPathByKey(data, path)); // Output: 'value'
