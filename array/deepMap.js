function recursiveTransform(input, transformFn) {
  if (Array.isArray(input)) {
    return input.map(recursiveTransform.bind(null, transformFn));
  } else if (typeof input === "object" && input !== null) {
    const transformedObject = {};
    for (const key in input) {
      transformedObject[key] = recursiveTransform(input[key], transformFn);
    }
    return transformedObject;
  } else {
    return transformFn(input);
  }
}
// Implement a js function to recursively transform values deep map

// The function works by recursively traversing the data structure, applying the transformation function to each element. If the element is an array, the function recursively transforms the array. If the element is an object, the function recursively transforms the object's properties. If the element is a primitive value, the function applies the transformation function to the value.
// Here is an example of how to use the recursiveTransform function:
const input = {
  a: 1,
  b: [2, 3],
  c: {
    d: 4,
    e: 5,
  },
};

const transformFn = (value) => value * 2;

const transformedOutput = recursiveTransform(input, transformFn);

console.log(transformedOutput);

// { a: 2, b: [4, 6], c: { d: 8, e: 10 } }
