export function chunkArray(arr, size) {
  const chunks = [];
  let index = 0;

  while (index < arr.length) {
    chunks.push(arr.slice(index, index + size));
    index += size;
  }

  return chunks;
}

import { chunkArray } from "./chunkArray.js";

const arr = [1, 2, 3, 4, 5, 6, 7, 8];
const size = 3;
console.log(chunkArray(arr, size)); // Output: [[1, 2, 3], [4, 5, 6], [7, 8]]
