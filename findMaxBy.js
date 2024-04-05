function findMax(array, criteria) {
  // Initialize the max value to the first element in the array
  let max = array[0];

  // Iterate over the array and compare each element to the max value
  for (let i = 1; i < array.length; i++) {
    // If the current element is greater than the max value, update the max value
    if (criteria(array[i]) > criteria(max)) {
      max = array[i];
    }
  }

  // Return the max value
  return max;
}

const array = [1, 2, 3, 4, 5];

// Find the maximum element in the array
const max = findMax(array, (element) => element);

// Print the maximum element
console.log(max); // 5

// Find the maximum element in the array based on the square of the element
const maxSquare = findMax(array, (element) => element * element);

// Print the maximum element
console.log(maxSquare); // 25
