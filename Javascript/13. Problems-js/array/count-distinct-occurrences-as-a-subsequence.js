/**
 * Count distinct occurrences of a pattern as a subsequence (LeetCode 115).
 *
 * How many distinct subsequences of `text` equal `pattern`?
 *
 * dp[j] = number of ways to form pattern[0..j) using the prefix of text seen
 * so far. Iterating j downwards keeps each text character used at most once
 * per state, which is what makes the 1-D rolling array correct.
 *
 * Time  O(n * m)
 * Space O(m)
 */

/**
 * @param {string} text
 * @param {string} pattern
 * @returns {number}
 */
function countSubsequenceOccurrences(text, pattern) {
  const m = pattern.length;
  const dp = new Array(m + 1).fill(0);
  dp[0] = 1; // the empty pattern is formed exactly one way

  for (const ch of text) {
    // Backwards, so dp[j - 1] is still the value from the previous row.
    for (let j = m; j >= 1; j--) {
      if (pattern[j - 1] === ch) dp[j] += dp[j - 1];
    }
  }

  return dp[m];
}

/** The full 2-D table, easier to reason about and to trace. */
function countSubsequenceOccurrences2D(text, pattern) {
  const n = text.length;
  const m = pattern.length;

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      // Skip text[i-1], or use it when the characters match.
      dp[i][j] = dp[i - 1][j] + (text[i - 1] === pattern[j - 1] ? dp[i - 1][j - 1] : 0);
    }
  }

  return dp[n][m];
}

/** Is `pattern` a subsequence of `text` at all? Greedy two-pointer, O(n). */
function isSubsequence(pattern, text) {
  let j = 0;
  for (const ch of text) {
    if (ch === pattern[j]) j++;
    if (j === pattern.length) return true;
  }
  return pattern.length === 0;
}

// ---- Examples ----
console.log(countSubsequenceOccurrences('rabbbit', 'rabbit')); // 3
console.log(countSubsequenceOccurrences('babgbag', 'bag'));    // 5
console.log(countSubsequenceOccurrences('abc', 'abcd'));       // 0
console.log(countSubsequenceOccurrences2D('babgbag', 'bag'));  // 5
console.log(isSubsequence('ace', 'abcde'));                    // true
console.log(isSubsequence('aec', 'abcde'));                    // false

module.exports = { countSubsequenceOccurrences, countSubsequenceOccurrences2D, isSubsequence };
