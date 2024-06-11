function isValidMatrix(matrix) {
    const n = matrix.length;
    
    // Check rows
    for (let i = 0; i < n; i++) {
        const rowSet = new Set(matrix[i]);
        if (rowSet.size !== n) {
            return false;
        }
    }
    
    // Check columns
    for (let j = 0; j < n; j++) {
        const colSet = new Set();
        for (let i = 0; i < n; i++) {
            colSet.add(matrix[i][j]);
        }
        if (colSet.size !== n) {
            return false;
        }
    }
    
    return true;
}

// Test cases
console.log(isValidMatrix([[1,2,3],[3,1,2],[2,3,1]])); // Output: true
console.log(isValidMatrix([[1,1,1],[1,2,3],[1,2,3]])); // Output: false


// Given an n x n integer matrix matrix, return true if the matrix is valid. Otherwise, return false.  Input: matrix = [[1,2,3],[3,1,2],[2,3,1]] Output: true Explanation: In this case, n = 3, and every row and column contains the numbers 1, 2, and 3. Hence, we return true. matrix = [[1,1,1],[1,2,3],[1,2,3]] Output: false Explanation: In this case, n = 3, but the first row and the first column do not contain the numbers 2 or 3. Hence, we return false.