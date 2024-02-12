export function findSpecialArray(nums) {
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    if (nums.length - i <= nums[i]) {
      return nums.length - i;
    }
  }

  return -1;
}

import { findSpecialArray } from "./findSpecialArray.js";

const nums1 = [3, 5];
console.log(findSpecialArray(nums1)); // Output: 2

const nums2 = [0, 0];
console.log(findSpecialArray(nums2)); // Output: -1

// finding a special array. An array nums is considered special if there exists
// a number x such that there are exactly x numbers in nums that are greater
// than or equal to x. Your goal is to return x if the array is special,
// otherwise return -1. Keep in mind that x does not have to be an element in
// nums. It is guaranteed that if nums is special, the value for x is unique.

// Input: nums = [3, 5]
// Output: 2
// Explanation: There are 2 values (3 and 5) that are greater than or equal to 2.

// Input: nums = [0, 0]
// Output: -1
// Explanation: No numbers fit the criteria for x.
// If x = 0, there should be 0 numbers >= x, but there are 2.
// If x = 1, there should be 1 number >= x, but there are 0.
// If x = 2, there should be 2 numbers >= x, but there are 0.
// x cannot be greater since there are only 2 numbers in nums.

// Input: nums = [0, 4, 3, 0, 4]
// Output: 3
// Explanation: There are 3 values that are greater than or equal to 3.
