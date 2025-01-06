function lengthOfLongestSubstring(s) {
    let maxLength = 0;
    let start = 0;
    let charMap = new Map(); // Map to store character indices
    
    for (let end = 0; end < s.length; end++) {
        let char = s[end];
        
        if (charMap.has(char)) {
            // If character is already in the map and its index is >= start
            // Move the start pointer to one position after the last occurrence of the character
            start = Math.max(charMap.get(char) + 1, start);
        }
        
        // Update the index of the current character in the map
        charMap.set(char, end);
        
        // Calculate the current window size
        let currentLength = end - start + 1;
        
        // Update maxLength if current window size is larger
        maxLength = Math.max(maxLength, currentLength);
    }
    
    return maxLength;
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3


/********************************** */
function lengthOfLongestSubstring(s) {
    let longest = 0;
    let seen = {};
    let start = 0;
  
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      // If the character has already been seen within the window
      if (seen[char] !== undefined && seen[char] >= start) {
        // Update the start index to exclude the previous occurrence
        start = Math.max(start, seen[char] + 1);
      }
      // Update the longest substring length if the current window is longer
      longest = Math.max(longest, i - start + 1);
      // Update the character's last seen index
      seen[char] = i;
    }
  
    return longest;
  }
  
  // Examples
  console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
  console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
  console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3
  

  /************************************************** */
  function lengthOfLongestSubstring(s) {
    let longest = 0;
    let window = new Set();
  
    for (let i = 0, j = 0; i < s.length; i++) {
      const char = s[i];
      // If the character is already in the set (not unique within window)
      while (window.has(char)) {
        window.delete(s[j]); // Remove leftmost character from window
        j++; // Slide window to the right
      }
      window.add(char); // Add current character to the set
      longest = Math.max(longest, window.size); // Update longest if window size is larger
    }
  
    return longest;
  }
  
  // Examples
  console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
  console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
  console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3
  

  /**************************************** */
  function lengthOfLongestSubstring(s) {
    let maxLength = 0;
    let left = 0;
    let charSet = new Set();
    
    for (let right = 0; right < s.length; right++) {
        let char = s[right];
        
        while (charSet.has(char)) {
            charSet.delete(s[left]);
            left++;
        }
        
        charSet.add(char);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3
