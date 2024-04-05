```js
function getUniqueValuesInAllArrays(arrays, iteratee) {
  // Create a new set to store the unique values.
  const uniqueValues = new Set();

  // Iterate over each array.
  for (const array of arrays) {
    // Iterate over each value in the array.
    for (const value of array) {
      // Get the iterated value.
      const iteratedValue = iteratee(value);

      // Add the iterated value to the set if it is not already present.
      if (!uniqueValues.has(iteratedValue)) {
        uniqueValues.add(iteratedValue);
      }
    }
  }

  // Return the array of unique values.
  return [...uniqueValues];
}
const arrays = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Get the unique values in all arrays, using the identity function as the iteratee.
const uniqueValues = getUniqueValuesInAllArrays(arrays, (value) => value);

// Print the unique values.
console.log(uniqueValues); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Get the unique values in all arrays, using a function that returns the square of the value as the iteratee.
const uniqueSquaredValues = getUniqueValuesInAllArrays(
  arrays,
  (value) => value * value
);

// Print the unique squared values.
console.log(uniqueSquaredValues); // [1, 4, 9, 16, 25, 36, 49, 64, 81]


```

```js
function mergeUsingSpread(...inputArrays) {
  let uniqueValues = new Set();

  // Using loop to go thofugh each array
  inputArrays.forEach((arr) => {
    // Here, adding the element of current
    // array into the Set of uniqueValues
    arr.forEach((ele) => {
      uniqueValues.add(ele);
    });
  });

  // Converting the set to array
  return Array.from(uniqueValues);
}

// Multiple Input arrays
let inputArray1 = [1, 2, 3, 4, 5];
let inputArray2 = [4, 5, 6, 7, 8];
let inputArray3 = [7, 8, 9, 10, 11];
let outputArray = mergeUsingSpread(inputArray1, inputArray2, inputArray3);
console.log(outputArray);

const numbers = [1, 2, 34, 1, 6, 8, 2, 3, 9];
const unique = [...new Set(numbers)];

```