/**
 * Print a matrix in L pattern.
 *
 * Each "L" is one nested ring drawn as a right-angle: the left column
 * downward, then the bottom row rightward. Peeling L after L covers the
 * whole matrix.
 *
 * Time  O(rows * cols)
 */

/** A single L: column `k` downward, then row `bottom` rightward. */
function lShape(matrix, k) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const out = [];

  if (k >= Math.min(rows, cols)) return out;

  for (let r = k; r < rows; r++) out.push(matrix[r][k]);
  for (let c = k + 1; c < cols; c++) out.push(matrix[rows - 1][c]);

  return out;
}

/** All the nested Ls, outermost first. */
function printLPattern(matrix) {
  const layers = Math.min(matrix.length, matrix[0].length);
  return Array.from({ length: layers }, (_, k) => lShape(matrix, k));
}

/** Flattened into a single traversal. */
const lPatternFlat = (matrix) => printLPattern(matrix).flat();

/**
 * Mirror-image L: the top row rightward, then the right column downward
 * (sometimes called the Gamma pattern).
 */
function gammaShape(matrix, k) {
  const cols = matrix[0].length;
  const rows = matrix.length;
  const out = [];

  for (let c = k; c < cols; c++) out.push(matrix[k][c]);
  for (let r = k + 1; r < rows; r++) out.push(matrix[r][cols - 1]);

  return out;
}

/** Render the L pattern as a picture, blanking everything else. */
function renderL(matrix, k = 0) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  return matrix.map((row, r) =>
    row.map((v, c) => (c === k && r >= k) || (r === rows - 1 && c >= k) ? String(v) : ' ')
      .join(' ')
  );
}

/** Every ring (the full rectangle border at each depth). */
function rings(matrix) {
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    const ring = [];

    for (let c = left; c <= right; c++) ring.push(matrix[top][c]);
    for (let r = top + 1; r <= bottom; r++) ring.push(matrix[r][right]);
    if (top < bottom) for (let c = right - 1; c >= left; c--) ring.push(matrix[bottom][c]);
    if (left < right) for (let r = bottom - 1; r > top; r--) ring.push(matrix[r][left]);

    out.push(ring);
    top++;
    bottom--;
    left++;
    right--;
  }

  return out;
}

// ---- Examples ----
const matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

console.log(lShape(matrix, 0));       // [1,5,9,13,14,15,16]
console.log(printLPattern(matrix));   // nested Ls
console.log(lPatternFlat(matrix));
console.log(gammaShape(matrix, 0));   // [1,2,3,4,8,12,16]
renderL(matrix).forEach((line) => console.log(line));
console.log(rings(matrix));

module.exports = { lShape, printLPattern, lPatternFlat, gammaShape, renderL, rings };
