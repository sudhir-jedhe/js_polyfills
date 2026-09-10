/**
 * Rotate a matrix: 90 degrees clockwise and anticlockwise, 180 degrees,
 * and by k * 90 degrees.
 *
 * The in-place trick for a square matrix: TRANSPOSE, then reverse each row.
 * That is LeetCode 48's O(1)-space answer.
 */

/** Transpose in place (square matrices only). */
function transposeInPlace(matrix) {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  return matrix;
}

/** 90 degrees CLOCKWISE, in place: transpose then reverse each row. */
function rotate90InPlace(matrix) {
  transposeInPlace(matrix);
  matrix.forEach((row) => row.reverse());
  return matrix;
}

/** 90 degrees ANTICLOCKWISE, in place: transpose then reverse the rows' order. */
function rotate90CounterInPlace(matrix) {
  transposeInPlace(matrix);
  matrix.reverse();
  return matrix;
}

/** 90 degrees clockwise, non-mutating — works for non-square matrices too. */
const rotate90 = (matrix) =>
  matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());

/** 90 degrees anticlockwise, non-mutating. */
const rotate90Counter = (matrix) =>
  matrix[0].map((_, col) => matrix.map((row) => row[row.length - 1 - col]));

/** 180 degrees: reverse the rows and each row. */
const rotate180 = (matrix) => matrix.map((row) => [...row].reverse()).reverse();

/** 180 degrees in place, swapping opposite cells. */
function rotate180InPlace(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const total = rows * cols;

  for (let i = 0; i < Math.floor(total / 2); i++) {
    const r1 = Math.floor(i / cols);
    const c1 = i % cols;
    const r2 = rows - 1 - r1;
    const c2 = cols - 1 - c1;

    [matrix[r1][c1], matrix[r2][c2]] = [matrix[r2][c2], matrix[r1][c1]];
  }

  return matrix;
}

/** Rotate by k * 90 degrees clockwise (k may be negative). */
function rotateK(matrix, k) {
  const turns = ((k % 4) + 4) % 4;
  let out = matrix.map((row) => [...row]);

  for (let i = 0; i < turns; i++) out = rotate90(out);
  return out;
}

/** Rotate the matrix's CONTENTS right by k positions in reading order. */
function rotateContentsRight(matrix, k) {
  const flat = matrix.flat();
  const n = flat.length;
  const shift = ((k % n) + n) % n;

  const rotated = [...flat.slice(n - shift), ...flat.slice(0, n - shift)];
  const cols = matrix[0].length;

  return Array.from({ length: matrix.length }, (_, r) => rotated.slice(r * cols, r * cols + cols));
}

// ---- Examples ----
const m = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(rotate90(m));         // [[7,4,1],[8,5,2],[9,6,3]]
console.log(rotate90Counter(m));  // [[3,6,9],[2,5,8],[1,4,7]]
console.log(rotate180(m));        // [[9,8,7],[6,5,4],[3,2,1]]
console.log(rotateK(m, -1));      // same as anticlockwise
console.log(rotate90InPlace(m.map((r) => [...r])));
console.log(rotateContentsRight([[1, 2], [3, 4]], 1)); // [[4,1],[2,3]]

module.exports = { rotate90, rotate90Counter, rotate180, rotate90InPlace, rotate90CounterInPlace, rotate180InPlace, rotateK, transposeInPlace, rotateContentsRight };
