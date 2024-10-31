// Ques 5 - Best Time to Buy and Sell Stocks
// You are given an array prices where prices[i] is the price of a given stock
// on the ith day.
// You want to maximize your profit by choosing a single day to buy one stock
// and choosing a different day in the future to sell that stock.
// Return the maximum profit, If you cannot achieve any profit, return 0.

// Input: prices = [7, 1, 5, 3, 6, 4];  ----->>>>>  Output: 5;
// Input: prices = [7, 6, 4, 3, 1];     ----->>>>>  Output: 0;

// Brute Force Solution
function maxProfit1(prices) {
  let globalProfit = 0;

  for (let i = 0; i < prices.length - 1; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const currentProfit = prices[j] - prices[i];

      if (currentProfit > globalProfit) globalProfit = currentProfit;
    }
  }

  return globalProfit;
}

// console.log(maxProfit1([7, 6, 4, 3, 1]));

// Greedy Algorithm
const maxProfit = function (prices) {
  let minStockPurchasePrice = prices[0] || 0;
  let profit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < minStockPurchasePrice) {
      minStockPurchasePrice = prices[i];
    }

    profit = Math.max(profit, prices[i] - minStockPurchasePrice);
  }

  return profit;
};

console.log(maxProfit([7, 6, 4, 3, 1]));

// [7, 1, 5, 3, 6, 4]
// min = 7 => 1
// profit = 0 => 5-1 = 4 => 6-1 = 5


/*************************************** */

function maxProfit(prices) {
  let minPrice = Infinity; // Initialize minimum price to positive infinity
  let maxProfit = 0;

  for (let price of prices) {
    // Update minimum price if a lower price is encountered
    minPrice = Math.min(minPrice, price);
    // Calculate profit for the current price and update maxProfit if higher
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}

// Examples
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // Output: 5 (Buy at 1, Sell at 6)
console.log(maxProfit([7, 6, 4, 3, 1])); // Output: 0 (No profit possible)


/****************************** */

function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (let i = 0; i < prices.length; i++) {
      if (prices[i] < minPrice) {
          minPrice = prices[i];
      } else if (prices[i] - minPrice > maxProfit) {
          maxProfit = prices[i] - minPrice;
      }
  }
  
  return maxProfit;
}

// Example usage:
console.log(maxProfit([7,1,5,3,6,4])); // Output: 5 (Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5)
console.log(maxProfit([7,6,4,3,1])); // Output: 0 (No transaction as prices are decreasing)
