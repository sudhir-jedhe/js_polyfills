// heightChecker.js
export function heightChecker(heights) {
  // Clone the heights array and sort it in non-decreasing order
  const expectedHeights = [...heights].sort((a, b) => a - b);

  // Compare each height with the corresponding expected height
  let mismatches = 0;
  for (let i = 0; i < heights.length; i++) {
    if (heights[i] !== expectedHeights[i]) {
      mismatches++;
    }
  }

  return mismatches;
}

// main.js
import { heightChecker } from "./heightChecker.js";

const heights1 = [1, 1, 4, 2, 1, 3]; // Expected: 3
const heights2 = [5, 1, 2, 3, 4]; // Expected: 5

console.log(heightChecker(heights1)); // Output: 3
console.log(heightChecker(heights2)); // Output: 5
