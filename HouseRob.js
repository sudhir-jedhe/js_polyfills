// You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

// Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

 

// Example 1:

// Input: nums = [1,2,3,1]
// Output: 4
// Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
// Total amount you can rob = 1 + 3 = 4.
// Example 2:

// Input: nums = [2,7,9,3,1]
// Output: 12
// Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
// Total amount you can rob = 2 + 9 + 1 = 12.

function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let n = nums.length;
    let dp = new Array(n).fill(0);
    
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    
    return dp[n-1];
}

// Example usage:
console.log(rob([1, 2, 3, 1])); // Output: 4
console.log(rob([2, 7, 9, 3, 1])); // Output: 12


/************************************* */

function rob(nums) {
    // Handle edge cases (empty array or single house)
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
  
    // Initialize a DP table to store maximum stolen money at each house
    const dp = new Array(nums.length).fill(0);
  
    // Base cases
    dp[0] = nums[0]; // Maximum at first house is its value
    dp[1] = Math.max(nums[0], nums[1]); // Choose the higher value between first two houses
  
    // Fill the DP table using the recurrence relation
    for (let i = 2; i < nums.length; i++) {
      dp[i] = Math.max(nums[i] + dp[i - 2], dp[i - 1]); // Consider robbing current or skipping
    }
  
    // Return the maximum stolen money (last element in DP table)
    return dp[nums.length - 1];
  }
  
  // Examples (without promoting illegal activity)
  console.log(rob([1, 2, 3, 1])); // Output: 4 (Explanation provided previously)
  console.log(rob([2, 7, 9, 3, 1])); // Output: 12 (Explanation provided previously)
  