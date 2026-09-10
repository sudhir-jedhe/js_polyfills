/**
 * Check whether a matrix is upper triangular.
 *
 * Upper triangular: every entry BELOW the main diagonal is zero,
 * i.e. matrix[i][j] === 0 for all i > j.
 *
 * Time  O(n^2)
 * Space O(1)
 */

/**
 * @param {number[][]} matrix square matrix
 * @returns {boolean}
 */
function isUpperTriangular(matrix) {
  const n = matrix.length;
  if (n === 0 || matrix.some((row) => row.length !== n)) return false;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (matrix[i][j] !== 0) return false;
    }
  }

  return true;
}

/** Lower triangular: every entry ABOVE the diagonal is zero. */
function isLowerTriangular(matrix) {
  const n = matrix.length;
  if (n === 0 || matrix.some((row) => row.length !== n)) return false;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] !== 0) return false;
    }
  }

  return true;
}

/** Diagonal: both upper and lower triangular. */
const isDiagonal = (matrix) => isUpperTriangular(matrix) && isLowerTriangular(matrix);

/** Symmetric: matrix[i][j] === matrix[j][i]. */
function isSymmetric(matrix) {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] !== matrix[j][i]) return false;
    }
  }

  return true;
}

/**
 * Determinant of a triangular matrix is just the product of the diagonal —
 * a nice payoff for recognising the shape.
 */
const triangularDeterminant = (matrix) => matrix.reduce((acc, row, i) => acc * row[i], 1);

/** Identity check. */
const isIdentityMatrix = (matrix) =>
  matrix.every((row, i) => row.every((v, j) => v === (i === j ? 1 : 0)));

// ---- Examples ----
const upper = [
  [1, 2, 3],
  [0, 4, 5],
  [0, 0, 6],
];

console.log(isUpperTriangular(upper));          // true
console.log(isLowerTriangular(upper));          // false
console.log(isLowerTriangular([[1, 0], [2, 3]]));// true
console.log(isDiagonal([[1, 0], [0, 2]]));      // true
console.log(isSymmetric([[1, 7], [7, 3]]));     // true
console.log(triangularDeterminant(upper));      // 24
console.log(isIdentityMatrix([[1, 0], [0, 1]]));// true

module.exports = { isUpperTriangular, isLowerTriangular, isDiagonal, isSymmetric, triangularDeterminant, isIdentityMatrix };
