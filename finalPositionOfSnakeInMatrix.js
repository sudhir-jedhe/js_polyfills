
https://leetcode.ca/blog/

function finalPositionOfSnake(n: number, commands: string[]): number {
    let [x, y] = [0, 0];
    for (const c of commands) {
        c[0] === 'U' && x--;
        c[0] === 'D' && x++;
        c[0] === 'L' && y--;
        c[0] === 'R' && y++;
    }
    return x * n + y;
}


There is a  snake in an n x n matrix grid and can move in four possible directions. Each cell in the grid is identified by the position: grid[i][j] = (i * n) + j.

The snake starts at cell 0 and follows a sequence of commands.

You are given an integer n representing the size of the grid and an array of strings commands where each command[i] is either "UP", "RIGHT", "DOWN", and "LEFT". It's guaranteed that the snake will remain within the grid boundaries throughout its movement.

Return the position of the final cell where the snake ends up after executing commands.

 

Example 1:

Input: n = 2, commands = ["RIGHT","DOWN"]

Output: 3

Explanation:

0	1
2	3


0	1
2	3

0	1
2	3
Example 2:

Input: n = 3, commands = ["DOWN","RIGHT","UP"]

Output: 1

Explanation:

0	1	2
3	4	5
6	7	8

0	1	2
3	4	5
6	7	8

0	1	2
3	4	5
6	7	8

0	1	2
3	4	5
6	7	8
 