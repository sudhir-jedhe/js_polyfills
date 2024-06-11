function findFinalValue(nums, original) {
    return nums.reduce((accumulator, currentValue) => {
      if (currentValue === accumulator) {
        accumulator *= 2;
      }
      return accumulator;
    }, original);
  }


//   In this lab, you will implement a function that takes an array of integers nums and an integer original. The main goal of this lab is to find and multiply the given original value by two each time it's found in the nums array. You need to follow the steps below:

// If original is found in nums, multiply it by two (i.e., set original = 2 * original).
// Otherwise, stop the process.
// Repeat this process with the new number as long as you keep finding the number.
// The function should return the final value of original.

// Examples
// Example 1:

// Input: nums = [5,3,6,1,12], original = 3 Output: 24 Explanation:

// 3 is found in nums. 3 is multiplied by 2 to obtain 6.
// 6 is found in nums. 6 is multiplied by 2 to obtain 12.
// 12 is found in nums. 12 is multiplied by 2 to obtain 24.
// 24 is not found in nums. Thus, 24 is returned.
// Example 2:

// Input: nums = [2,7,9], original = 4 Output: 4 Explanation:

// 4 is not found in nums. Thus, 4 is returned.