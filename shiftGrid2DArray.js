// shiftGrid.js
export function shiftGrid(grid, k) {
  const m = grid.length;
  const n = grid[0].length;
  const flatGrid = grid.flat();
  const shiftedFlatGrid = [];

  // Calculate the effective number of shifts
  k %= flatGrid.length;

  // Shift the elements to the right
  for (let i = flatGrid.length - k; i < flatGrid.length; i++) {
    shiftedFlatGrid.push(flatGrid[i]);
  }
  for (let i = 0; i < flatGrid.length - k; i++) {
    shiftedFlatGrid.push(flatGrid[i]);
  }

  // Convert the flat shifted array back to a 2D grid
  const shiftedGrid = [];
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(shiftedFlatGrid[i * n + j]);
    }
    shiftedGrid.push(row);
  }

  return shiftedGrid;
}

// main.js
import { shiftGrid } from "./shiftGrid.js";

const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const k = 1;

console.log(shiftGrid(grid, k)); // Output: [[9,1,2],[3,4,5],[6,7,8]]
