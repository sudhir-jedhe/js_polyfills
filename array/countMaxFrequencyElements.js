function countMaxFrequencyElements(nums) {
    // Step 1: Count frequencies using a Map
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Step 2: Find the maximum frequency
    let maxFreq = 0;
    for (const freq of freqMap.values()) {
        maxFreq = Math.max(maxFreq, freq);
    }
    
    // Step 3: Count elements with maximum frequency
    let count = 0;
    for (const freq of freqMap.values()) {
        if (freq === maxFreq) {
            count++;
        }
    }
    
    // Step 4: Return the count of elements with maximum frequency
    return count;
}

// Example usage:
console.log(countMaxFrequencyElements([1,2,2,3,1,4])); // Output: 4
console.log(countMaxFrequencyElements([1,2,3,4,5]));   // Output: 5


/************************************ */

function countElementsWithMaxFrequency(nums) {
    const count = {};
    let maxFrequency = 0;
  
    // Count frequencies of elements
    for (const num of nums) {
      count[num] = (count[num] || 0) + 1;
      maxFrequency = Math.max(maxFrequency, count[num]); // Update max frequency
    }
  
    // Count elements with maximum frequency
    let maxCount = 0;
    for (const frequency in count) {
      if (count[frequency] === maxFrequency) {
        maxCount++;
      }
    }
  
    return maxCount;
  }
  
  // Example usage
  const nums = [1, 2, 2, 3, 1, 4];
  const result = countElementsWithMaxFrequency(nums);
  console.log(result); // Output: 4

  
//   Count Elements With Maximum Frequency
// Easy
// Topics
// Companies
// Hint
// You are given an array nums consisting of positive integers.

// Return the total frequencies of elements in nums such that those elements all have the maximum frequency.

// The frequency of an element is the number of occurrences of that element in the array.

 

// Example 1:

// Input: nums = [1,2,2,3,1,4]
// Output: 4
// Explanation: The elements 1 and 2 have a frequency of 2 which is the maximum frequency in the array.
// So the number of elements in the array with maximum frequency is 4.
// Example 2:

// Input: nums = [1,2,3,4,5]
// Output: 5
// Explanation: All elements of the array have a frequency of 1 which is the maximum.
// So the number of elements in the array with maximum frequency is 5. javascript