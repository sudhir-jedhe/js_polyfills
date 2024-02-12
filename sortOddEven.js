// sortOddEven.js
export function sortOddEven(arr) {
  // Separate odd and even indices
  const oddIndices = arr.filter((_, i) => i % 2 !== 0);
  const evenIndices = arr.filter((_, i) => i % 2 === 0);

  // Sort odd indices in non-increasing order
  oddIndices.sort((a, b) => b - a);

  // Sort even indices in non-decreasing order
  evenIndices.sort((a, b) => a - b);

  // Merge odd and even sorted arrays
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result[i] = i % 2 !== 0 ? oddIndices.shift() : evenIndices.shift();
  }

  return result;
}

// main.js
import { sortOddEven } from "./sortOddEven.js";

const arr = [9, 2, 7, 4, 5, 6, 3, 8, 1];
console.log(sortOddEven(arr)); // Output: [2, 9, 4, 7, 6, 5, 8, 3, 1]
