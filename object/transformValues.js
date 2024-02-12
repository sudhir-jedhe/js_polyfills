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
