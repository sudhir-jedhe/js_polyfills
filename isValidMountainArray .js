// isValidMountainArray.js
export function isValidMountainArray(arr) {
  const n = arr.length;
  let i = 0;

  // Check increasing slope
  while (i + 1 < n && arr[i] < arr[i + 1]) {
    i++;
  }

  // Peak can't be at the beginning or end
  if (i === 0 || i === n - 1) {
    return false;
  }

  // Check decreasing slope
  while (i + 1 < n && arr[i] > arr[i + 1]) {
    i++;
  }

  return i === n - 1;
}

// main.js
import { isValidMountainArray } from "./isValidMountainArray.js";

const arr1 = [2, 1]; // Not a valid mountain array
const arr2 = [3, 5, 5]; // Not a valid mountain array
const arr3 = [0, 3, 2, 1]; // Valid mountain array

console.log(isValidMountainArray(arr1)); // Output: false
console.log(isValidMountainArray(arr2)); // Output: false
console.log(isValidMountainArray(arr3)); // Output: true
