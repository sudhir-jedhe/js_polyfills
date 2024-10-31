function minExtraCharacters(s, dictionary) {
    const n = s.length;
    const dp = new Array(n).fill(Infinity);
    
    // Function to check if substring s[j...i] exists in the dictionary
    function isInDictionary(j, i) {
        const substring = s.substring(j, i + 1);
        return dictionary.includes(substring);
    }
    
    // Initialize dp[0]
    if (isInDictionary(0, 0)) {
        dp[0] = 0;
    } else {
        dp[0] = 1;
    }
    
    // Fill dp array
    for (let i = 1; i < n; i++) {
        if (isInDictionary(0, i)) {
            dp[i] = 0;
        } else {
            dp[i] = dp[i - 1] + 1; // Worst case, consider s[i] as extra
        }
        
        // Check all possible substrings ending at i
        for (let j = 1; j <= i; j++) {
            if (isInDictionary(j, i)) {
                dp[i] = Math.min(dp[i], j > 0 ? dp[j - 1] + (i - j + 1) : i + 1);
            }
        }
    }
    
    return dp[n - 1];
}

// Example usage:
console.log(minExtraCharacters("leetscode", ["leet", "code", "leetcode"])); // Output: 1
console.log(minExtraCharacters("sayhelloworld", ["hello", "world"])); // Output: 3



/****************************************** */

function minExtraChars(s, dictionary) {
    const dp = new Array(s.length + 1).fill(Infinity);
    dp[0] = 0;
    const visited = {};
  
    const minExtraCharsHelper = (i) => {
      if (i in visited) return visited[i];
  
      let minExtra = Infinity;
      for (const word of dictionary) {
        const wordLength = word.length;
        if (i >= wordLength && s.slice(i - wordLength, i) === word) {
          const prevExtra = minExtraCharsHelper(i - wordLength);
          const extraInBetween = s.length - (i - wordLength) - wordLength;
          minExtra = Math.min(minExtra, prevExtra + extraInBetween);
        }
      }
  
      visited[i] = minExtra;
      return minExtra;
    };
  
    return minExtraCharsHelper(s.length);
  }
  
  // Example usage
  const s = "leetscode";
  const dictionary = ["leet", "code", "leetcode"];
  const result = minExtraChars(s, dictionary);
  console.log(result); // Output: 1
  