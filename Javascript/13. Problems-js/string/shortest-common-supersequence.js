/**
 * Shortest Common Supersequence (SCS).
 *
 * The shortest string that contains both inputs as subsequences.
 * len(SCS) = len(a) + len(b) - len(LCS(a, b)), and the string itself is
 * rebuilt by walking the LCS table backwards.
 *
 * Time  O(m * n)
 * Space O(m * n)
 */

/** Build the LCS length table. */
function lcsTable(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  return dp;
}

/** Length of the longest common subsequence. */
const lcsLength = (a, b) => lcsTable(a, b)[a.length][b.length];

/** The longest common subsequence itself. */
function longestCommonSubsequence(a, b) {
  const dp = lcsTable(a, b);
  let i = a.length;
  let j = b.length;
  let out = '';

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      out = a[i - 1] + out;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }

  return out;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {string} the shortest common supersequence
 */
function shortestCommonSupersequence(a, b) {
  const dp = lcsTable(a, b);

  let i = a.length;
  let j = b.length;
  let out = '';

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      out = a[i - 1] + out; // shared character, taken once
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      out = a[--i] + out;
    } else {
      out = b[--j] + out;
    }
  }

  // Whatever is left of either string prefixes the result.
  return a.slice(0, i) + b.slice(0, j) + out;
}

/** Length only — no reconstruction needed. */
const scsLength = (a, b) => a.length + b.length - lcsLength(a, b);

// ---- Examples ----
console.log(shortestCommonSupersequence('abac', 'cab')); // 'cabac'
console.log(shortestCommonSupersequence('AGGTAB', 'GXTXAYB')); // 'AGXGTXAYB'
console.log(scsLength('abac', 'cab'));       // 5
console.log(longestCommonSubsequence('AGGTAB', 'GXTXAYB')); // 'GTAB'
console.log(lcsLength('abcde', 'ace'));      // 3

module.exports = { shortestCommonSupersequence, scsLength, longestCommonSubsequence, lcsLength };
