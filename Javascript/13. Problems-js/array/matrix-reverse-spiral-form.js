/**
 * Print a matrix in reverse spiral form.
 *
 * Two readings of "reverse spiral": the clockwise spiral read backwards,
 * and an anticlockwise spiral starting from the top-left. Both are here.
 */

/** Clockwise spiral, used as the base. */
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

/** The clockwise spiral, reversed. */
const reverseSpiral = (matrix) => spiralOrder(matrix).reverse();

/**
 * Anticlockwise spiral from the top-left: go down the first column, along
 * the bottom, up the last column, back along the top, then inward.
 */
function antiClockwiseSpiral(matrix) {
  if (!matrix.length || !matrix[0].length) return [];

  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let r = top; r <= bottom; r++) out.push(matrix[r][left]);
    left++;

    for (let c = left; c <= right; c++) out.push(matrix[bottom][c]);
    bottom--;

    if (left <= right) {
      for (let r = bottom; r >= top; r--) out.push(matrix[r][right]);
      right--;
    }

    if (top <= bottom) {
      for (let c = right; c >= left; c--) out.push(matrix[top][c]);
      top++;
    }
  }

  return out;
}

// ---- Examples ----
const m = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

console.log(spiralOrder(m));          // [1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]
console.log(reverseSpiral(m));        // [10,11,7,6,5,9,13,14,15,16,12,8,4,3,2,1]
console.log(antiClockwiseSpiral(m));  // [1,5,9,13,14,15,16,12,8,4,3,2,6,10,11,7]

module.exports = { spiralOrder, reverseSpiral, antiClockwiseSpiral };
