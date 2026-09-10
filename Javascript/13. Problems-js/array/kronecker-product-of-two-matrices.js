/**
 * Kronecker product of two matrices.
 *
 * A (m x n) tensor B (p x q) gives an (m*p) x (n*q) matrix where every
 * entry a[i][j] is replaced by the whole block a[i][j] * B.
 *
 * Time  O(m * n * p * q)
 */

/**
 * @param {number[][]} a
 * @param {number[][]} b
 * @returns {number[][]}
 */
function kroneckerProduct(a, b) {
  const m = a.length;
  const n = a[0].length;
  const p = b.length;
  const q = b[0].length;

  const out = Array.from({ length: m * p }, () => new Array(n * q).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const scale = a[i][j];

      for (let r = 0; r < p; r++) {
        for (let c = 0; c < q; c++) {
          out[i * p + r][j * q + c] = scale * b[r][c];
        }
      }
    }
  }

  return out;
}

/** Ordinary matrix multiplication, for contrast. */
function multiply(a, b) {
  const rows = a.length;
  const inner = b.length;
  const cols = b[0].length;

  const out = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < inner; k++) {
      const aik = a[i][k];
      if (aik === 0) continue;
      for (let j = 0; j < cols; j++) out[i][j] += aik * b[k][j];
    }
  }

  return out;
}

/** Elementwise (Hadamard) product — requires identical dimensions. */
const hadamardProduct = (a, b) => a.map((row, i) => row.map((v, j) => v * b[i][j]));

/** Transpose. */
const transpose = (matrix) => matrix[0].map((_, j) => matrix.map((row) => row[j]));

/** Scalar multiplication. */
const scale = (matrix, k) => matrix.map((row) => row.map((v) => v * k));

/** Kronecker sum: A tensor I + I tensor B, for square matrices. */
function kroneckerSum(a, b) {
  const identity = (n) =>
    Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

  const left = kroneckerProduct(a, identity(b.length));
  const right = kroneckerProduct(identity(a.length), b);

  return left.map((row, i) => row.map((v, j) => v + right[i][j]));
}

// ---- Examples ----
const a = [
  [1, 2],
  [3, 4],
];
const b = [
  [0, 5],
  [6, 7],
];

console.log(kroneckerProduct(a, b));
// [[0,5,0,10],[6,7,12,14],[0,15,0,20],[18,21,24,28]]

console.log(multiply(a, b));         // [[12,19],[24,43]]
console.log(hadamardProduct(a, b));  // [[0,10],[18,28]]
console.log(transpose(a));           // [[1,3],[2,4]]
console.log(scale(a, 2));            // [[2,4],[6,8]]
console.log(kroneckerSum([[1]], [[2]])); // [[3]]

module.exports = { kroneckerProduct, multiply, hadamardProduct, transpose, scale, kroneckerSum };
