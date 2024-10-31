function setZeroes(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    
    let firstRowHasZero = false;
    let firstColHasZero = false;
    
    // Step 1: Check if first row or first column should be zeroed
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            firstRowHasZero = true;
            break;
        }
    }
    
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            firstColHasZero = true;
            break;
        }
    }
    
    // Step 2: Mark rows and columns to be zeroed
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // Step 3: Zero out cells based on marks in first row and column
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    // Step 4: Zero out first row and first column if necessary
    if (firstRowHasZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
    
    if (firstColHasZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
}

// Example usage:
const matrix1 = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];
setZeroes(matrix1);
console.log(matrix1); // Output: [[1,0,1],[0,0,0],[1,0,1]]

const matrix2 = [
    [0, 1, 2, 0],
    [3, 4, 5, 2],
    [1, 3, 1, 5]
];
setZeroes(matrix2);
console.log(matrix2); // Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]



/********************************************* */

function setZeroes(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
  
    // Use first row and column as markers
    let firstRowHasZero = false;
    for (let col = 0; col < n; col++) {
      if (matrix[0][col] === 0) {
        firstRowHasZero = true;
        break;
      }
    }
  
    // Use first column as marker for rows except the first row
    for (let row = 1; row < m; row++) {
      if (matrix[row][0] === 0) {
        for (let col = 1; col < n; col++) {
          matrix[row][col] = 0;
        }
      }
    }
  
    // Set zeroes based on markers in the first row and column (excluding the first row and column)
    for (let row = 1; row < m; row++) {
      for (let col = 1; col < n; col++) {
        if (matrix[row][0] === 0 || matrix[0][col] === 0) {
          matrix[row][col] = 0;
        }
      }
    }
  
    // Set zeroes in the first row if necessary (based on the first column marker)
    if (firstRowHasZero) {
      for (let col = 0; col < n; col++) {
        matrix[0][col] = 0;
      }
    }
  }
  
  // Example usage
  const matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
  setZeroes(matrix);
  console.log(matrix); // Output: [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
  