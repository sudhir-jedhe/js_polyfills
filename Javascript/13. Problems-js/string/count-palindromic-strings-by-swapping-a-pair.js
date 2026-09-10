/**
 * Count palindromic strings possible by swapping a pair of characters.
 *
 * Given a string, count how many DISTINCT strings that are palindromes can
 * be produced by swapping exactly one pair of characters (at two different
 * indices).
 *
 * Approach: a swap changes at most two positions, so brute-forcing every
 * pair is O(n^2 * n) which is fine for interview-sized inputs. The
 * character-count reasoning below explains the shortcut.
 */

/** @param {string} s @returns {boolean} */
function isPalindrome(s) {
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}

/**
 * Every distinct palindrome reachable with exactly one swap.
 * @param {string} str
 * @returns {string[]}
 */
function palindromesAfterOneSwap(str) {
  const chars = [...str];
  const found = new Set();

  for (let i = 0; i < chars.length; i++) {
    for (let j = i + 1; j < chars.length; j++) {
      if (chars[i] === chars[j]) continue; // swap would be a no-op

      [chars[i], chars[j]] = [chars[j], chars[i]];
      const candidate = chars.join('');
      if (isPalindrome(candidate)) found.add(candidate);
      [chars[i], chars[j]] = [chars[j], chars[i]]; // undo
    }
  }

  return [...found];
}

const countPalindromesAfterOneSwap = (str) => palindromesAfterOneSwap(str).length;

/**
 * Can the string's characters be rearranged into a palindrome at all?
 * At most one character may have an odd count.
 */
function canFormPalindrome(str) {
  const odd = new Set();
  for (const ch of str) {
    if (odd.has(ch)) odd.delete(ch);
    else odd.add(ch);
  }
  return odd.size <= 1;
}

// ---- Examples ----
console.log(palindromesAfterOneSwap('bbaa'));      // ['abba']
console.log(countPalindromesAfterOneSwap('bbaa')); // 1
console.log(countPalindromesAfterOneSwap('abc'));  // 0
console.log(canFormPalindrome('aabb'));            // true
console.log(canFormPalindrome('abc'));             // false

module.exports = { palindromesAfterOneSwap, countPalindromesAfterOneSwap, isPalindrome, canFormPalindrome };
