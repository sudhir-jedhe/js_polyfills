function convertToTitle(columnNumber) {
    let result = '';

    while (columnNumber > 0) {
        let remainder = (columnNumber - 1) % 26;  // Adjusted to handle 'A' starting from 1
        result = String.fromCharCode('A'.charCodeAt(0) + remainder) + result;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    
    return result;
}

// Examples
console.log(convertToTitle(1));   // Output: "A"
console.log(convertToTitle(28));  // Output: "AB"
console.log(convertToTitle(701)); // Output: "ZY"


/****************************************** */

function convertToTitle(columnNumber) {
    let result = "";
    while (columnNumber > 0) {
      const remainder = columnNumber % 26;
      const charCode = remainder === 0 ? 'Z'.charCodeAt(0) : remainder + 'A'.charCodeAt(0) - 1;
      result = String.fromCharCode(charCode) + result;
      columnNumber = Math.floor(columnNumber / 26) - (remainder === 0 ? 1 : 0);
    }
    return result;
  }
  
  // Example usage
  const colNum1 = 1;
  const colNum2 = 28;
  const colNum3 = 701;
  
  console.log(convertToTitle(colNum1)); // Output: "A"
  console.log(convertToTitle(colNum2)); // Output: "AB"
  console.log(convertToTitle(colNum3)); // Output: "ZY"
  