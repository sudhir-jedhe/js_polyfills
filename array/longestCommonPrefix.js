function longestCommonPrefix(arr1, arr2) {
    let maxPrefixLength = 0;
    
    for (let x of arr1) {
        for (let y of arr2) {
            const strX = x.toString();
            const strY = y.toString();
            let commonLength = 0;
            
            // Find the length of common prefix between strX and strY
            const minLength = Math.min(strX.length, strY.length);
            while (commonLength < minLength && strX[commonLength] === strY[commonLength]) {
                commonLength++;
            }
            
            // Update maxPrefixLength if needed
            if (commonLength > maxPrefixLength) {
                maxPrefixLength = commonLength;
            }
        }
    }
    
    return maxPrefixLength;
}

// Example usage:
console.log(longestCommonPrefix([1, 10, 100], [1000])); // Output: 3 // 1, 10 , 100
console.log(longestCommonPrefix([1, 2, 3], [4, 4, 4])); // Output: 0


/*********************************** */

function longestCommonPrefix(arr1, arr2) {
    const minLen = Math.min(...arr1.map(num => String(num).length), ...arr2.map(num => String(num).length));
  
    let longestPrefix = "";
    for (let i = 0; i < minLen; i++) {
      const char1 = arr1[0][i];
      if (!char1 || arr1.every(num => num.startsWith(char1.repeat(i + 1))) && arr2.every(num => num.startsWith(char1.repeat(i + 1)))) {
        longestPrefix += char1;
      } else {
        break;
      }
    }
  
    return longestPrefix.length;
  }
  
  // Example usage
  const arr1 = [1, 10, 100];
  const arr2 = [1000];
  const longestPrefixLength = longestCommonPrefix(arr1, arr2);
  console.log(longestPrefixLength); // Output: 3
  
  const arr3 = [1, 2, 3];
  const arr4 = [4, 4, 4];
  const longestPrefixLength2 = longestCommonPrefix(arr3, arr4);
  console.log(longestPrefixLength2); // Output: 0
  