```js
export function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const transposed = [];
  for (let i = 0; i < cols; i++) {
    transposed[i] = [];
    for (let j = 0; j < rows; j++) {
      transposed[i][j] = matrix[j][i];
    }
  }

  return transposed;
}

import { transpose } from "./transpose.js";

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(transpose(matrix));

// [
//   [1, 4, 7],
//   [2, 5, 8],
//   [3, 6, 9],
// ];
```