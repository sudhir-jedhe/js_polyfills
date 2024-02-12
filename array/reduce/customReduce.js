export function customReduce(nums, fn, init) {
  let result = init;

  for (let num of nums) {
    result = fn(result, num);
  }

  return result;
}

import { customReduce } from "./customReduce.js";

const nums = [1, 2, 3, 4, 5];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const initialValue = 0;

console.log(customReduce(nums, reducer, initialValue)); // Output: 15
