export function sumOddLengthSubarrays(arr: number[]): number {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    let left = i,
      right = i,
      windowSum = 0;

    while (left >= 0 && right < arr.length) {
      windowSum += arr[left] + arr[right];
      if (right - left + (1 % 2) === 1) {
        sum += windowSum;
      }
      left--;
      right++;
    }
  }

  return sum;
}

import { sumOddLengthSubarrays } from "./sumOddLengthSubarrays";

const arr = [1, 4, 2, 5, 3];
console.log(sumOddLengthSubarrays(arr)); // Output: 58
