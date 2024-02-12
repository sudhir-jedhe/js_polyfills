import NumArray from "./index.js";

const numArray = new NumArray([-2, 0, 3, -5, 2, -1]);

console.log(numArray.sumRange(0, 2)); // return (-2) + 0 + 3 = 1
console.log(numArray.sumRange(2, 5)); // return 3 + (-5) + 2 + (-1) = -1
console.log(numArray.sumRange(0, 5)); // return (-2) + 0 + 3 + (-5) + 2 + (-1) = -3

class NumArray {
  constructor(nums) {
    this.prefixSum = [0]; // Initialize prefix sum array with a zero at the beginning

    // Calculate prefix sum
    for (let i = 0; i < nums.length; i++) {
      this.prefixSum[i + 1] = this.prefixSum[i] + nums[i];
    }
  }

  sumRange(left, right) {
    return this.prefixSum[right + 1] - this.prefixSum[left]; // Calculate sum using prefix sum
  }
}

const nums = [-2, 0, 3, -5, 2, -1];
const obj = new NumArray(nums);
console.log(obj.sumRange(0, 2)); // Output: 1
console.log(obj.sumRange(2, 5)); // Output: -1
console.log(obj.sumRange(0, 5)); // Output: -3
