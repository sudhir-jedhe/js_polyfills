/**
 * Longest palindrome problems.
 *
 * 1. Longest palindromic SUBSTRING (LeetCode 5) — expand around centres.
 * 2. Longest palindrome BUILDABLE from a string's letters (LeetCode 409).
 * 3. Longest palindromic SUBSEQUENCE (LeetCode 516) — DP.
 */

/**
 * Longest palindromic substring by expanding around each of the 2n-1
 * possible centres.
 * Time  O(n^2), Space O(1)
 */
function longestPalindromicSubstring(str) {
  if (str.length < 2) return str;

  let start = 0;
  let maxLength = 1;

  const expand = (left, right) => {
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      left--;
      right++;
    }
    // left/right have overshot by one on each side.
    const length = right - left - 1;
    if (length > maxLength) {
      maxLength = length;
      start = left + 1;
    }
  };

  for (let i = 0; i < str.length; i++) {
    expand(i, i);     // odd-length centre
    expand(i, i + 1); // even-length centre
  }

  return str.slice(start, start + maxLength);
}

/**
 * Length of the longest palindrome that can be BUILT from the characters.
 * Every pair contributes 2; one leftover character can sit in the middle.
 */
function longestBuildablePalindrome(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);

  let length = 0;
  let hasOdd = false;

  for (const count of counts.values()) {
    length += Math.floor(count / 2) * 2;
    if (count % 2 === 1) hasOdd = true;
  }

  return length + (hasOdd ? 1 : 0);
}

/**
 * Longest palindromic SUBSEQUENCE — LCS of the string and its reverse,
 * done directly with a 2-D DP.
 * Time O(n^2), Space O(n^2)
 */
function longestPalindromicSubsequence(str) {
  const n = str.length;
  if (n === 0) return 0;

  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i + length - 1 < n; i++) {
      const j = i + length - 1;
      dp[i][j] = str[i] === str[j]
        ? dp[i + 1][j - 1] + 2
        : Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }

  return dp[0][n - 1];
}

/** Is the string a palindrome? Optionally ignoring case and punctuation. */
function isPalindrome(str, { loose = false } = {}) {
  const s = loose ? String(str).toLowerCase().replace(/[^a-z0-9]/g, '') : String(str);

  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }

  return true;
}

/** Count all palindromic substrings (LeetCode 647). */
function countPalindromicSubstrings(str) {
  let count = 0;

  const expand = (left, right) => {
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      count++;
      left--;
      right++;
    }
  };

  for (let i = 0; i < str.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }

  return count;
}

// ---- Examples ----
console.log(longestPalindromicSubstring('babad'));    // 'bab' or 'aba'
console.log(longestPalindromicSubstring('cbbd'));     // 'bb'
console.log(longestBuildablePalindrome('abccccdd'));  // 7
console.log(longestPalindromicSubsequence('bbbab'));  // 4
console.log(isPalindrome('A man, a plan, a canal: Panama', { loose: true })); // true
console.log(countPalindromicSubstrings('aaa'));       // 6

module.exports = { longestPalindromicSubstring, longestBuildablePalindrome, longestPalindromicSubsequence, isPalindrome, countPalindromicSubstrings };
