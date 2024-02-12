import { smallerNumbersThanCurrent } from "./smallerNumbersThanCurrent.js";

const nums = [8, 1, 2, 2, 3];
console.log(smallerNumbersThanCurrent(nums)); // Output: [4, 0, 1, 1, 3]

export function smallerNumbersThanCurrent(nums) {
  const counts = [];

  for (let i = 0; i < nums.length; i++) {
    let count = 0;
    for (let j = 0; j < nums.length; j++) {
      if (nums[j] < nums[i]) {
        count++;
      }
    }
    counts.push(count);
  }

  return counts;
}

// creating a function that, given an array nums, determines how many numbers in
// the array are smaller than each element. For each element nums[i], the
// function must count the number of valid j's such that j != i and nums[j] <
// nums[i]. The final output should be an array of the same length, containing
// the counts of smaller numbers for each element.
