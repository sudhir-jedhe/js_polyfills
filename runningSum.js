// runningSum.js
export function runningSum(nums) {
  const runningSumArray = [];
  let sum = 0;
  for (const num of nums) {
    sum += num;
    runningSumArray.push(sum);
  }
  return runningSumArray;
}

// main.js
import { runningSum } from "./runningSum.js";

const nums = [1, 2, 3, 4, 5];

console.log(runningSum(nums)); // Output: [1, 3, 6, 10, 15]



/************************* */

function runningSum(nums) {
  let sum = 0;
  return nums.map(num => sum += num);
}

// Test cases
console.log(runningSum([1, 2, 3, 4])); // Output: [1, 3, 6, 10]
console.log(runningSum([1, 1, 1, 1, 1])); // Output: [1, 2, 3, 4, 5]
console.log(runningSum([3, 1, 2, 10, 1])); // Output: [3, 4, 6, 16, 17]
