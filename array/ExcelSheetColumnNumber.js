function titleToNumber(columnTitle) {
    let result = 0;
    
    for (let i = 0; i < columnTitle.length; i++) {
        let charValue = columnTitle[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        result = result * 26 + charValue;
    }
    
    return result;
}

// Examples
console.log(titleToNumber("A"));   // Output: 1
console.log(titleToNumber("AB"));  // Output: 28
console.log(titleToNumber("ZY"));  // Output: 701


/************************* */

function titleToNumber(columnTitle) {
    let result = 0;
    for (let i = 0; i < columnTitle.length; i++) {
      const charCode = columnTitle.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
      result += charCode * Math.pow(26, columnTitle.length - i - 1);
    }
    return result;
  }
  
  // Example usage
  const title1 = "A";
  const title2 = "AB";
  const title3 = "ZY";
  
  console.log(titleToNumber(title1)); // Output: 1
  console.log(titleToNumber(title2)); // Output: 28
  console.log(titleToNumber(title3)); // Output: 701
  