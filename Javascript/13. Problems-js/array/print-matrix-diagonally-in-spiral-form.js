/**
 * Print matrix elements diagonally, and diagonally in spiral form.
 *
 * Cells on one anti-diagonal share (row + col); cells on one main diagonal
 * share (row - col). Grouping by those keys makes every diagonal traversal
 * a one-liner over the groups.
 */

/** Anti-diagonals, top-left to bottom-right, each read downward. */
function antiDiagonals(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const groups = Array.from({ length: rows + cols - 1 }, () => []);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) groups[r + c].push(matrix[r][c]);
  }

  return groups;
}

/** Main diagonals, grouped by (row - col). */
function mainDiagonals(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const groups = new Map();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = r - c;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(matrix[r][c]);
    }
  }

  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([, values]) => values);
}

/** Flat diagonal traversal — every anti-diagonal in order. */
const diagonalOrder = (matrix) => antiDiagonals(matrix).flat();

/** Zigzag diagonal (LeetCode 498): alternate the direction of each diagonal. */
const zigzagDiagonal = (matrix) =>
  antiDiagonals(matrix).flatMap((group, i) => (i % 2 === 0 ? [...group].reverse() : group));

/**
 * Diagonal SPIRAL: read the diagonals from the outside inward, alternating
 * which end you start from — the diagonal analogue of a spiral walk.
 */
function diagonalSpiral(matrix) {
  const groups = antiDiagonals(matrix);
  const out = [];

  let front = 0;
  let back = groups.length - 1;
  let takeFront = true;

  while (front <= back) {
    if (takeFront) out.push(...groups[front++]);
    else out.push(...[...groups[back--]].reverse());

    takeFront = !takeFront;
  }

  return out;
}

/** The classic ring spiral, for comparison. */
function spiralOrder(matrix) {
  if (!matrix.length || !matrix[0].length) return [];

  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) out.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) out.push(matrix[r][left]);
      left++;
    }
  }

  return out;
}

// ---- Examples ----
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(antiDiagonals(matrix)); // [[1],[2,4],[3,5,7],[6,8],[9]]
console.log(mainDiagonals(matrix)); // grouped by r - c
console.log(diagonalOrder(matrix)); // [1,2,4,3,5,7,6,8,9]
console.log(zigzagDiagonal(matrix));// [1,2,4,7,5,3,6,8,9]
console.log(diagonalSpiral(matrix));
console.log(spiralOrder(matrix));   // [1,2,3,6,9,8,7,4,5]

module.exports = { antiDiagonals, mainDiagonals, diagonalOrder, zigzagDiagonal, diagonalSpiral, spiralOrder };
