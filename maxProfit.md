// maxProfit.js
export function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price); // Update minimum price
    maxProfit = Math.max(maxProfit, price - minPrice); // Update maximum profit
  }

  return maxProfit;
}

// main.js
import { maxProfit } from "./maxProfit.js";

const prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(prices)); // Output: 5

// Example 1:

// Input: prices = [7,1,5,3,6,4] Output: 5 Explanation: Buy on day 2 (price = 1)
// and sell on day 5 (price = 6), profit = 6-1 = 5.

// Note that buying on day 2 and selling on day 1 is not allowed because you
// must buy before you sell.

// Example 2:

// Input: prices = [7,6,4,3,1] Output: 0 Explanation: In this case, no
// transactions are done and the max profit = 0.

// Example 3:

// Input: prices = [3,3,5,0,0,3,1,4] Output: 4 Explanation: Buy on day 4 (price
// = 0) and sell on day 8 (price = 4), profit = 4-0 = 4. This is the maximum
// profit we can achieve.
