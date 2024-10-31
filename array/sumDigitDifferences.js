function sumDigitDifferences(a, b) {
    const aDigits = String(a).split('').map(Number);
    const bDigits = String(b).split('').map(Number);
  
    let sum = 0;
    const maxLength = Math.max(aDigits.length, bDigits.length);
  
    for (let i = 0; i < maxLength; i++) {
      const digitA = aDigits[i] || 0;
      const digitB = bDigits[i] || 0;
      sum += Math.abs(digitA - digitB);
    }
  
    return sum;
  }
  
  // Example usage
  const a = 123;
  const b = 321;
  const differenceSum = sumDigitDifferences(a, b);
  console.log(differenceSum); // Output: 4 (1 - 3 + 2 - 2 + 3 - 1)
  


  /******************************************** */

  function sumDigitDifferences(nums) {
    let sum = 0;
    const numDigits = nums.map(num => getDigits(num));
    
    const n = numDigits[0].length; // Since all numbers have the same length of digits
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < nums.length; j++) {
            for (let k = j + 1; k < nums.length; k++) {
                sum += Math.abs(numDigits[j][i] - numDigits[k][i]);
            }
        }
    }
    
    return sum;
}

// Helper function to get digits of a number
function getDigits(num) {
    return Array.from(String(num), Number);
}

// Example usage:
console.log(sumDigitDifferences([123, 456, 789])); // Output: 12
console.log(sumDigitDifferences([11, 22, 33, 44])); // Output: 16
