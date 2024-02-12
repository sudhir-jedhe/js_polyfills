export function canThreePartsEqualSum(arr) {
  const totalSum = arr.reduce((acc, curr) => acc + curr, 0);
  if (totalSum % 3 !== 0) {
    return false; // Total sum is not divisible by 3
  }

  const targetSum = totalSum / 3;
  let sum = 0;
  let count = 0;

  for (const num of arr) {
    sum += num;
    if (sum === targetSum) {
      count++;
      sum = 0;
    }
  }

  return count >= 3;
}

import { canThreePartsEqualSum } from "./canThreePartsEqualSum.js";

const arr1 = [0, 2, 1, -6, 6, -7, 9, 1, 2, 0, 1];
console.log(canThreePartsEqualSum(arr1)); // Output: true

const arr2 = [0, 2, 1, -6, 6, 7, 9, -1, 2, 0, 1];
console.log(canThreePartsEqualSum(arr2)); // Output: false
