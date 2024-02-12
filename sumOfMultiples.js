export function sumOfMultiples(n) {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 || i % 5 === 0 || i % 7 === 0) {
      sum += i;
    }
  }

  return sum;
}

import { sumOfMultiples } from "./sumOfMultiples.js";

const n = 20;
console.log(sumOfMultiples(n)); // Output: 98 (3 + 5 + 6 + 7 + 9 + 10 + 12 + 14 + 15 + 18 + 20)
