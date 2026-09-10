/**
 * Unique paths in a grid (LeetCode 62 / 63).
 *
 * Moving only right or down from the top-left to the bottom-right.
 * The count is C(m+n-2, m-1); the DP version generalises to obstacles.
 */

/**
 * Count paths in an m x n grid.
 * Time  O(m * n), Space O(n)
 */
function uniquePaths(m, n) {
  const row = new Array(n).fill(1);

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1]; // from above + from the left
    }
  }

  return row[n - 1];
}

/** Closed form: C(m + n - 2, m - 1). O(min(m, n)) and exact. */
function uniquePathsCombinatorial(m, n) {
  let result = 1;
  const k = Math.min(m, n) - 1;

  for (let i = 1; i <= k; i++) {
    result = (result * (m + n - 1 - i)) / i;
  }

  return Math.round(result);
}

/** With obstacles: a 1 in the grid blocks that cell (LeetCode 63). */
function uniquePathsWithObstacles(grid) {
  if (!grid.length || grid[0][0] === 1) return 0;

  const n = grid[0].length;
  const row = new Array(n).fill(0);
  row[0] = 1;

  for (const gridRow of grid) {
    for (let c = 0; c < n; c++) {
      if (gridRow[c] === 1) row[c] = 0;
      else if (c > 0) row[c] += row[c - 1];
    }
  }

  return row[n - 1];
}

/** The paths themselves, as sequences of 'R' and 'D'. */
function listPaths(m, n) {
  const out = [];

  function walk(r, c, path) {
    if (r === m - 1 && c === n - 1) {
      out.push(path);
      return;
    }
    if (c < n - 1) walk(r, c + 1, `${path}R`);
    if (r < m - 1) walk(r + 1, c, `${path}D`);
  }

  walk(0, 0, '');
  return out;
}

/** Minimum path sum through a weighted grid (LeetCode 64). */
function minPathSum(grid) {
  const n = grid[0].length;
  const row = new Array(n).fill(Infinity);
  row[0] = 0;

  for (const gridRow of grid) {
    row[0] += gridRow[0];
    for (let c = 1; c < n; c++) {
      row[c] = Math.min(row[c], row[c - 1]) + gridRow[c];
    }
  }

  return row[n - 1];
}

// ---- Examples ----
console.log(uniquePaths(3, 7));               // 28
console.log(uniquePathsCombinatorial(3, 7));  // 28
console.log(uniquePaths(3, 2));               // 3
console.log(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])); // 2
console.log(listPaths(2, 3));                 // ['RR D' variants]
console.log(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]])); // 7

module.exports = { uniquePaths, uniquePathsCombinatorial, uniquePathsWithObstacles, listPaths, minPathSum };
