/**
 * Upper Hessenberg matrix.
 *
 * An upper Hessenberg matrix has zeros everywhere below the FIRST
 * subdiagonal: matrix[i][j] === 0 whenever i > j + 1. It is "almost upper
 * triangular", and it is the shape QR algorithms reduce a matrix to before
 * finding eigenvalues.
 *
 * Time  O(n^2)
 */

/**
 * @param {number[][]} matrix square
 * @returns {boolean}
 */
function isUpperHessenberg(matrix) {
  const n = matrix.length;
  if (n === 0 || matrix.some((row) => row.length !== n)) return false;

  for (let i = 2; i < n; i++) {
    for (let j = 0; j < i - 1; j++) {
      if (matrix[i][j] !== 0) return false;
    }
  }

  return true;
}

/** Lower Hessenberg: zeros above the first superdiagonal. */
function isLowerHessenberg(matrix) {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (matrix[i][j] !== 0) return false;
    }
  }

  return true;
}

/** Tridiagonal: both upper and lower Hessenberg. */
const isTridiagonal = (matrix) => isUpperHessenberg(matrix) && isLowerHessenberg(matrix);

/**
 * Generate an n x n upper Hessenberg matrix, filled with sequential values
 * above the subdiagonal and zeros below it.
 */
function generateUpperHessenberg(n, valueFn = (i, j) => i + j + 1) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i > j + 1 ? 0 : valueFn(i, j)))
  );
}

/** Zero out everything below the first subdiagonal of an existing matrix. */
const toUpperHessenberg = (matrix) =>
  matrix.map((row, i) => row.map((v, j) => (i > j + 1 ? 0 : v)));

/** Print with aligned columns. */
function format(matrix, width = 4) {
  return matrix.map((row) => row.map((v) => String(v).padStart(width)).join('')).join('\n');
}

/** The band width: how many diagonals below the main one are non-zero. */
function lowerBandwidth(matrix) {
  let band = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < i; j++) {
      if (matrix[i][j] !== 0) band = Math.max(band, i - j);
    }
  }

  return band;
}

// ---- Examples ----
const hessenberg = generateUpperHessenberg(4);
console.log(format(hessenberg));
console.log(isUpperHessenberg(hessenberg));  // true

console.log(isUpperHessenberg([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
])); // false — 7 is below the subdiagonal

console.log(isTridiagonal([
  [1, 2, 0],
  [3, 4, 5],
  [0, 6, 7],
])); // true

console.log(lowerBandwidth(hessenberg)); // 1

module.exports = { isUpperHessenberg, isLowerHessenberg, isTridiagonal, generateUpperHessenberg, toUpperHessenberg, format, lowerBandwidth };
