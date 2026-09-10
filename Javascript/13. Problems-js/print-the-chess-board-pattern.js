/**
 * Print the chess board pattern.
 *
 * Print a `row x column` grid where cells alternate between "#" and "_",
 * and each row starts with the opposite character of the previous row.
 */

/**
 * @param {number} rows
 * @param {number} cols
 * @returns {string[]} the board, one string per row
 */
function chessboard(rows, cols) {
  const board = [];

  for (let i = 0; i < rows; i++) {
    let line = '';
    for (let j = 0; j < cols; j++) {
      // (i + j) even -> '#', odd -> '_'
      line += (i + j) % 2 === 0 ? '#' : '_';
    }
    board.push(line);
  }

  return board;
}

/** Convenience wrapper that prints the board. */
function printChessboard(rows, cols) {
  chessboard(rows, cols).forEach((line) => console.log(line));
}

// ---- Examples ----
printChessboard(3, 5);
// #_#_#
// _#_#_
// #_#_#

console.log('---');
printChessboard(4, 4);
// #_#_
// _#_#
// #_#_
// _#_#

module.exports = { chessboard, printChessboard };
