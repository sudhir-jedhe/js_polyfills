// maximumProduct.js
export function maximumProduct(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Case 1: Product of the three largest numbers
  const maxProduct1 = nums[n - 1] * nums[n - 2] * nums[n - 3];

  // Case 2: Product of the two smallest numbers and the largest number
  const maxProduct2 = nums[0] * nums[1] * nums[n - 1];

  // Return the maximum of the two cases
  return Math.max(maxProduct1, maxProduct2);
}

// main.js
import { maximumProduct } from "./maximumProduct.js";

const nums = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
console.log(maximumProduct(nums)); // Output: 48
