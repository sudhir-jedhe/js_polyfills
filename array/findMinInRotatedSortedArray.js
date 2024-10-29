function findMin(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        // Check if the mid element is greater than the rightmost element
        if (nums[mid] > nums[right]) {
            // Minimum is in the right half
            left = mid + 1;
        } else {
            // Minimum is in the left half (including mid)
            right = mid;
        }
    }

    // When left == right, we've found the minimum
    return nums[left];
}

// Example usage:
const arr = [4, 5, 6, 7, 0, 1, 2];
console.log(findMin(arr)); // Output: 0
