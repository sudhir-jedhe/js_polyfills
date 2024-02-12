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
