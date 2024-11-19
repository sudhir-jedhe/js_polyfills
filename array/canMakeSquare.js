function canMakeSquare(grid: string[][]): boolean {
    const dirs: number[] = [0, 0, 1, 1, 0];
    for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 2; ++j) {
            let [cnt1, cnt2] = [0, 0];
            for (let k = 0; k < 4; ++k) {
                const [x, y] = [i + dirs[k], j + dirs[k + 1]];
                if (grid[x][y] === 'W') {
                    ++cnt1;
                } else {
                    ++cnt2;
                }
            }
            if (cnt1 !== cnt2) {
                return true;
            }
        }
    }
    return false;
}


// You are given a 2D matrix grid of size 3 x 3 consisting only of characters 'B' and 'W'. Character 'W' represents the white color, and character 'B' represents the black color.

// Your task is to change the color of at most one cell so that the matrix has a 2 x 2 square where all cells are of the same color.

// Return true if it is possible to create a 2 x 2 square of the same color, otherwise, return false.

 

// Example 1:

 
 
 
 
 
 
 
 
 
// Input: grid = [["B","W","B"],["B","W","W"],["B","W","B"]]

// Output: true

// Explanation:

// It can be done by changing the color of the grid[0][2].

// Example 2:

 
 
 
 
 
 
 
 
 
// Input: grid = [["B","W","B"],["W","B","W"],["B","W","B"]]

// Output: false

// Explanation:

// It cannot be done by changing at most one cell.

// Example 3:

 
 
 
 
 
 
 
 
 
// Input: grid = [["B","W","B"],["B","W","W"],["B","W","W"]]

// Output: true

// Explanation:

// The grid already contains a 2 x 2 square of the same color.

 

// Constraints:

// grid.length == 3
// grid[i].length == 3
// grid[i][j] is either 'W' or 'B'.