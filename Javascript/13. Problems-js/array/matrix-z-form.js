/**
 * Print a matrix in Z form.
 *
 * The Z shape: the whole first row, then the main diagonal downward, then
 * the whole last row. Corners are visited once.
 *
 * Time  O(n)
 * Space O(1) beyond the output
 */

/**
 * @param {any[][]} matrix square
 * @returns {any[]}
 */
function printZForm(matrix) {
  const n = matrix.length;
  if (n === 0) return [];
  if (n === 1) return [...matrix[0]];

  const out = [];

  // Top row, left to right.
  for (let c = 0; c < n; c++) out.push(matrix[0][c]);

  // Secondary diagonal, skipping the corners already taken.
  for (let i = 1; i < n - 1; i++) out.push(matrix[i][n - 1 - i]);

  // Bottom row, left to right.
  for (let c = 0; c < n; c++) out.push(matrix[n - 1][c]);

  return out;
}

/** N form: first column down, main diagonal up, last column down. */
function printNForm(matrix) {
  const n = matrix.length;
  const out = [];

  for (let r = 0; r < n; r++) out.push(matrix[r][0]);
  for (let i = n - 2; i > 0; i--) out.push(matrix[i][n - 1 - i]);
  for (let r = 0; r < n; r++) out.push(matrix[r][n - 1]);

  return out;
}

/** X form: both diagonals. */
function printXForm(matrix) {
  const n = matrix.length;
  const out = [];

  for (let i = 0; i < n; i++) {
    out.push(matrix[i][i]);
    if (i !== n - 1 - i) out.push(matrix[i][n - 1 - i]);
  }

  return out;
}

/** L form: first column down, then the bottom row. */
function printLForm(matrix) {
  const n = matrix.length;
  const out = [];

  for (let r = 0; r < n; r++) out.push(matrix[r][0]);
  for (let c = 1; c < matrix[0].length; c++) out.push(matrix[n - 1][c]);

  return out;
}

/** Render the Z as a picture, blanking the cells that are not on it. */
function renderZ(matrix) {
  const n = matrix.length;

  return matrix.map((row, r) =>
    row.map((v, c) => (r === 0 || r === n - 1 || c === n - 1 - r ? String(v) : ' ')).join(' ')
  );
}

// ---- Examples ----
const matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

console.log(printZForm(matrix));  // [1,2,3,4,7,10,13,14,15,16]
console.log(printNForm(matrix));  // [1,5,9,13,10,7,4,8,12,16]
console.log(printXForm(matrix));  // both diagonals
console.log(printLForm(matrix));  // [1,5,9,13,14,15,16]
renderZ(matrix).forEach((line) => console.log(line));

module.exports = { printZForm, printNForm, printXForm, printLForm, renderZ };
