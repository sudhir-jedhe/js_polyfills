rotateArray([1, 2, 3, 4, 5], 2); // returns [3, 4, 5, 1, 2]
rotateArray(["apple", "banana", "cherry", "date"], 3); // ["date", "apple", "banana", "cherry"]
rotateArray([1, 2, 3, 4, 5, 6], 4); // [5, 6, 1, 2, 3, 4]
rotateArray([1, 2, 3, 4, 5], 7); // returns [4, 5, 1, 2, 3]

export const rotateArray = (arr, n) => {
  const len = arr.length;
  const steps = n % len;

  return [...arr.slice(steps), ...arr.slice(0, steps)];
};

// rotate an array to the left by k positions:

function rotateArray(array, k) {
  // Check if the array is empty or k is 0
  if (array.length === 0 || k === 0) {
    return array;
  }

  // Calculate the new index of each element
  const newIndex = (index) => (index + k) % array.length;

  // Create a new array to store the rotated elements
  const rotatedArray = new Array(array.length);

  // Iterate over the original array and populate the rotated array
  for (let i = 0; i < array.length; i++) {
    rotatedArray[newIndex(i)] = array[i];
  }

  // Return the rotated array
  return rotatedArray;
}

// Example usage:
const array = [1, 2, 3, 4, 5];
const rotatedArray = rotateArray(array, 2);

console.log(rotatedArray); // [3, 4, 5, 1, 2]