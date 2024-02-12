// Example 1:

// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
// Example 2:

// Input: nums = [3,2,4], target = 6
// Output: [1,2]
// Example 3:

// Input: nums = [3,3], target = 6
// Output: [0,1]

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  let first, second;
  // second  = target - fisrt;
  // check whether second no present in array
  // if present index

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
};

/*********************************** */
export const twoSum = (nums, target) => {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
};

/*************************************** */
export const twoSum = (nums, target) => {
  const sortedNums = nums.slice().sort((a, b) => a - b);
  let left = 0,
    right = sortedNums.length - 1;

  while (left < right) {
    const sum = sortedNums[left] + sortedNums[right];

    if (sum === target) {
      const index1 = nums.indexOf(sortedNums[left]);
      const index2 = nums.indexOf(sortedNums[right], index1 + 1);
      return [index1, index2];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
};
