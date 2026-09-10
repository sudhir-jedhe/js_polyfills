/**
 * Best Time to Buy and Sell Stock with Cooldown (LeetCode 309).
 *
 * After selling you must wait one day before buying again. Three states:
 *   held    — holding a share
 *   sold    — sold today (cooldown tomorrow)
 *   rest    — free to buy tomorrow
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {number[]} prices
 * @returns {number} maximum profit
 */
function maxProfitWithCooldown(prices) {
  if (prices.length < 2) return 0;

  let held = -prices[0]; // bought on day 0
  let sold = -Infinity;  // impossible on day 0
  let rest = 0;          // did nothing

  for (let i = 1; i < prices.length; i++) {
    const prevHeld = held;
    const prevSold = sold;
    const prevRest = rest;

    held = Math.max(prevHeld, prevRest - prices[i]); // keep, or buy from rest
    sold = prevHeld + prices[i];                     // sell what we held
    rest = Math.max(prevRest, prevSold);             // cooldown finishes here
  }

  return Math.max(sold, rest); // never end holding a share
}

/** Unlimited transactions, no cooldown (LeetCode 122) — take every rise. */
function maxProfitUnlimited(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}

/** A single transaction (LeetCode 121) — track the lowest price so far. */
function maxProfitSingle(prices) {
  let lowest = Infinity;
  let best = 0;

  for (const price of prices) {
    lowest = Math.min(lowest, price);
    best = Math.max(best, price - lowest);
  }

  return best;
}

/** With a fixed transaction fee (LeetCode 714). */
function maxProfitWithFee(prices, fee) {
  let cash = 0;
  let hold = -prices[0];

  for (let i = 1; i < prices.length; i++) {
    cash = Math.max(cash, hold + prices[i] - fee);
    hold = Math.max(hold, cash - prices[i]);
  }

  return cash;
}

/** At most k transactions (LeetCode 188). */
function maxProfitK(prices, k) {
  if (!prices.length || k === 0) return 0;

  // With k that large, it is the unlimited problem.
  if (k >= prices.length / 2) return maxProfitUnlimited(prices);

  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  for (const price of prices) {
    for (let t = 1; t <= k; t++) {
      buy[t] = Math.max(buy[t], sell[t - 1] - price);
      sell[t] = Math.max(sell[t], buy[t] + price);
    }
  }

  return sell[k];
}

// ---- Examples ----
console.log(maxProfitWithCooldown([1, 2, 3, 0, 2])); // 3
console.log(maxProfitWithCooldown([1]));             // 0
console.log(maxProfitUnlimited([7, 1, 5, 3, 6, 4])); // 7
console.log(maxProfitSingle([7, 1, 5, 3, 6, 4]));    // 5
console.log(maxProfitWithFee([1, 3, 2, 8, 4, 9], 2));// 8
console.log(maxProfitK([3, 2, 6, 5, 0, 3], 2));      // 7

module.exports = { maxProfitWithCooldown, maxProfitUnlimited, maxProfitSingle, maxProfitWithFee, maxProfitK };
