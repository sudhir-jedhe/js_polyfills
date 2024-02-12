// duplicateZeros.js
export function duplicateZeros(arr) {
  const n = arr.length;
  let i = 0;

  while (i < n) {
    if (arr[i] === 0) {
      arr.splice(i, 0, 0); // Insert a zero at index i
      arr.pop(); // Remove the last element to keep the array length unchanged
      i += 2; // Skip the duplicated zero and move to the next element
    } else {
      i++; // Move to the next element
    }
  }
}

// main.js
import { duplicateZeros } from "./duplicateZeros.js";

const arr = [1, 0, 2, 3, 0, 4, 5, 0];
duplicateZeros(arr);
console.log(arr); // Output: [1, 0, 0, 2, 3, 0, 0, 4]
