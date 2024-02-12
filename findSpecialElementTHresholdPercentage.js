export function findSpecialElement(arr) {
  const threshold = arr.length / 4;
  let count = 1;
  let current = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === current) {
      count++;
      if (count > threshold) {
        return current;
      }
    } else {
      current = arr[i];
      count = 1;
    }
  }

  return null; // This line should never be reached for a valid input
}

import { findSpecialElement } from "./findSpecialElement.js";

const arr = [1, 1, 1, 2, 2, 3, 4, 4, 4, 4, 4];
console.log(findSpecialElement(arr)); // Output: 4  appear mor than 25%

// Example 1:

// Input: arr = [1, 2, 2, 6, 6, 6, 6, 7, 10] Output: 6

// Example 2:

// Input: arr = [1, 1] Output: 1
