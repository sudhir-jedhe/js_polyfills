function splitArray(nums) {
    const freq = new Map();
    for (let num of nums) {
        if (!freq.has(num)) {
            freq.set(num, 0);
        }
        freq.set(num, freq.get(num) + 1);
    }
    
    // Check if any element appears more than twice
    for (let count of freq.values()) {
        if (count > 2) {
            return false;
        }
    }
    
    const set1 = new Set();
    const set2 = new Set();
    
    for (let num of nums) {
        if (!set1.has(num)) {
            set1.add(num);
        } else if (!set2.has(num)) {
            set2.add(num);
        }
    }
    
    return set1.size === nums.length / 2 && set2.size === nums.length / 2;
}

// Example usage:
console.log(splitArray([1, 1, 2, 2, 3, 4])); // Output: true
console.log(splitArray([1, 1, 1, 1])); // Output: false


/******************************** */

function canSplit(nums) {
    if (nums.length % 2 !== 0) {
      return false; // Array length must be even
    }
  
    const set = new Set(nums);
    return set.size === nums.length; // All elements must be distinct
  }
  
  // Example usage
  const nums1 = [1, 1, 2, 2, 3, 4];
  const nums2 = [1, 1, 1, 1];
  console.log(canSplit(nums1)); // Output: true
  console.log(canSplit(nums2)); // Output: false
  