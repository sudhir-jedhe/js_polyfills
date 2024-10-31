// There is an integer array nums sorted in ascending order (with distinct values).

// Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].

// Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

// You must write an algorithm with O(log n) runtime complexity.

 

// Example 1:

// Input: nums = [4,5,6,7,0,1,2], target = 0
// Output: 4
// Example 2:

// Input: nums = [4,5,6,7,0,1,2], target = 3
// Output: -1
// Example 3:

// Input: nums = [1], target = 0
// Output: -1


function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}

// Examples
console.log(search([4,5,6,7,0,1,2], 0)); // Output: 4
console.log(search([4,5,6,7,0,1,2], 3)); // Output: -1
console.log(search([1], 0)); // Output: -1


/******************************************* */


function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
  
      // If the target is found at the middle element
      if (nums[mid] === target) {
        return mid;
      }
  
      // Check if the left half is sorted (based on the first and middle elements)
      if (nums[left] <= nums[mid]) {
        // If the target is within the sorted left half
        if (target >= nums[left] && target < nums[mid]) {
          right = mid - 1;
        } else {
          // Search in the unsorted right half
          left = mid + 1;
        }
      } else {
        // Check if the right half is sorted (based on the middle and last elements)
        if (target > nums[mid] && target <= nums[right]) {
          left = mid + 1;
        } else {
          // Search in the unsorted left half
          right = mid - 1;
        }
      }
    }
  
    // Target not found
    return -1;
  }
  
  // Examples
  console.log(search([4, 5, 6, 7, 0, 1, 2], 4)); // Output: 0
  console.log(search([4, 5, 6, 7, 0, 1, 2], 8)); // Output: -1 (not found)
  console.log(search([1], 1)); // Output: 0
  