function plusOne(digits) {
    const n = digits.length;
    
    // Traverse from right to left
    for (let i = n - 1; i >= 0; i--) {
        // Increment current digit
        digits[i]++;
        
        // Check for carry
        if (digits[i] < 10) {
            return digits; // No more carry, return the result
        } else {
            digits[i] = 0; // Set current digit to 0 and continue to carry over
        }
    }
    
    // If we have a carry in the highest significant digit (e.g., [9,9,9])
    digits.unshift(1);
    return digits;
}

// Example usage:
console.log(plusOne([1, 2, 3])); // Output: [1, 2, 4]
console.log(plusOne([4, 3, 2, 1])); // Output: [4, 3, 2, 2]
console.log(plusOne([9])); // Output: [1, 0]


/*************************************************** */
function plusOne(digits) {
    let carry = 1; // Initial carry for adding 1
  
    // Iterate from the rightmost digit
    for (let i = digits.length - 1; i >= 0; i--) {
      const sum = digits[i] + carry; // Add the current digit and carry
  
      // Update the current digit
      digits[i] = sum % 10; // Take the last digit (remainder)
  
      // Update carry for the next iteration
      carry = Math.floor(sum / 10); // Check if there's a carry-over (integer division)
    }
  
    // If there's a final carry (number overflowed), prepend a 1
    if (carry) {
      digits.unshift(1);
    }
  
    return digits;
  }
  
  // Examples
  console.log(plusOne([1, 2, 3])); // Output: [1, 2, 4]
  console.log(plusOne([4, 3, 2, 1])); // Output: [4, 3, 2, 2]
  console.log(plusOne([9])); // Output: [1, 0]
  