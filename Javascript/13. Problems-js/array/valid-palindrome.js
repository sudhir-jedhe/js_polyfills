/**
 * Valid Palindrome (LeetCode 125) and its variants.
 *
 * Two pointers from both ends, skipping non-alphanumeric characters. O(1)
 * extra space, unlike the reverse-and-compare one-liner.
 */

/** Is a character a letter or digit? */
const isAlphanumeric = (ch) => /[a-z0-9]/i.test(ch);

/**
 * Two-pointer check, ignoring case and punctuation.
 * Time  O(n), Space O(1)
 */
function isPalindrome(str) {
  const s = String(str);
  let lo = 0;
  let hi = s.length - 1;

  while (lo < hi) {
    while (lo < hi && !isAlphanumeric(s[lo])) lo++;
    while (lo < hi && !isAlphanumeric(s[hi])) hi--;

    if (s[lo].toLowerCase() !== s[hi].toLowerCase()) return false;

    lo++;
    hi--;
  }

  return true;
}

/** Normalise-and-reverse — shorter, O(n) space. */
function isPalindromeSimple(str) {
  const clean = String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === [...clean].reverse().join('');
}

/** Strict: no normalisation at all. */
function isPalindromeStrict(str) {
  const s = String(str);
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}

/**
 * Valid Palindrome II (LeetCode 680): allow deleting at most one character.
 */
function isPalindromeWithOneDeletion(str) {
  const s = String(str);

  const check = (lo, hi) => {
    while (lo < hi) {
      if (s[lo] !== s[hi]) return false;
      lo++;
      hi--;
    }
    return true;
  };

  let lo = 0;
  let hi = s.length - 1;

  while (lo < hi) {
    if (s[lo] !== s[hi]) {
      // Skip either the left or the right character.
      return check(lo + 1, hi) || check(lo, hi - 1);
    }
    lo++;
    hi--;
  }

  return true;
}

/** Allow up to k deletions — the longest palindromic subsequence bound. */
function isPalindromeWithKDeletions(str, k) {
  const n = str.length;
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

  return n - dp[0][n - 1] <= k;
}

/** Is a NUMBER a palindrome, without converting to a string? */
function isPalindromeNumber(n) {
  if (n < 0 || (n % 10 === 0 && n !== 0)) return false;

  let reversed = 0;
  let value = n;

  while (value > reversed) {
    reversed = reversed * 10 + (value % 10);
    value = Math.floor(value / 10);
  }

  // Even length: value === reversed. Odd: drop the middle digit.
  return value === reversed || value === Math.floor(reversed / 10);
}

/** Is a linked list a palindrome? */
function isPalindromeList(values) {
  for (let i = 0, j = values.length - 1; i < j; i++, j--) {
    if (values[i] !== values[j]) return false;
  }
  return true;
}

// ---- Examples ----
console.log(isPalindrome('A man, a plan, a canal: Panama')); // true
console.log(isPalindrome('race a car'));                     // false
console.log(isPalindrome(' '));                              // true
console.log(isPalindromeSimple('No lemon, no melon'));       // true
console.log(isPalindromeStrict('abba'));                     // true
console.log(isPalindromeWithOneDeletion('abca'));            // true
console.log(isPalindromeWithKDeletions('abcdeca', 2));       // true
console.log(isPalindromeNumber(121), isPalindromeNumber(-121)); // true false
console.log(isPalindromeList([1, 2, 2, 1]));                 // true

module.exports = { isPalindrome, isPalindromeSimple, isPalindromeStrict, isPalindromeWithOneDeletion, isPalindromeWithKDeletions, isPalindromeNumber, isPalindromeList };
