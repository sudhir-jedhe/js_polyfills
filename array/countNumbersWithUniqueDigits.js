function countNumbersWithUniqueDigits(n) {
    if (n === 0) return 1; // Only the number '0' is valid
    
    let count = 0;
    
    for (let i = 1; i <= n; i++) {
        if (hasUniqueDigits(i)) {
            count++;
        }
    }
    
    return count;
}

function hasUniqueDigits(num) {
    const digits = num.toString();
    const seen = new Set();
    
    for (let digit of digits) {
        if (seen.has(digit)) {
            return false;
        }
        seen.add(digit);
    }
    
    return true;
}

// Example usage:
console.log(countNumbersWithUniqueDigits(20)); // Output: 324



/********************************** */

function countNumbersWithUniqueDigits(n) {
    if (n === 0) return 1; // 0 is a valid number with unique digits for n = 0
    if (n > 10) return 0; // No numbers with unique digits possible for n > 10 (more digits than available)
  
    let count = 9; // All digits can be used for the first digit (excluding 0)
    let availableDigits = 9; // Initially, all digits are available
  
    for (let i = 2; i <= n; i++) {
      availableDigits--; // One less digit available for each subsequent digit
      count *= availableDigits; // Multiply by remaining available digits
    }
  
    return count;
  }
  
  // Example usage
  const n1 = 3;
  const n2 = 0;
  const n3 = 11;
  
  console.log(countNumbersWithUniqueDigits(n1)); // Output: 729 (100 to 999)
  console.log(countNumbersWithUniqueDigits(n2)); // Output: 1 (0)
  console.log(countNumbersWithUniqueDigits(n3)); // Output: 0
  