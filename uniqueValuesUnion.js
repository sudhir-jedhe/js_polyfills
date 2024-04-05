function uniqueValues(arrays) {
  // Create a new Set object to store the unique values.
  const uniqueSet = new Set();

  // Iterate over each array and add its values to the Set object.
  for (const array of arrays) {
    for (const value of array) {
      uniqueSet.add(value);
    }
  }

  // Convert the Set object back to an array and return it.
  return [...uniqueSet];
}

// Example usage:
const arrays = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const uniqueValuesArray = uniqueValues(arrays);

console.log(uniqueValuesArray); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
