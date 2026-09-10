/**
 * Generate an N x N matrix whose secondary diagonal sums to a perfect
 * square, filled with 1..N^2.
 *
 * Fill the matrix row by row with 1..N^2; the secondary diagonal then sums
 * to a known value, and one cell is adjusted to reach the next perfect
 * square at or above it.
 */

/** Integer square-root test. */
function isPerfectSquare(n) {
  if (n < 0) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

/** Smallest perfect square >= n. */
const nextPerfectSquare = (n) => Math.ceil(Math.sqrt(Math.max(0, n))) ** 2;

/** Sum of the secondary diagonal (top-right to bottom-left). */
const secondaryDiagonalSum = (matrix) =>
  matrix.reduce((sum, row, i) => sum + row[matrix.length - 1 - i], 0);

/**
 * @param {number} n
 * @returns {number[][]}
 */
function generateMatrix(n) {
  // Fill with 1..n^2 row by row.
  const matrix = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => r * n + c + 1)
  );

  const current = secondaryDiagonalSum(matrix);
  const target = nextPerfectSquare(current);
  const delta = target - current;

  // Push the whole difference into the top-right diagonal cell.
  if (delta > 0) matrix[0][n - 1] += delta;

  return matrix;
}

/** Verify the construction. */
const verify = (matrix) => ({
  sum: secondaryDiagonalSum(matrix),
  isPerfectSquare: isPerfectSquare(secondaryDiagonalSum(matrix)),
});

/** Primary diagonal sum, for comparison. */
const primaryDiagonalSum = (matrix) => matrix.reduce((sum, row, i) => sum + row[i], 0);

/** A magic square of odd order, where every line sums to the same value. */
function magicSquare(n) {
  if (n % 2 === 0) throw new Error('This construction needs an odd n');

  const square = Array.from({ length: n }, () => new Array(n).fill(0));
  let row = 0;
  let col = Math.floor(n / 2);

  for (let value = 1; value <= n * n; value++) {
    square[row][col] = value;

    const nextRow = (row - 1 + n) % n;
    const nextCol = (col + 1) % n;

    if (square[nextRow][nextCol] === 0) {
      row = nextRow;
      col = nextCol;
    } else {
      row = (row + 1) % n;
    }
  }

  return square;
}

// ---- Examples ----
const m = generateMatrix(3);
console.log(m);
console.log(verify(m));                 // { sum: <perfect square>, isPerfectSquare: true }
console.log(secondaryDiagonalSum([[1, 2], [3, 4]])); // 2 + 3 = 5
console.log(primaryDiagonalSum([[1, 2], [3, 4]]));   // 1 + 4 = 5
console.log(magicSquare(3));            // every row/column/diagonal sums to 15

module.exports = { generateMatrix, secondaryDiagonalSum, primaryDiagonalSum, isPerfectSquare, nextPerfectSquare, magicSquare, verify };
