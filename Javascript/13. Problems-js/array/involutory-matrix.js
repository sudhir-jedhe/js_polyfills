/**
 * Involutory Matrix.
 *
 * A square matrix A is involutory when A * A = I, i.e. it is its own
 * inverse. Reflections and permutation swaps are the common examples.
 *
 * Time  O(n^3)
 * Space O(n^2)
 */

/** Multiply two square matrices. */
function multiply(a, b) {
  const n = a.length;
  const out = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const aik = a[i][k];
      if (aik === 0) continue;
      for (let j = 0; j < n; j++) out[i][j] += aik * b[k][j];
    }
  }

  return out;
}

/** The n x n identity matrix. */
const identity = (n) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

/**
 * @param {number[][]} matrix
 * @param {number} [epsilon=1e-9] tolerance, for floating point entries
 * @returns {boolean}
 */
function isInvolutory(matrix, epsilon = 1e-9) {
  const n = matrix.length;
  if (n === 0 || matrix.some((row) => row.length !== n)) return false;

  const squared = multiply(matrix, matrix);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const expected = i === j ? 1 : 0;
      if (Math.abs(squared[i][j] - expected) > epsilon) return false;
    }
  }

  return true;
}

/** Idempotent: A * A = A. */
const isIdempotent = (matrix, epsilon = 1e-9) => {
  const squared = multiply(matrix, matrix);
  return squared.every((row, i) => row.every((v, j) => Math.abs(v - matrix[i][j]) <= epsilon));
};

/** Identity check on its own. */
const isIdentity = (matrix, epsilon = 1e-9) =>
  matrix.every((row, i) => row.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) <= epsilon));

// ---- Examples ----
console.log(isInvolutory([
  [1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
])); // true

console.log(isInvolutory([
  [0, 1],
  [1, 0],
])); // true  (a swap is its own inverse)

console.log(isInvolutory([
  [1, 2],
  [3, 4],
])); // false

console.log(isIdempotent([[1, 0], [0, 0]])); // true
console.log(isIdentity(identity(3)));        // true

module.exports = { isInvolutory, isIdempotent, isIdentity, multiply, identity };
