export function findTargetIndices(nums, target) {
  const sortedIndices = nums
    .map((num, index) => [num, index]) // Map each number to its original index
    .sort((a, b) => a[0] - b[0]) // Sort the array of [num, index] pairs based on the numbers
    .filter(([num, index]) => num === target) // Filter out pairs where the number is equal to the target
    .map(([num, index]) => index); // Map the filtered pairs to their indices

  return sortedIndices;
}

import { findTargetIndices } from "./targetIndices.js";

const nums = [5, 2, 7, 5, 9, 2, 3, 5];
const target = 5;
console.log(findTargetIndices(nums, target)); // Output: [0, 3, 7]

// nums = [1,2,5,2,3], target = 2 Output: [1,2] Explanation: After sorting, nums
// is [1,2,2,3,5]. The indices where nums[i] == 2 are 1 and 2.

// nums = [1,2,5,2,3], target = 3 Output: [3] Explanation: After sorting, nums
// is [1,2,2,3,5]. The index where nums[i] == 3 is 3.

// nums = [1,2,5,2,3], target = 5 Output: [4] Explanation: After sorting, nums
// is [1,2,2,3,5]. The index where nums[i] == 5 is 4.
