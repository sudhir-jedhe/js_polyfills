/**
 * Absolute difference between the diagonals of a square matrix.
 *
 * Primary diagonal: matrix[i][i]
 * Secondary diagonal: matrix[i][n - 1 - i]
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {number[][]} matrix square
 * @returns {number}
 */
function diagonalDifference(matrix) {
  const n = matrix.length;
  let primary = 0;
  let secondary = 0;

  for (let i = 0; i < n; i++) {
    primary += matrix[i][i];
    secondary += matrix[i][n - 1 - i];
  }

  return Math.abs(primary - secondary);
}

/** Both diagonals as arrays. */
const diagonals = (matrix) => ({
  primary: matrix.map((row, i) => row[i]),
  secondary: matrix.map((row, i) => row[matrix.length - 1 - i]),
});

/** Their sums, without the absolute difference. */
function diagonalSums(matrix) {
  const { primary, secondary } = diagonals(matrix);
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  return { primary: sum(primary), secondary: sum(secondary) };
}

/**
 * LeetCode 1572: sum of both diagonals, counting the centre only once
 * for an odd-sized matrix.
 */
function matrixDiagonalSum(matrix) {
  const n = matrix.length;
  let total = 0;

  for (let i = 0; i < n; i++) {
    total += matrix[i][i];
    if (i !== n - 1 - i) total += matrix[i][n - 1 - i];
  }

  return total;
}

// ---- Examples ----
const m = [
  [11, 2, 4],
  [4, 5, 6],
  [10, 8, -12],
];

console.log(diagonalDifference(m));  // 15  (|4 - 19|)
console.log(diagonals(m));           // { primary: [11,5,-12], secondary: [4,5,10] }
console.log(diagonalSums(m));        // { primary: 4, secondary: 19 }
console.log(matrixDiagonalSum([[1, 2], [3, 4]])); // 10
console.log(matrixDiagonalSum(m));   // 23  (centre 5 counted once)

module.exports = { diagonalDifference, diagonals, diagonalSums, matrixDiagonalSum };
