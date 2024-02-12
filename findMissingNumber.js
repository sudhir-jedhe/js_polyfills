export function findMissingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}

import { findMissingNumber } from "./findMissingNumber.js";

const nums = [3, 0, 1];
console.log(findMissingNumber(nums)); // Output: 2

missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]); // 8
