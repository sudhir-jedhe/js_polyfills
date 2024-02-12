export function oddCells(m, n, indices) {
  const rowCounts = new Array(m).fill(0); // Initialize an array to store the count of increments in each row
  const colCounts = new Array(n).fill(0); // Initialize an array to store the count of increments in each column

  // Iterate through the indices and increment the counts for rows and columns
  for (const [ri, ci] of indices) {
    rowCounts[ri]++;
    colCounts[ci]++;
  }

  let oddCount = 0;

  // Iterate through the matrix and count the number of odd-valued cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const totalCount = rowCounts[i] + colCounts[j];
      if (totalCount % 2 !== 0) {
        oddCount++;
      }
    }
  }

  return oddCount;
}

import { oddCells } from "./oddCells.js";

const m = 2;
const n = 3;
const indices = [
  [0, 1],
  [1, 1],
];
console.log(oddCells(m, n, indices)); // Output: 6

// Input: m = 2, n = 3, indices = [[0,1],[1,1]] Output: 6 Explanation:

// Initial matrix = [[0,0,0],[0,0,0]]. After applying first increment it becomes
// [[1,2,1],[0,1,0]]. The final matrix is [[1,3,1],[1,3,1]], which contains 6
// odd numbers.

// Example 2:

// Input: m = 2, n = 2, indices = [[1,1],[0,0]] Output: 0 Explanation:

// Final matrix = [[2,2],[2,2]]. There are no odd numbers in the final matrix.
