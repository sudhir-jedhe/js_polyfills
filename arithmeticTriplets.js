// In this lab, you will implement a function arithmeticTriplets(nums: number[],
// diff: number): number that returns the number of unique arithmetic triplets.
// Your input will be a 0-indexed, strictly increasing integer array nums and a
// positive integer diff. A triplet (i, j, k) is an arithmetic triplet if the
// following conditions are met:

// i < j < k nums[j] - nums[i] == diff nums[k] - nums[j] == diff Your task is to
// return the number of unique arithmetic triplets.

// Example:

// arithmeticTriplets([0,1,4,6,7,10], 3) // Output: 2 // Explanation: (1, 2, 4)
// and (2, 4, 5) are arithmetic triplets.

// arithmeticTriplets([4,5,6,7,8,9], 2) // Output: 2

export function arithmeticTriplets(nums: number[], diff: number): number {
  const numSet = new Set(nums);
  let count = 0;

  for (let i = 0; i < nums.length - 2; i++) {
    const currentNum = nums[i];
    if (numSet.has(currentNum + diff) && numSet.has(currentNum + 2 * diff)) {
      count++;
    }
  }

  return count;
}

import { arithmeticTriplets } from "./arithmeticTriplets";

const nums = [1, 3, 5, 7, 9];
const diff = 2;
console.log(arithmeticTriplets(nums, diff)); // Output: 2
