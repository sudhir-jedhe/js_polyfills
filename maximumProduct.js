import { maximumProduct } from "./maximumProduct.js";

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

const nums = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
console.log(maximumProduct(nums)); // Output: 48


/****************************************** */

function maxProduct(nums) {
  if (nums.length === 0) return 0;

  let maxProduct = nums[0];
  let minProduct = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
      if (nums[i] < 0) {
          // Swap max and min when the current number is negative
          [maxProduct, minProduct] = [minProduct, maxProduct];
      }

      maxProduct = Math.max(nums[i], maxProduct * nums[i]);
      minProduct = Math.min(nums[i], minProduct * nums[i]);

      result = Math.max(result, maxProduct);
  }

  return result;
}

// Example usage:
const arr = [2, 3, -2, 4];
console.log(maxProduct(arr)); // Output: 6 (the subarray [2, 3])
