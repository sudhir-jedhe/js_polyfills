function clearDigits(s) {
    const stack = [];
    
    for (let char of s) {
        if (char >= '0' && char <= '9') {
            continue; // Skip digits
        } else {
            stack.push(char); // Push non-digits onto stack
        }
    }
    
    // Convert stack to string and return
    return stack.join('');
}

// Example usage:
console.log(clearDigits("abc")); // Output: "abc"
console.log(clearDigits("cb34")); // Output: ""


/******************************************* */

function removeDigits(s) {
    let result = "";
    let i = 0;
  
    while (i < s.length) {
      if (/\d/.test(s[i])) { // Check if current character is a digit
        // Find the closest non-digit character to the left (if any)
        let leftIndex = i - 1;
        while (leftIndex >= 0 && /\d/.test(s[leftIndex])) {
          leftIndex--;
        }
  
        // If a non-digit character is found, remove both the digit and the character
        if (leftIndex >= 0) {
          result = result.substring(0, leftIndex + 1); // Include the non-digit character
        }
        i = leftIndex + 1; // Skip the removed characters
      } else {
        // Append non-digits to the result
        result += s[i];
        i++;
      }
    }
  
    return result;
  }
  
  // Example usage
  const s = "cb34efg";
  const result = removeDigits(s);
  console.log(result); // Output: "cfg"
  



  function clearDigits(s: string): string {
    const stk: string[] = [];
    for (const c of s) {
        if (!isNaN(parseInt(c))) {
            stk.pop();
        } else {
            stk.push(c);
        }
    }
    return stk.join('');
}