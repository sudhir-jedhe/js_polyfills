function longestIncreasingSubsequence(nums) {
    if (!nums.length) return 0; // Empty array has LIS of length 0
  
    const dp = new Array(nums.length).fill(1); // Initialize DP table with 1s (LIS ending at each index)
  
    for (let i = 1; i < nums.length; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[i] > nums[j]) {
          dp[i] = Math.max(dp[i], dp[j] + 1); // Consider including current element if it's increasing
        }
      }
    }
  
    // Maximum value in DP table represents LIS length
    return Math.max(...dp);
  }
  
  // Examples
  console.log(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18])); // Output: 4
  console.log(longestIncreasingSubsequence([0, 1, 0, 3, 2, 3])); // Output: 4
  console.log(longestIncreasingSubsequence([7, 7, 7, 7, 7, 7, 7])); // Output: 1
  

  /******************** */


  function longestIncreasingSubsequence(nums) {
    if (nums.length === 0) return [];
    
    const dp = new Array(nums.length).fill(1);
    const sequences = new Array(nums.length).fill(null).map(() => []);
    let maxLength = 1;
    let endIndex = 0;
    
    for (let i = 0; i < nums.length; i++) {
        sequences[i].push(nums[i]);
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
                sequences[i] = [...sequences[j], nums[i]];
            }
        }
        if (dp[i] > maxLength) {
            maxLength = dp[i];
            endIndex = i;
        }
    }
    
    return sequences[endIndex];
}

// Example usage:
console.log(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18])); // Output: [2, 3, 7, 101]
console.log(longestIncreasingSubsequence([0, 1, 0, 3, 2, 3])); // Output: [0, 1, 2, 3]
console.log(longestIncreasingSubsequence([7, 7, 7, 7, 7, 7, 7])); // Output: [7]
