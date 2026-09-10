/**
 * Reverse the words in a statement and remove extra whitespace.
 *
 * 'the  sky   is blue' -> 'blue is sky the'
 * LeetCode 151.
 */

/** split/reverse/join, with filter(Boolean) removing the empty slots. */
const reverseWords = (str) =>
  String(str).trim().split(/\s+/).filter(Boolean).reverse().join(' ');

/**
 * Manual scan from the right — O(n) time, no regex, and it shows how you
 * would do it in a language without split().
 */
function reverseWordsManual(str) {
  const s = String(str);
  const out = [];
  let end = s.length;

  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === ' ') {
      if (i + 1 < end) out.push(s.slice(i + 1, end));
      end = i;
    }
  }

  if (end > 0) out.push(s.slice(0, end));
  return out.join(' ');
}

/** Reverse each word in place, keeping the word order. */
const reverseEachWord = (str) =>
  String(str)
    .split(' ')
    .map((w) => [...w].reverse().join(''))
    .join(' ');

/** Reverse the whole string, characters and all. */
const reverseString = (str) => [...String(str)].reverse().join('');

// ---- Examples ----
console.log(reverseWords('  the   sky is  blue  ')); // 'blue is sky the'
console.log(reverseWordsManual('a good   example')); // 'example good a'
console.log(reverseEachWord('hello world'));         // 'olleh dlrow'
console.log(reverseString('hello world'));           // 'dlrow olleh'

module.exports = { reverseWords, reverseWordsManual, reverseEachWord, reverseString };
