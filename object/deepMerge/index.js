function mergeObjects(obj1, obj2) {
  // Create a new object to store the merged properties.
  const mergedObj = {};

  // Iterate over the first object and add its properties to the merged object.
  for (const key in obj1) {
    mergedObj[key] = obj1[key];
  }

  // Iterate over the second object and add its properties to the merged object,
  // overwriting any properties that already exist.
  for (const key in obj2) {
    mergedObj[key] = obj2[key];
  }

  // Return the merged object.
  return mergedObj;
}

// Example usage:
const obj1 = {
  name: "Alice",
  age: 25,
};

const obj2 = {
  occupation: "Software Engineer",
  city: "San Francisco",
};

const mergedObj = mergeObjects(obj1, obj2);

console.log(mergedObj);
