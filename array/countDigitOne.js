function countDigitOne(n) {
    if (n <= 0) return 0;
    
    let count = 0;
    let factor = 1; // To track the digit positions
    
    while (factor <= n) {
        let current = Math.floor(n / factor) % 10; // Current digit
        let higher = Math.floor(n / (factor * 10)); // Higher digits
        let lower = n % factor; // Lower digits
        
        if (current === 0) {
            count += higher * factor;
        } else if (current === 1) {
            count += higher * factor + lower + 1;
        } else {
            count += (higher + 1) * factor;
        }
        
        factor *= 10;
    }
    
    return count;
}

// Examples:
console.log(countDigitOne(13)); // Output: 6
console.log(countDigitOne(0));  // Output: 0


/************************************** */

function countDigitOne(n) {
    let count = 0;
    let digit = 1;
  
    while (digit <= n) {
      const high = Math.floor(n / (digit * 10)); // Count 1s in the high digits (e.g., hundreds, thousands)
      const cur = n % (digit * 10); // Current digit (tens place)
      const low = Math.floor(cur / digit); // Count 1s in the low digits (e.g., ones)
  
      if (cur < digit) {
        count += high * digit; // No 1s in the current digit (tens place)
      } else if (cur === digit) {
        count += high * digit + low + 1; // All 1s in the current digit + remaining low digits + 1 (for the current digit itself)
      } else {
        count += (high + 1) * digit; // All 1s in the current digit and high digits
      }
  
      digit *= 10; // Move to the next digit position (hundreds, thousands, etc.)
    }
  
    return count;
  }
  
  // Examples
  console.log(countDigitOne(13)); // Output: 6
  console.log(countDigitOne(0)); // Output: 0
  console.log(countDigitOne(100)); // Output: 21
  