function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;
  }
  return result;
}

const nums = [4, 1, 2, 1, 2];
console.log(singleNumber(nums)); // Output: 4



var singleNumber = function (nums) {
  return nums.reduce((a, b) => a ^ b);
};


function singleNumber(nums) {
  let ans = 0;
  for (let i = 0; i < 32; i++) {
      const count = nums.reduce((r, v) => r + ((v >> i) & 1), 0);
      ans |= count % 3 << i;
  }
  return ans;
}

Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it.

Input: nums = [2,2,3,2]
Output: 3
Example 2:

Input: nums = [0,1,0,1,0,1,99]
Output: 99



var singleNumber = function (nums) {
  const xs = nums.reduce((a, b) => a ^ b);
  const lb = xs & -xs;
  let a = 0;
  for (const x of nums) {
      if (x & lb) {
          a ^= x;
      }
  }
  const b = xs ^ a;
  return [a, b];
};


Example 1:

Input: nums = [1,2,1,3,2,5]
Output: [3,5]
Explanation:  [5, 3] is also a valid answer.
Example 2:

Input: nums = [-1,0]
Output: [-1,0]
Example 3:

Input: nums = [0,1]
Output: [1,0]