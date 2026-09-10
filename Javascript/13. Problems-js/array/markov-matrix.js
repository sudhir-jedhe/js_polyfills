/**
 * Markov (stochastic) matrix.
 *
 * A right-stochastic matrix has non-negative entries and every ROW summing
 * to 1 — each row is a probability distribution over the next state.
 *
 * Time  O(n^2)
 */

const EPSILON = 1e-9;

/**
 * @param {number[][]} matrix
 * @returns {boolean}
 */
function isMarkovMatrix(matrix, epsilon = EPSILON) {
  if (!matrix.length) return false;

  return matrix.every((row) => {
    if (row.some((v) => v < -epsilon)) return false; // no negative probabilities
    const sum = row.reduce((a, b) => a + b, 0);
    return Math.abs(sum - 1) <= epsilon;
  });
}

/** Column-stochastic: every COLUMN sums to 1. */
function isColumnStochastic(matrix, epsilon = EPSILON) {
  const cols = matrix[0].length;

  for (let c = 0; c < cols; c++) {
    let sum = 0;
    for (let r = 0; r < matrix.length; r++) {
      if (matrix[r][c] < -epsilon) return false;
      sum += matrix[r][c];
    }
    if (Math.abs(sum - 1) > epsilon) return false;
  }

  return true;
}

/** Doubly stochastic: rows AND columns sum to 1. */
const isDoublyStochastic = (matrix) => isMarkovMatrix(matrix) && isColumnStochastic(matrix);

/** Normalise each row so it sums to 1. */
const normaliseRows = (matrix) =>
  matrix.map((row) => {
    const sum = row.reduce((a, b) => a + b, 0);
    return sum === 0 ? row.map(() => 0) : row.map((v) => v / sum);
  });

/** Multiply two matrices. */
function multiply(a, b) {
  const rows = a.length;
  const inner = b.length;
  const cols = b[0].length;
  const out = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < inner; k++) {
      for (let j = 0; j < cols; j++) out[i][j] += a[i][k] * b[k][j];
    }
  }

  return out;
}

/** Advance a state distribution one step: row vector times the matrix. */
const step = (distribution, matrix) =>
  matrix[0].map((_, j) => distribution.reduce((sum, p, i) => sum + p * matrix[i][j], 0));

/** Run n steps from a starting distribution. */
function stepN(distribution, matrix, n) {
  let current = [...distribution];
  for (let i = 0; i < n; i++) current = step(current, matrix);
  return current;
}

/**
 * The steady-state distribution, found by iterating until it stops moving.
 * Exists for any irreducible aperiodic chain.
 */
function steadyState(matrix, iterations = 1000, tolerance = 1e-12) {
  let current = new Array(matrix.length).fill(1 / matrix.length);

  for (let i = 0; i < iterations; i++) {
    const next = step(current, matrix);
    const delta = next.reduce((max, v, j) => Math.max(max, Math.abs(v - current[j])), 0);
    current = next;
    if (delta < tolerance) break;
  }

  return current;
}

// ---- Examples ----
const markov = [
  [0.5, 0.5],
  [0.2, 0.8],
];

console.log(isMarkovMatrix(markov));            // true
console.log(isMarkovMatrix([[0.5, 0.6]]));      // false
console.log(isColumnStochastic([[0.5, 0.5], [0.5, 0.5]])); // true
console.log(normaliseRows([[2, 2], [1, 3]]));   // [[0.5,0.5],[0.25,0.75]]
console.log(step([1, 0], markov));              // [0.5, 0.5]
console.log(stepN([1, 0], markov, 5).map((n) => Number(n.toFixed(4))));
console.log(steadyState(markov).map((n) => Number(n.toFixed(4)))); // ~[0.2857, 0.7143]

module.exports = { isMarkovMatrix, isColumnStochastic, isDoublyStochastic, normaliseRows, multiply, step, stepN, steadyState };
