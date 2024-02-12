function getMinDistance(nums, target, start) {
  let minDistance = Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      const distance = Math.abs(i - start);
      minDistance = Math.min(minDistance, distance);
    }
  }

  return minDistance;
}

console.log(getMinDistance([1, 2, 3, 4, 5], 5, 3)); // Output: 1
console.log(getMinDistance([1, 2, 3, 4, 5], 5, 4)); // Output: 0
console.log(getMinDistance([1, 2, 3, 1, 1, 4, 5], 1, 3)); // Output: 0

// Example 1:

// Input: nums = [1,2,3,4,5], target = 5, start = 3 Output: 1 Explanation:
// nums[4] = 5 is the only value equal to target, so the answer is abs(4 - 3) =
// 1.

// Example 2:

// Input: nums = [1], target = 1, start = 0 Output: 0 Explanation: nums[0] = 1
// is the only value equal to target, so the answer is abs(0 - 0) = 0.

// Example 3:

// Input: nums = [1,1,1,1,1,1,1,1,1,1], target = 1, start = 0 Output: 0
// Explanation: Every value of nums is 1, but nums[0] minimizes abs(i - start),
// which is abs(0 - 0) = 0.
