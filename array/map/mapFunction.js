export function map(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i));
  }
  return result;
}

import { map } from "./map.js";

const arr = [1, 2, 3, 4, 5];
const fn = (num, index) => num * index;
console.log(map(arr, fn)); // Output: [0, 2, 6, 12, 20]
