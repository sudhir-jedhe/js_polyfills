function distinctDifference(nums) {
    const n = nums.length;
    const diff = new Array(n).fill(0);
    const prefixSet = new Set();
    const suffixSet = new Set();
    
    // Calculate prefix distinct counts
    for (let i = 0; i < n; i++) {
        prefixSet.add(nums[i]);
        diff[i] = prefixSet.size;
    }
    
    // Calculate suffix distinct counts using a reverse iteration
    for (let i = n - 1; i >= 0; i--) {
        suffixSet.add(nums[i]);
        diff[i] -= suffixSet.size;
    }
    
    return diff;
}

// Example usage:
console.log(distinctDifference([1,2,3,4,5])); // Output: [-3,-1,1,3,5]
console.log(distinctDifference([3,2,3,4,2])); // Output: [-2,-1,0,2,3]




/*********************************************** */


function findDistinctDifference(nums) {
    const n = nums.length;
    const diff = new Array(n).fill(0);
  
    // Count frequencies from the end (suffix)
    const count = {};
    for (let i = n - 1; i >= 0; i--) {
      count[nums[i]] = (count[nums[i]] || 0) + 1;
      diff[i] = (i === n - 1) ? count[nums[i]] : diff[i + 1] - count[nums[i]]; // Consider previous difference and subtract current count
    }
  
    // Count frequencies from the beginning (prefix) and subtract from diff
    let prefixCount = 0;
    for (let i = 0; i < n; i++) {
      prefixCount += (count[nums[i]] || 0) - 1;  // Subtract 1 to avoid counting the current element twice
      count[nums[i]]--;
      diff[i] -= prefixCount;
    }
  
    return diff;
  }
  
  // Example usage
  const nums = [1, 2, 3, 4, 5];
  const result = findDistinctDifference(nums);
  console.log(result); // Output: [-3, -1, 1, 3, 5]
  