export function isValidMatrix(matrix) {
  const n = matrix.length;

  // Check rows
  for (let i = 0; i < n; i++) {
    const rowSet = new Set(matrix[i]);
    if (rowSet.size !== n) {
      return false;
    }
  }

  // Check columns
  for (let j = 0; j < n; j++) {
    const colSet = new Set();
    for (let i = 0; i < n; i++) {
      colSet.add(matrix[i][j]);
    }
    if (colSet.size !== n) {
      return false;
    }
  }

  return true;
}

import { isValidMatrix } from "./isValidMatrix.js";

const matrix = [
  [1, 2, 3],
  [2, 3, 1],
  [3, 1, 2],
];
console.log(isValidMatrix(matrix)); // Output: true
