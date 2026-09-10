/**
 * Find the Kth element in the spiral traversal of a matrix.
 *
 * Walking the spiral and stopping at k is O(k); building the whole spiral
 * first is O(rows * cols). The layer-arithmetic version is O(1) space and
 * jumps straight to the answer for the outer rings.
 */

/**
 * Full spiral order, clockwise from the top-left.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
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

/**
 * Kth element (1-based) without materialising the whole spiral:
 * stop as soon as k elements have been visited.
 * Time O(k)
 */
function kthInSpiral(matrix, k) {
  if (k < 1) return undefined;

  let count = 0;
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) if (++count === k) return matrix[top][c];
    top++;

    for (let r = top; r <= bottom; r++) if (++count === k) return matrix[r][right];
    right--;

    if (top <= bottom) {
      for (let c = right; c >= left; c--) if (++count === k) return matrix[bottom][c];
      bottom--;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r--) if (++count === k) return matrix[r][left];
      left++;
    }
  }

  return undefined; // k exceeds the number of elements
}

// ---- Examples ----
const matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];

console.log(spiralOrder(matrix)); // [1,2,3,4,8,12,11,10,9,5,6,7]
console.log(kthInSpiral(matrix, 1));  // 1
console.log(kthInSpiral(matrix, 6));  // 12
console.log(kthInSpiral(matrix, 12)); // 7
console.log(kthInSpiral(matrix, 99)); // undefined

module.exports = { spiralOrder, kthInSpiral };
