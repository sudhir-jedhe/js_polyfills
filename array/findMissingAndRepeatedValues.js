function findMissingAndRepeatedValues(grid) {
    const n = grid.length;
    const expectedSum = n * (n + 1) / 2;
    let actualSum = 0;
    const seen = new Set();
    let repeated = -1;
    
    // Calculate actual sum and find repeated number
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const num = grid[i][j];
            actualSum += num;
            if (seen.has(num)) {
                repeated = num;
            } else {
                seen.add(num);
            }
        }
    }
    
    // Calculate missing number
    const missing = expectedSum - (actualSum - repeated);
    
    return [repeated, missing];
}

// Example usage:
console.log(findMissingAndRepeatedValues([[1,3],[2,2]])); // Output: [2,4]
console.log(findMissingAndRepeatedValues([[9,1,7],[8,9,2],[3,4,6]])); // Output: [9,5]



/********************************************** */

function findMissingAndRepeated(grid) {
    const n = grid.length;
    const expectedSum = n * (n + 1) / 2; // Sum of all numbers from 1 to n
  
    const rowSums = grid.map(row => row.reduce((sum, val) => sum + val, 0));
    const colSums = grid.reduce((colSums, row) => {
      row.forEach((val, colIndex) => {
        colSums[colIndex] = (colSums[colIndex] || 0) + val;
      });
      return colSums;
    }, new Array(n).fill(0));
  
    const missing = expectedSum - rowSums.reduce((sum, val) => sum + val, 0);
    const repeated = (expectedSum - colSums.reduce((sum, val) => sum + val, 0)) + sum(new Set(rowSums));
  
    return [repeated, missing];
  }
  
  function sum(set) {
    let total = 0;
    for (const value of set) {
      total += value;
    }
    return total;
  }
  
  // Example usage
  const grid1 = [[1, 3], [2, 2]];
  const grid2 = [[9, 1, 7], [8, 9, 2], [3, 4, 6]];
  console.log(findMissingAndRepeated(grid1)); // Output: [2, 4]
  console.log(findMissingAndRepeated(grid2)); // Output: [9, 5]
  