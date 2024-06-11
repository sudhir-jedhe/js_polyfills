function minOperationsToMakeZero(nums) {
    let minNonZero = Infinity;

    // Find the smallest non-zero element
    for (const num of nums) {
        if (num !== 0 && num < minNonZero) {
            minNonZero = num;
        }
    }

    let operations = 0;

    // Perform operations until all elements are zero
    while (minNonZero !== Infinity) {
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] !== 0) {
                nums[i] -= minNonZero;
            }
        }
        operations++;
        
        minNonZero = Infinity;
        // Find the new smallest non-zero element
        for (const num of nums) {
            if (num !== 0 && num < minNonZero) {
                minNonZero = num;
            }
        }
    }

    return operations;
}

// Test cases
console.log(minOperationsToMakeZero([1, 5, 0, 3, 5])); // Output: 3
console.log(minOperationsToMakeZero([0])); // Output: 0
