/**
 * Print a 2-D matrix in spiral form (LeetCode 54).
 *
 * Four moving boundaries — top, bottom, left, right — that close in after
 * each pass. The two extra `if` checks prevent re-reading a single
 * remaining row or column.
 *
 * Time  O(rows * cols)
 * Space O(1) beyond the output
 */

/**
 * @param {any[][]} matrix
 * @returns {any[]}
 */
function spiralOrder(matrix) {
  if (!matrix.length || !matrix[0].length) return [];

  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);   // left -> right
    top++;

    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]); // top -> bottom
    right--;

    if (top <= bottom) {
      for (let c = right; c >= left; c--) out.push(matrix[bottom][c]); // right -> left
      bottom--;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) out.push(matrix[r][left]);   // bottom -> top
      left++;
    }
  }

  return out;
}

/**
 * Direction-tracking version: one loop, a direction vector, and a visited
 * marker. Easier to extend to other traversal shapes.
 */
function spiralOrderByDirection(matrix) {
  if (!matrix.length || !matrix[0].length) return [];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
  const out = [];

  let r = 0;
  let c = 0;
  let d = 0;

  for (let i = 0; i < rows * cols; i++) {
    out.push(matrix[r][c]);
    seen[r][c] = true;

    const nr = r + directions[d][0];
    const nc = c + directions[d][1];

    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc]) {
      r = nr;
      c = nc;
    } else {
      d = (d + 1) % 4; // turn
      r += directions[d][0];
      c += directions[d][1];
    }
  }

  return out;
}

/** Build an n x n matrix filled 1..n^2 in spiral order (LeetCode 59). */
function generateSpiralMatrix(n) {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));

  let top = 0;
  let bottom = n - 1;
  let left = 0;
  let right = n - 1;
  let value = 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) matrix[top][c] = value++;
    top++;
    for (let r = top; r <= bottom; r++) matrix[r][right] = value++;
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) matrix[bottom][c] = value++;
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) matrix[r][left] = value++;
      left++;
    }
  }

  return matrix;
}

/** Recursive: peel the outer ring, then recurse on the inside. */
function spiralOrderRecursive(matrix) {
  if (!matrix.length || !matrix[0].length) return [];

  const [first, ...rest] = matrix;
  const inner = rest.map((row) => row.slice(0, -1)).reverse();

  return [
    ...first,
    ...rest.map((row) => row[row.length - 1]),
    ...spiralOrderRecursive(inner.length ? inner[0].map((_, i) => inner.map((r) => r[i])) : []),
  ];
}

// ---- Examples ----
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(spiralOrder(matrix));            // [1,2,3,6,9,8,7,4,5]
console.log(spiralOrderByDirection(matrix)); // same
console.log(spiralOrder([[1, 2, 3, 4]]));    // [1,2,3,4]
console.log(generateSpiralMatrix(3));        // [[1,2,3],[8,9,4],[7,6,5]]

module.exports = { spiralOrder, spiralOrderByDirection, generateSpiralMatrix, spiralOrderRecursive };
