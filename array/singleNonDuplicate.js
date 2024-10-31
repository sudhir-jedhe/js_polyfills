function singleNonDuplicate(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        let mid = left + Math.floor((right - left) / 2);
        
        // Check if mid is even
        if (mid % 2 === 0) {
            if (nums[mid] === nums[mid + 1]) {
                left = mid + 2; // Single element is to the right of mid
            } else {
                right = mid; // Single element is to the left of mid
            }
        } else {
            if (nums[mid] === nums[mid - 1]) {
                left = mid + 1; // Single element is to the right of mid
            } else {
                right = mid - 1; // Single element is to the left of mid
            }
        }
    }
    
    return nums[left];
}

// Example usage:
console.log(singleNonDuplicate([1,1,2,3,3,4,4,8,8])); // Output: 2
console.log(singleNonDuplicate([3,3,7,7,10,11,11])); // Output: 10


/********************************** */

function singleNonDuplicate(nums) {
    let left = 0;
    let right = nums.length - 1;
  
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
  
      // Check if the middle element is paired with its expected neighbor based on its position (even or odd index)
      if (mid % 2 === 0) { // Even index (should be paired with left neighbor)
        if (nums[mid] === nums[mid + 1]) {
          left = mid + 2; // If paired, move left to search the right half
        } else {
          right = mid; // If not paired, the single element is in the left half
        }
      } else { // Odd index (should be paired with right neighbor)
        if (nums[mid] === nums[mid - 1]) {
          left = mid + 1; // If paired, move left to search the right half
        } else {
          right = mid; // If not paired, the single element is in the left half
        }
      }
    }
  
    return nums[left];
  }
  
  // Examples
  console.log(singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])); // Output: 2
  console.log(singleNonDuplicate([3, 3, 7, 7, 10, 11, 11])); // Output: 10