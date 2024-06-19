function isArmstrongNumber(number) {
    // Convert number to string to iterate through digits
    const numStr = number.toString();
    const numDigits = numStr.length;
    
    let sum = 0;
    
    // Iterate through each digit and calculate sum of each digit raised to the power of numDigits
    for (let digit of numStr) {
      sum += Math.pow(parseInt(digit), numDigits);
    }
    
    // Check if the sum equals the original number
    return sum === number;
  }
  
  // Example usage:
  const number = 153;
  console.log(`${number} is Armstrong number?`, isArmstrongNumber(number)); // Output: true
  
  const number2 = 370;
  console.log(`${number2} is Armstrong number?`, isArmstrongNumber(number2)); // Output: true
  
  const number3 = 123;
  console.log(`${number3} is Armstrong number?`, isArmstrongNumber(number3)); // Output: false

  

  /************************************************ */

  function isArmstrongNumber(number) {
    const numStr = number.toString();
    const numDigits = numStr.length;
  
    const sum = numStr.split('')
                      .map(digit => Math.pow(parseInt(digit), numDigits))
                      .reduce((acc, curr) => acc + curr, 0);
    
    return sum === number;
  }
  
  // Example usage:
  console.log(isArmstrongNumber(153)); // Output: true
  console.log(isArmstrongNumber(370)); // Output: true
  console.log(isArmstrongNumber(123)); // Output: false

  /******************************************************* */


  function isArmstrongNumber(number) {
    const numStr = number.toString();
    const numDigits = numStr.length;
  
    let sum = 0;
    numStr.split('').forEach(digit => {
      sum += Math.pow(parseInt(digit), numDigits);
    });
    
    return sum === number;
  }
  
  // Example usage:
  console.log(isArmstrongNumber(153)); // Output: true
  console.log(isArmstrongNumber(370)); // Output: true
  console.log(isArmstrongNumber(123)); // Output: false

  
  /******************************** */
  const isArmstrongNumber = number => {
    const numStr = number.toString();
    const numDigits = numStr.length;
  
    const sum = numStr.split('')
                      .reduce((acc, digit) => acc + Math.pow(parseInt(digit), numDigits), 0);
    
    return sum === number;
  };
  
  // Example usage:
  console.log(isArmstrongNumber(153)); // Output: true
  console.log(isArmstrongNumber(370)); // Output: true
  console.log(isArmstrongNumber(123)); // Output: false
  