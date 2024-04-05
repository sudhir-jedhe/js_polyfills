// Implement a js function that returns a new object after squashing the input object into a single level of depth

// Flatten JavaScript objects into a single-depth Object

// Declare an object
let ob = {
  Company: "GeeksforGeeks",
  Address: "Noida",
  contact: +91 - 999999999,
  mentor: {
    HTML: "GFG",
    CSS: "GFG",
    JavaScript: "GFG",
  },
};

// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
const flattenObj = (ob) => {
  // The object which contains the
  // final result
  let result = {};

  // loop through the object "ob"
  for (const i in ob) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        // Store temp in result
        result[i + "." + j] = temp[j];
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = ob[i];
    }
  }
  return result;
};

console.log(flattenObj(ob));

/************************* */

function squashObject(inputObject, parentKey = "") {
  const outputObject = {};

  for (const key in inputObject) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      typeof inputObject[key] === "object" &&
      !Array.isArray(inputObject[key])
    ) {
      // If the value is an object, recursively flatten it
      Object.assign(outputObject, squashObject(inputObject[key], newKey));
    } else {
      // Otherwise, directly assign the value
      outputObject[newKey] = inputObject[key];
    }
  }

  return outputObject;
}

const nestedObject = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

const squashedObject = squashObject(nestedObject);
console.log(squashedObject); // Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }

/****************** */

function squashObject(obj) {
  return Object.assign(
    {},
    ...Object.keys(obj).map((k) =>
      typeof obj[k] === "object" ? squashObject(obj[k]) : { [k]: obj[k] }
    )
  );
}

/**************************** */

function squashObject(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    return typeof value === "object"
      ? { ...acc, ...squashObject(value) }
      : { ...acc, [key]: value };
  }, {});
}
