function romanToInt(s) {
    const romanToIntMap = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };
    
    let result = 0;
    
    for (let i = 0; i < s.length; i++) {
        // Current and next character values
        let currentVal = romanToIntMap[s[i]];
        let nextVal = romanToIntMap[s[i + 1]];
        
        // If current value is less than next value, subtract it (e.g., IV, IX)
        if (nextVal && currentVal < nextVal) {
            result -= currentVal;
        } else {
            result += currentVal;
        }
    }
    
    return result;
}

// Examples:
console.log(romanToInt("III"));       // Output: 3
console.log(romanToInt("LVIII"));     // Output: 58
console.log(romanToInt("MCMXCIV"));   // Output: 1994



/********************************************** */

function romanToInt(str) {
    const romanMap = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
  
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const current = romanMap[str[i]];
      const next = romanMap[str[i + 1]];
  
      // Handle subtractive notation (IV, IX, XL, XC, CD, CM)
      if (current < next && i < str.length - 1) {
        result += next - current;
        i++; // Skip the next character as it's already considered
      } else {
        result += current;
      }
    }
  
    return result;
  }
  
  // Example usage
  const romanNumeral = "III";
  const integerValue = romanToInt(romanNumeral);
  console.log(integerValue); // Output: 3
  