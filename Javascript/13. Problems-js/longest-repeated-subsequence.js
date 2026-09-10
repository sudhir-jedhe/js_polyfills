/**
 * Longest Repeated Subsequence (LRS).
 *
 * The longest subsequence that appears at least twice in the string, where
 * the two occurrences must not use the same character position.
 *
 * This is LCS(str, str) with the extra constraint i !== j.
 *
 * Time  O(n^2)
 * Space O(n^2)
 */

/**
 * @param {string} str
 * @returns {{ length: number, subsequence: string }}
 */
function longestRepeatedSubsequence(str) {
  const n = str.length;
  // dp[i][j] = LRS length of str[0..i) and str[0..j) with index i-1 !== j-1
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (str[i - 1] === str[j - 1] && i !== j) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Walk the table backwards to rebuild one optimal subsequence.
  let i = n;
  let j = n;
  let out = '';

  while (i > 0 && j > 0) {
    if (str[i - 1] === str[j - 1] && i !== j) {
      out = str[i - 1] + out;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { length: dp[n][n], subsequence: out };
}

// ---- Examples ----
console.log(longestRepeatedSubsequence('aabb'));     // { length: 2, subsequence: 'ab' }
console.log(longestRepeatedSubsequence('aab'));      // { length: 1, subsequence: 'a' }
console.log(longestRepeatedSubsequence('AABEBCDD')); // { length: 3, subsequence: 'ABD' }
console.log(longestRepeatedSubsequence('abc'));      // { length: 0, subsequence: '' }

module.exports = { longestRepeatedSubsequence };
