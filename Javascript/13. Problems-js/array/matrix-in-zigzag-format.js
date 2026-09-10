/**
 * Print a matrix in zigzag (boustrophedon) format.
 *
 * Row 0 left to right, row 1 right to left, and so on. The diagonal zigzag
 * (JPEG order) is a different traversal, also here.
 *
 * Time  O(rows * cols)
 */

/** Row-wise zigzag: alternate the direction of each row. */
const zigzagRows = (matrix) =>
  matrix.flatMap((row, i) => (i % 2 === 0 ? row : [...row].reverse()));

/** Column-wise zigzag: down the first column, up the second, and so on. */
function zigzagColumns(matrix) {
  const out = [];
  const cols = matrix[0].length;

  for (let c = 0; c < cols; c++) {
    if (c % 2 === 0) {
      for (let r = 0; r < matrix.length; r++) out.push(matrix[r][c]);
    } else {
      for (let r = matrix.length - 1; r >= 0; r--) out.push(matrix[r][c]);
    }
  }

  return out;
}

/**
 * Diagonal zigzag (LeetCode 498) — the JPEG scan order.
 * Cells on one anti-diagonal share (row + col); alternate the direction
 * each diagonal is read in.
 */
function zigzagDiagonal(matrix) {
  if (!matrix.length || !matrix[0].length) return [];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const out = [];

  for (let d = 0; d < rows + cols - 1; d++) {
    const diagonal = [];

    // r ranges over the valid rows on this anti-diagonal.
    const startRow = Math.max(0, d - cols + 1);
    const endRow = Math.min(d, rows - 1);

    for (let r = startRow; r <= endRow; r++) diagonal.push(matrix[r][d - r]);

    out.push(...(d % 2 === 0 ? diagonal.reverse() : diagonal));
  }

  return out;
}

/** Zigzag level order of a binary-tree-like level array. */
const zigzagLevels = (levels) =>
  levels.map((level, i) => (i % 2 === 0 ? level : [...level].reverse()));

/** Reconstruct a matrix from its row-wise zigzag reading. */
function fromZigzagRows(values, cols) {
  const out = [];

  for (let i = 0; i < values.length; i += cols) {
    const row = values.slice(i, i + cols);
    out.push(out.length % 2 === 0 ? row : row.reverse());
  }

  return out;
}

// ---- Examples ----
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(zigzagRows(matrix));     // [1,2,3,6,5,4,7,8,9]
console.log(zigzagColumns(matrix));  // [1,4,7,8,5,2,3,6,9]
console.log(zigzagDiagonal(matrix)); // [1,2,4,7,5,3,6,8,9]
console.log(zigzagLevels([[1], [2, 3], [4, 5, 6]])); // [[1],[3,2],[4,5,6]]
console.log(fromZigzagRows([1, 2, 3, 6, 5, 4], 3));  // [[1,2,3],[4,5,6]]

module.exports = { zigzagRows, zigzagColumns, zigzagDiagonal, zigzagLevels, fromZigzagRows };
