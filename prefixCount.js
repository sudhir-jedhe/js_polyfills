export function prefixCount(words, pref) {
  let count = 0;
  for (const word of words) {
    if (word.startsWith(pref)) {
      count++;
    }
  }
  return count;
}

import { prefixCount } from "./prefixCount.js";

const words = ["apple", "banana", "apricot", "pineapple"];
const pref = "ap";
console.log(prefixCount(words, pref)); // Output: 3
