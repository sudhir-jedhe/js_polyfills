/**
 * Hilbert matrix.
 *
 * H[i][j] = 1 / (i + j + 1) for 0-based indexes.
 * It is symmetric, positive definite, and famously ill-conditioned —
 * a standard test case for numerical linear algebra.
 */

/**
 * @param {number} n
 * @returns {number[][]}
 */
const hilbertMatrix = (n) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => 1 / (i + j + 1)));

/** As exact fractions, which avoids the floating point noise. */
const hilbertMatrixFractions = (n) =>
  Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => `1/${i + j + 1}`)
  );

/** Rounded for display. */
const hilbertMatrixRounded = (n, decimals = 4) =>
  hilbertMatrix(n).map((row) => row.map((v) => Number(v.toFixed(decimals))));

/** Is a matrix a Hilbert matrix (within a tolerance)? */
function isHilbertMatrix(matrix, epsilon = 1e-9) {
  const n = matrix.length;

  return matrix.every(
    (row, i) => row.length === n && row.every((v, j) => Math.abs(v - 1 / (i + j + 1)) <= epsilon)
  );
}

/** Symmetry check — every Hilbert matrix is symmetric. */
const isSymmetric = (matrix) =>
  matrix.every((row, i) => row.every((v, j) => Math.abs(v - matrix[j][i]) < 1e-12));

/**
 * The determinant of a Hilbert matrix shrinks extremely fast — this is the
 * concrete reason the matrix is hard to invert numerically.
 */
function determinant(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => [...row]); // work on a copy
  let det = 1;

  for (let i = 0; i < n; i++) {
    // Partial pivoting for numerical stability.
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(m[r][i]) > Math.abs(m[pivot][i])) pivot = r;
    }

    if (Math.abs(m[pivot][i]) < 1e-15) return 0;

    if (pivot !== i) {
      [m[i], m[pivot]] = [m[pivot], m[i]];
      det = -det;
    }

    det *= m[i][i];

    for (let r = i + 1; r < n; r++) {
      const factor = m[r][i] / m[i][i];
      for (let c = i; c < n; c++) m[r][c] -= factor * m[i][c];
    }
  }

  return det;
}

// ---- Examples ----
console.log(hilbertMatrixRounded(3));
// [[1, 0.5, 0.3333], [0.5, 0.3333, 0.25], [0.3333, 0.25, 0.2]]

console.log(hilbertMatrixFractions(3));
console.log(isHilbertMatrix(hilbertMatrix(4)));  // true
console.log(isSymmetric(hilbertMatrix(4)));      // true
console.log(determinant(hilbertMatrix(3)));      // ~0.000463
console.log(determinant(hilbertMatrix(5)));      // ~3.7e-12 — nearly singular

module.exports = { hilbertMatrix, hilbertMatrixFractions, hilbertMatrixRounded, isHilbertMatrix, isSymmetric, determinant };
