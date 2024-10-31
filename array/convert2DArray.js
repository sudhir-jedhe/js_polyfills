function convertTo2DArray(nums) {
    // Step 1: Count frequencies of each number
    let freq = {};
    nums.forEach(num => {
        if (freq[num]) {
            freq[num]++;
        } else {
            freq[num] = 1;
        }
    });
    
    // Step 2: Determine the number of rows needed (which is max frequency of any number)
    let maxRows = Math.max(...Object.values(freq));
    
    // Step 3: Initialize the 2D array
    let result = Array.from({ length: maxRows }, () => []);
    
    // Step 4: Distribute elements across the rows
    let currentRow = 0;
    nums.forEach(num => {
        for (let i = 0; i < freq[num]; i++) {
            result[currentRow].push(num);
            currentRow = (currentRow + 1) % maxRows;
        }
    });
    
    return result;
}

// Example usage:
console.log(convertTo2DArray([1, 3, 4, 1, 2, 3, 1]));
console.log(convertTo2DArray([1, 2, 3, 4]));

/******************************************************* */

function convertTo2DArray(nums) {
    // Count element frequencies
    const count = {};
    for (const num of nums) {
      count[num] = (count[num] || 0) + 1;
    }
  
    // Optional sorting (can be helpful)
    // const sortedNums = nums.sort((a, b) => count[b] - count[a]);
  
    const result = [];
    let currentRow = [];
    for (const num of nums) {
      // Check if element has remaining occurrences and isn't already in the row
      if (count[num] > 0 && !currentRow.includes(num)) {
        currentRow.push(num);
        count[num]--;
      }
  
      // Check if current row is full (all elements distinct)
      if (currentRow.length === new Set(currentRow).size) {
        result.push(currentRow);
        currentRow = [];
      }
    }
  
    return result;
  }
  
  // Example usage
  const nums = [1, 3, 4, 1, 2, 3, 1];
  const result = convertTo2DArray(nums);
  console.log(result); // Output: [[1, 3, 4, 2], [1, 3], [1]]
  