// generatePascalsTriangle.js
export function generatePascalsTriangle(numRows) {
  const triangle = [];

  // Base case: first row containing 1
  triangle.push([1]);

  for (let i = 1; i < numRows; i++) {
    const row = [];
    const prevRow = triangle[i - 1];

    // The first and last element of each row is always 1
    row.push(1);

    // Calculate the values based on the previous row
    for (let j = 1; j < i; j++) {
      row.push(prevRow[j - 1] + prevRow[j]);
    }

    row.push(1); // Last element of the row is always 1
    triangle.push(row);
  }

  return triangle;
}

// main.js
import { generatePascalsTriangle } from "./generatePascalsTriangle.js";

const numRows = 5;

console.log(generatePascalsTriangle(numRows));

/****************************************** */

function getRow(rowIndex) {
  let row = [1]; // Initialize the first row
  for (let i = 1; i <= rowIndex; i++) {
    const newRow = [];
    newRow.push(1); // First element of each row is always 1
    for (let j = 1; j < row.length; j++) {
      newRow.push(row[j - 1] + row[j]); // Calculate each element based on the previous row
    }
    newRow.push(1); // Last element of each row is always 1
    row = newRow; // Update the current row
  }
  return row;
}

console.log(getRow(3)); // Output: [1, 3, 3, 1] (4th row of Pascal's Triangle)
console.log(getRow(5)); // Output: [1, 5, 10, 10, 5, 1] (6th row of Pascal's Triangle)


/******************************** */

var generate = function (numRows) {
  const f = [[1]];
  for (let i = 0; i < numRows - 1; ++i) {
      const g = [1];
      for (let j = 0; j < f[i].length - 1; ++j) {
          g.push(f[i][j] + f[i][j + 1]);
      }
      g.push(1);
      f.push(g);
  }
  return f;
};


Input: numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
Example 2:

Input: numRows = 1
Output: [[1]]


function getRow(rowIndex: number): number[] {
  const f: number[] = Array(rowIndex + 1).fill(1);
  for (let i = 2; i < rowIndex + 1; ++i) {
      for (let j = i - 1; j; --j) {
          f[j] += f[j - 1];
      }
  }
  return f;
}