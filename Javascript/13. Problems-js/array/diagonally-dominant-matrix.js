/**
 * Diagonally dominant matrix.
 *
 * A square matrix is diagonally dominant when, for every row, the absolute
 * value of the diagonal entry is at least the sum of the absolute values of
 * the other entries in that row.
 *
 * Time  O(n^2)
 * Space O(1)
 */

/**
 * @param {number[][]} matrix
 * @param {boolean} [strict=false] require > instead of >=
 * @returns {boolean}
 */
function isDiagonallyDominant(matrix, strict = false) {
  const n = matrix.length;
  if (n === 0 || matrix.some((row) => row.length !== n)) return false;

  for (let i = 0; i < n; i++) {
    let offDiagonalSum = 0;

    for (let j = 0; j < n; j++) {
      if (i !== j) offDiagonalSum += Math.abs(matrix[i][j]);
    }

    const diagonal = Math.abs(matrix[i][i]);
    if (strict ? diagonal <= offDiagonalSum : diagonal < offDiagonalSum) return false;
  }

  return true;
}

/** Which rows fail, and by how much — useful for debugging a system. */
function dominanceReport(matrix) {
  return matrix.map((row, i) => {
    const offDiagonalSum = row.reduce((sum, v, j) => (i === j ? sum : sum + Math.abs(v)), 0);
    const diagonal = Math.abs(row[i]);
    return { row: i, diagonal, offDiagonalSum, dominant: diagonal >= offDiagonalSum };
  });
}

/** Column-wise dominance, the transposed condition. */
function isColumnDiagonallyDominant(matrix) {
  const n = matrix.length;

  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) if (i !== j) sum += Math.abs(matrix[i][j]);
    if (Math.abs(matrix[j][j]) < sum) return false;
  }

  return true;
}

/**
 * Try to make a matrix diagonally dominant by permuting rows so the largest
 * entry of each column sits on the diagonal. Returns null when impossible
 * with a simple greedy pass.
 */
function makeDominantByRowSwap(matrix) {
  const n = matrix.length;
  const used = new Array(n).fill(false);
  const order = new Array(n).fill(-1);

  for (let col = 0; col < n; col++) {
    let bestRow = -1;

    for (let row = 0; row < n; row++) {
      if (used[row]) continue;
      const rest = matrix[row].reduce((s, v, j) => (j === col ? s : s + Math.abs(v)), 0);
      if (Math.abs(matrix[row][col]) >= rest && (bestRow === -1 || Math.abs(matrix[row][col]) > Math.abs(matrix[bestRow][col]))) {
        bestRow = row;
      }
    }

    if (bestRow === -1) return null;
    used[bestRow] = true;
    order[col] = bestRow;
  }

  return order.map((row) => matrix[row]);
}

// ---- Examples ----
console.log(isDiagonallyDominant([
  [3, -2, 1],
  [1, -3, 2],
  [-1, 2, 4],
])); // true

console.log(isDiagonallyDominant([
  [-2, 2, 1],
  [1, 3, 2],
  [1, -2, 0],
])); // false

console.log(dominanceReport([[3, 1], [1, 2]]));
console.log(isColumnDiagonallyDominant([[3, 1], [1, 2]])); // true
console.log(makeDominantByRowSwap([[1, 5], [4, 1]]));      // reordered rows

module.exports = { isDiagonallyDominant, dominanceReport, isColumnDiagonallyDominant, makeDominantByRowSwap };
