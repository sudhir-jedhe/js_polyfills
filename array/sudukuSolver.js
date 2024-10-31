function solveSudoku(board) {
    function isValid(board, row, col, num) {
        const blockRowStart = Math.floor(row / 3) * 3;
        const blockColStart = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false; // Check row
            if (board[i][col] === num) return false; // Check column
            if (board[blockRowStart + Math.floor(i / 3)][blockColStart + i % 3] === num) return false; // Check 3x3 block
        }
        
        return true;
    }
    
    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
                                return true;
                            } else {
                                board[row][col] = '.'; // Backtrack
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true; // Board is solved
    }
    
    solve(board);
    return board;
}

// Example usage:
const board = [
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

console.log(solveSudoku(board));
