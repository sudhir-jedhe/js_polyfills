// disappearedNumbers.js
export function findDisappearedNumbers(nums) {
  const n = nums.length;
  const result = [];

  // Mark numbers as visited
  for (const num of nums) {
    const index = Math.abs(num) - 1;
    if (nums[index] > 0) {
      nums[index] = -nums[index];
    }
  }

  // Find unvisited numbers
  for (let i = 0; i < n; i++) {
    if (nums[i] > 0) {
      result.push(i + 1);
    }
  }

  return result;
}

// main.js
import { findDisappearedNumbers } from "./disappearedNumbers.js";

const nums = [4, 3, 2, 7, 8, 2, 3, 1];
console.log(findDisappearedNumbers(nums)); // Output: [5, 6]
