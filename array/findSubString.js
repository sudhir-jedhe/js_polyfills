function findSubstring(s, words) {
    if (words.length === 0 || s.length === 0) {
        return [];
    }
    
    const wordCountMap = {};
    for (let word of words) {
        if (word in wordCountMap) {
            wordCountMap[word]++;
        } else {
            wordCountMap[word] = 1;
        }
    }
    
    const wordLength = words[0].length;
    const totalLength = wordLength * words.length;
    const result = [];
    
    for (let i = 0; i <= s.length - totalLength; i++) {
        const currentMap = {};
        let j = 0;
        
        while (j < words.length) {
            const currentWord = s.substr(i + j * wordLength, wordLength);
            
            if (!(currentWord in wordCountMap)) {
                break;
            }
            
            if (currentWord in currentMap) {
                currentMap[currentWord]++;
            } else {
                currentMap[currentWord] = 1;
            }
            
            if (currentMap[currentWord] > wordCountMap[currentWord]) {
                break;
            }
            
            j++;
        }
        
        if (j === words.length) {
            result.push(i);
        }
    }
    
    return result;
}

// Examples:
console.log(findSubstring("barfoothefoobarman", ["foo","bar"]));   // Output: [0, 9]
console.log(findSubstring("wordgoodgoodgoodbestword", ["word","good","best","word"]));  // Output: []
console.log(findSubstring("barfoofoobarthefoobarman", ["bar","foo","the"]));  // Output: [6, 9, 12]


/************** */

function findSubstring(s, words) {
    const wordLen = words[0].length; // Assume all words have the same length
    const needed = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {}); // Count needed occurrences of each word
    const have = {}; // Track current word occurrences in the window
  
    let left = 0, right = 0, result = [];
    const windowLen = wordLen * words.length; // Total length of the concatenated string
  
    while (right <= s.length) {
      const word = s.substring(right, right + wordLen);
  
      // Handle window outside string or word not in the list
      if (right + wordLen > s.length || !word) {
        left++;
        have = {}; // Reset word counts in the window
        right = left;
        continue;
      }
  
      // Update have count for the current word
      have[word] = (have[word] || 0) + 1;
  
      // Check if all words in the window have enough occurrences
      const allPresent = Object.entries(have).every(([word, count]) => count <= needed[word]);
  
      // If window is full and all words are present, add starting index
      if (right - left + 1 === windowLen && allPresent) {
        result.push(left);
      }
  
      // Slide the window
      right += wordLen;
    }
  
    return result;
  }
  
  // Example usage
  const s = "barfoothefoobarman";
  const words = ["foo", "bar"];
  const indices = findSubstring(s, words);
  console.log(indices); // Output: [0, 9]
  