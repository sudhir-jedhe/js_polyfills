/**
 * Set Matrix Zeroes (LeetCode 73).
 *
 * If a cell is 0, set its whole row and column to 0. The trap is doing it
 * in place: writing zeros as you go would cascade, so the positions must be
 * recorded first.
 *
 * The O(1)-space trick uses the first row and column as the marker storage.
 */

/** O(m + n) space: remember which rows and columns to clear. */
function setZeroes(matrix) {
  const rows = new Set();
  const cols = new Set();

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === 0) {
        rows.add(r);
        cols.add(c);
      }
    }
  }

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (rows.has(r) || cols.has(c)) matrix[r][c] = 0;
    }
  }

  return matrix;
}

/**
 * O(1) space: the first row and column store the markers. Their own state
 * has to be captured separately before they are overwritten.
 */
function setZeroesInPlace(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  let firstRowHasZero = false;
  let firstColHasZero = false;

  for (let c = 0; c < cols; c++) if (matrix[0][c] === 0) firstRowHasZero = true;
  for (let r = 0; r < rows; r++) if (matrix[r][0] === 0) firstColHasZero = true;

  // Mark in the first row / column.
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }

  // Apply the marks to the interior.
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }

  if (firstRowHasZero) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstColHasZero) for (let r = 0; r < rows; r++) matrix[r][0] = 0;

  return matrix;
}

/** Non-mutating version. */
function withZeroesSet(matrix) {
  const rows = new Set();
  const cols = new Set();

  matrix.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === 0) {
        rows.add(r);
        cols.add(c);
      }
    })
  );

  return matrix.map((row, r) => row.map((v, c) => (rows.has(r) || cols.has(c) ? 0 : v)));
}

/** The same idea with any sentinel value, not just 0. */
function setMatching(matrix, sentinel, fill = sentinel) {
  const rows = new Set();
  const cols = new Set();

  matrix.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === sentinel) {
        rows.add(r);
        cols.add(c);
      }
    })
  );

  return matrix.map((row, r) => row.map((v, c) => (rows.has(r) || cols.has(c) ? fill : v)));
}

/** Print with aligned columns. */
const format = (matrix) => matrix.map((row) => row.join(' ')).join('\n');

// ---- Examples ----
const m1 = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

console.log(format(setZeroes(m1.map((r) => [...r]))));
console.log('---');

const m2 = [
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5],
];

console.log(format(setZeroesInPlace(m2.map((r) => [...r]))));
console.log('---');
console.log(format(withZeroesSet(m2)));

module.exports = { setZeroes, setZeroesInPlace, withZeroesSet, setMatching, format };
