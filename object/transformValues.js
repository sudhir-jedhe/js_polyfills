function transformValues(obj, transformFunction) {
  const transformedObject = {};
  for (const key in obj) {
    const value = obj[key];
    transformedObject[key] = transformFunction(value);
  }
  return transformedObject;
}

// Example usage:
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

const transformedObject = transformValues(obj, (value) => value * 2);

console.log(transformedObject); // { a: 2, b: 4, c: 6 }

// Implement a js function to transform values within an object

const obj = {
  a: "hello",
  b: "world",
};

const transformedObject = transformValues(obj, (value) => value.toUpperCase());

console.log(transformedObject); // { a: "HELLO", b: "WORLD" }

// You can use the transformValues() function to transform the values of an
// object in any way you want. For example, you could use it to: Convert all the
// values to numbers. Convert all the values to strings. Format the values in a
// specific way. Filter out certain values. Add new values.

function transformObject(obj, transformFunction) {
  // Handle different object types for broader applicability
  if (typeof obj !== "object" || obj === null) {
    return obj; // Primitives and null are returned as-is
  }

  if (Array.isArray(obj)) {
    return obj.map(transformFunction); // Recursively transform array elements
  }

  const transformedObject = {};
  for (const key in obj) {
    transformedObject[key] = transformFunction(obj[key]); // Apply transform to each value
  }
  return transformedObject;
}

const myObject = { a: 1, b: 2, c: [3, 4] };

function doubleIt(value) {
  return value * 2;
}

const transformedObject = transformObject(myObject, doubleIt);
console.log(transformedObject); // Output: { a: 2, b: 4, c: [6, 8] }

const myObject = { name: "alice", city: "new york" };

function toUpperCase(value) {
  return value.toUpperCase();
}

const transformedObject = transformObject(myObject, toUpperCase);
console.log(transformedObject); // Output: { name: 'ALICE', city: 'NEW YORK' }
