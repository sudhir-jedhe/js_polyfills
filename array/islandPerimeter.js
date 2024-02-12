export function islandPerimeter(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let landCount = 0;
  let neighborCount = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        landCount++;
        if (i > 0 && grid[i - 1][j] === 1) {
          neighborCount++; // Check top neighbor
        }
        if (i < rows - 1 && grid[i + 1][j] === 1) {
          neighborCount++; // Check bottom neighbor
        }
        if (j > 0 && grid[i][j - 1] === 1) {
          neighborCount++; // Check left neighbor
        }
        if (j < cols - 1 && grid[i][j + 1] === 1) {
          neighborCount++; // Check right neighbor
        }
      }
    }
  }

  return landCount * 4 - neighborCount;
}

import { islandPerimeter } from "./islandPerimeter.js";

const grid = [
  [0, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 0, 0],
  [1, 1, 0, 0],
];
console.log(islandPerimeter(grid)); // Output: 16

// you are given a row x col grid representing a map where grid[i][j] = 1
// represents land and grid[i][j] = 0 represents water. Your task is to
// determine the perimeter of the island.

// The grid cells are connected horizontally or vertically (not diagonally). The
// grid is completely surrounded by water, and there is exactly one island
// (i.e., one or more connected land cells).

// The island doesn't have "lakes", meaning the water inside isn't connected to
// the water around the island. One cell is a square with side length 1. The
// grid is rectangular, width and height don't exceed 100.

// Examples Example 1:

// Island example

// Input: grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]] Output: 16

// In this example, the perimeter is formed by the 16 yellow stripes in the
// image above.

// Example 2:

// Input: grid = [[1]] Output: 4

// This island consists of a single land cell, and its perimeter is 4.

// Example 3:

// Input: grid = [[1,0]] Output: 4

// In this case, the island consists of a single land cell, and the perimeter is
// still 4.
