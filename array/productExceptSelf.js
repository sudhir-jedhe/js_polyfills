function productExceptSelf(nums) {
    const n = nums.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);
    const result = new Array(n);
    
    // Compute left products
    for (let i = 1; i < n; i++) {
        left[i] = left[i - 1] * nums[i - 1];
    }
    
    // Compute right products
    for (let i = n - 2; i >= 0; i--) {
        right[i] = right[i + 1] * nums[i + 1];
    }
    
    // Compute result
    for (let i = 0; i < n; i++) {
        result[i] = left[i] * right[i];
    }
    
    return result;
}

// Example usage:
console.log(productExceptSelf([1, 2, 3, 4])); // Output: [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // Output: [0, 0, 9, 0, 0]


/*************************************** */
function productExceptSelf(nums) {
    const result = new Array(nums.length).fill(1); // Initialize result array with 1s (products so far)
  
    // Calculate the product of all elements to the left of each index (excluding itself)
    for (let i = 1; i < nums.length; i++) {
      result[i] = result[i - 1] * nums[i - 1];
    }
  
    // Calculate the product of all elements to the right of each index (excluding itself)
    let rightProduct = 1;
    for (let i = nums.length - 1; i >= 0; i--) {
      result[i] *= rightProduct;
      rightProduct *= nums[i];
    }
  
    return result;
  }
  
  // Examples
  console.log(productExceptSelf([1, 2, 3, 4])); // Output: [24, 12, 8, 6]
  console.log(productExceptSelf([0, 1, 2, 3])); // Output: [0, 0, 0, 0] (product is 0 for elements with 0)
  