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


function findMissingElements(arr) {
  const fullSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const givenSet = new Set(arr);

  const missingElements = [];
  for (let num of fullSet) {
    if (!givenSet.has(num)) {
      missingElements.push(num);
    }
  }

  return missingElements;
}

// Example usage:
const arr = [1, 2, 4, 6, 7, 10];
const missing = findMissingElements(arr);
console.log("Missing elements:", missing); // Output: [3, 5, 8, 9]
