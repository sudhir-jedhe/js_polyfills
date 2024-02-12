// createTargetArray.js
export function createTargetArray(nums, index) {
  const target = [];
  for (let i = 0; i < nums.length; i++) {
    target.splice(index[i], 0, nums[i]);
  }
  return target;
}

// main.js
import { createTargetArray } from "./createTargetArray.js";

const nums = [0, 1, 2, 3, 4];
const index = [0, 1, 2, 2, 1];

console.log(createTargetArray(nums, index)); // Output: [0, 4, 1, 3, 2]

// In this lab, you are given two arrays of integers nums and index. Your task
// is to create a target array under the following rules:

// Initially, the target array is empty. From left to right, read nums[i] and
// index[i], insert at index index[i] the value nums[i] in the target array.
// Repeat the previous step until there are no elements to read in nums and
// index. Return the target array. It is guaranteed that the insertion
// operations will be valid.

// Examples
// Example 1:

// Input: nums = [0,1,2,3,4], index = [0,1,2,2,1] Output: [0,4,1,3,2] Explanation:

// nums       index     target
// 0            0        [0]
// 1            1        [0,1]
// 2            2        [0,1,2]
// 3            2        [0,1,3,2]
// 4            1        [0,4,1,3,2]
// Example 2:

// Input: nums = [1,2,3,4,0], index = [0,1,2,3,0] Output: [0,1,2,3,4] Explanation:

// nums       index     target
// 1            0        [1]
// 2            1        [1,2]
// 3            2        [1,2,3]
// 4            3        [1,2,3,4]
// 0            0        [0,1,2,3,4]
// Example 3:

// Input: nums = [1], index = [0] Output: [1]
