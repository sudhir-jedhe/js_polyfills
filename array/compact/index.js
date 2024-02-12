// Source: https://bit.ly/3hEZdCl
// Function to compact an object by removing falsy values (null, false, 0, '', undefined)
const compactObject = (val) => {
  // Use ternary operator to filter out falsy values for arrays, otherwise use the provided value
  const data = Array.isArray(val) ? val.filter(Boolean) : val;

  // Reduce the object to a compacted version, removing falsy values recursively
  return Object.keys(data).reduce(
    (acc, key) => {
      const value = data[key];

      // Check if the value is truthy before including it in the result
      if (Boolean(value))
        // Recursively compact object values, if applicable
        acc[key] = typeof value === "object" ? compactObject(value) : value;

      return acc;
    },
    // Initialize the result as an empty array for arrays, otherwise an empty object
    Array.isArray(val) ? [] : {}
  );
};

// Sample object with various values including falsy ones
const obj = {
  a: null,
  b: false,
  c: true,
  d: 0,
  e: 1,
  f: "",
  g: "a",
  h: [null, false, "", true, 1, "a"],
  i: { j: 0, k: false, l: "a" },
};

// Output the result of compacting the object
console.log(compactObject(obj));

// {"c":true,"e":1,"g":"a","h":[true,1,"a"],"i":{"l":"a"}}
