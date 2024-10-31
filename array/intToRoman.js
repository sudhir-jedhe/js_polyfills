function intToRoman(num) {
    const romanSymbols = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let result = '';
    let remaining = num;

    for (let i = 0; i < romanSymbols.length; i++) {
        const { value, symbol } = romanSymbols[i];

        while (remaining >= value) {
            result += symbol;
            remaining -= value;
        }
        
        if (remaining === 0) {
            break;
        }
    }

    return result;
}

// Examples:
console.log(intToRoman(3));       // Output: "III"
console.log(intToRoman(58));      // Output: "LVIII"
console.log(intToRoman(1994));    // Output: "MCMXCIV"


/************************************************* */


function intToRoman(num) {
    // Define Roman symbols and their corresponding values
    const symbols = [
      ['M', 1000],
      ['CM', 900],
      ['D', 500],
      ['CD', 400],
      ['C', 100],
      ['XC', 90],
      ['L', 50],
      ['XL', 40],
      ['X', 10],
      ['IX', 9],
      ['V', 5],
      ['I', 1],
    ];
  
    let roman = "";
  
    // Iterate through symbols in descending order of values
    for (const [symbol, value] of symbols) {
      // While the number is greater than or equal to the current symbol's value
      while (num >= value) {
        // Append the symbol to the Roman numeral string
        roman += symbol;
        // Subtract the symbol's value from the number
        num -= value;
      }
    }
  
    return roman;
  }
  
  // Example usage
  const number = 3999;
  const romanNumeral = intToRoman(number);
  console.log(romanNumeral); // Output: MMMCMXCIX
  