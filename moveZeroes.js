function moveZeroes(nums) {
    let nonZeroPointer = 0;

    // Move non-zero elements to the beginning of the array
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[nonZeroPointer] = nums[i];
            nonZeroPointer++;
        }
    }

    // Fill the remaining elements with zeroes
    for (let i = nonZeroPointer; i < nums.length; i++) {
        nums[i] = 0;
    }

    return nums;
}

// Test cases
console.log(moveZeroes([0,1,0,3,12])); // Output: [1,3,12,0,0]
console.log(moveZeroes([1,0,0,4,5])); // Output: [1,4,5,0,0]
console.log(moveZeroes([0])); // Output: [0]
