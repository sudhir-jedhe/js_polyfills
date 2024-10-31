function letterCombinations(digits) {
    if (digits.length === 0) {
        return [];
    }
    
    const digitToLetters = {
        '2': ['a', 'b', 'c'],
        '3': ['d', 'e', 'f'],
        '4': ['g', 'h', 'i'],
        '5': ['j', 'k', 'l'],
        '6': ['m', 'n', 'o'],
        '7': ['p', 'q', 'r', 's'],
        '8': ['t', 'u', 'v'],
        '9': ['w', 'x', 'y', 'z']
    };
    
    const result = [];
    
    function backtrack(currentCombination, index) {
        if (currentCombination.length === digits.length) {
            result.push(currentCombination.join(''));
            return;
        }
        
        const currentDigit = digits[index];
        const letters = digitToLetters[currentDigit];
        
        for (let letter of letters) {
            currentCombination.push(letter);
            backtrack(currentCombination, index + 1);
            currentCombination.pop();
        }
    }
    
    backtrack([], 0);
    
    return result;
}

// Examples:
console.log(letterCombinations("23"));   // Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log(letterCombinations(""));     // Output: []
console.log(letterCombinations("2"));    // Output: ["a","b","c"]


/********************************************** */

function letterCombinations(digits) {
    if (digits.length === 0) {
      return []; // No combinations for empty string
    }
  
    const map = {
      2: 'abc',
      3: 'def',
      4: 'ghi',
      5: 'jkl',
      6: 'mno',
      7: 'pqrs',
      8: 'tuv',
      9: 'wxyz',
    };
  
    const result = [];
    const backtrack = (combination = "", i = 0) => {
      // Base case: reached the end of digits
      if (i === digits.length) {
        result.push(combination);
        return;
      }
  
      // Get letters for the current digit
      const letters = map[digits[i]];
  
      // Try all combinations for the current digit
      for (const letter of letters) {
        backtrack(combination + letter, i + 1); // Append letter and move to next digit
      }
    };
  
    backtrack();
    return result;
  }
  
  // Example usage
  const digits = "23";
  const combinations = letterCombinations(digits);
  console.log(combinations); // Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
  