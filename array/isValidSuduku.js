function isValidSudoku(board) {
    const rows = new Set();
    const cols = new Set();
    const boxes = new Set();
  
    for (let i = 0; i < 9; i++) {
      rows.clear();
      cols.clear();
  
      for (let j = 0; j < 9; j++) {
        const num = board[i][j];
        if (num !== ".") {
          // Check row and column
          if (rows.has(num) || cols.has(num)) {
            return false;
          }
          rows.add(num);
          cols.add(num);
  
          // Check box (3x3 sub-grid)
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
          const boxKey = `box-${boxIndex}-${num}`;
          if (boxes.has(boxKey)) {
            return false;
          }
          boxes.add(boxKey);
        }
      }
    }
  
    return true;
  }
  
  // Example usage
  const board = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
  ];
  const isValid = isValidSudoku(board);
  console.log(isValid); // Output: true
  


  /*************************************************** */

  function isValidSudoku(board) {
    function isValidRow(board, row) {
        let seen = new Set();
        for (let col = 0; col < 9; col++) {
            let cell = board[row][col];
            if (cell !== '.') {
                if (seen.has(cell)) {
                    return false;
                }
                seen.add(cell);
            }
        }
        return true;
    }
    
    function isValidColumn(board, col) {
        let seen = new Set();
        for (let row = 0; row < 9; row++) {
            let cell = board[row][col];
            if (cell !== '.') {
                if (seen.has(cell)) {
                    return false;
                }
                seen.add(cell);
            }
        }
        return true;
    }
    
    function isValidBlock(board, startRow, startCol) {
        let seen = new Set();
        for (let row = startRow; row < startRow + 3; row++) {
            for (let col = startCol; col < startCol + 3; col++) {
                let cell = board[row][col];
                if (cell !== '.') {
                    if (seen.has(cell)) {
                        return false;
                    }
                    seen.add(cell);
                }
            }
        }
        return true;
    }
    
    for (let i = 0; i < 9; i++) {
        if (!isValidRow(board, i) || !isValidColumn(board, i)) {
            return false;
        }
    }
    
    for (let startRow = 0; startRow < 9; startRow += 3) {
        for (let startCol = 0; startCol < 9; startCol += 3) {
            if (!isValidBlock(board, startRow, startCol)) {
                return false;
            }
        }
    }
    
    return true;
}

// Example usage:
const board1 = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
];
console.log(isValidSudoku(board1)); // Output: true

const board2 = [
    ["8","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
];
console.log(isValidSudoku(board2)); // Output: false
