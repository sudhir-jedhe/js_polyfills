/**
 * Find the lexicographically next string in dictionary order.
 *
 * Two different problems share this name:
 *   1. next string over an alphabet   ('abc' -> 'abd', 'azz' -> 'baa')
 *   2. next permutation of the same characters ('abc' -> 'acb')
 */

/**
 * Next string in pure dictionary order: increment the last character,
 * carrying like odometer digits, and grow the string when it overflows.
 * @param {string} str lowercase a-z
 * @returns {string}
 */
function nextString(str) {
  const chars = [...str];
  let i = chars.length - 1;

  while (i >= 0 && chars[i] === 'z') {
    chars[i] = 'a';
    i--;
  }

  if (i < 0) return `a${chars.join('')}`; // 'zz' -> 'aaa'

  chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
  return chars.join('');
}

/**
 * Next lexicographic PERMUTATION of the same characters (LeetCode 31).
 * Returns null when the string is already the largest arrangement.
 *
 * Time  O(n)
 */
function nextPermutation(str) {
  const chars = [...str];

  // 1. find the rightmost position where chars[i] < chars[i + 1]
  let i = chars.length - 2;
  while (i >= 0 && chars[i] >= chars[i + 1]) i--;
  if (i < 0) return null; // already descending -> largest permutation

  // 2. find the rightmost character greater than chars[i]
  let j = chars.length - 1;
  while (chars[j] <= chars[i]) j--;

  // 3. swap, then reverse the suffix so it is the smallest arrangement
  [chars[i], chars[j]] = [chars[j], chars[i]];

  const tail = chars.splice(i + 1).reverse();
  return [...chars, ...tail].join('');
}

/** Previous permutation — the mirror of the above. */
function previousPermutation(str) {
  const chars = [...str];

  let i = chars.length - 2;
  while (i >= 0 && chars[i] <= chars[i + 1]) i--;
  if (i < 0) return null;

  let j = chars.length - 1;
  while (chars[j] >= chars[i]) j--;

  [chars[i], chars[j]] = [chars[j], chars[i]];
  const tail = chars.splice(i + 1).reverse();
  return [...chars, ...tail].join('');
}

// ---- Examples ----
console.log(nextString('abc'));         // 'abd'
console.log(nextString('azz'));         // 'baa'
console.log(nextString('zz'));          // 'aaa'
console.log(nextPermutation('abc'));    // 'acb'
console.log(nextPermutation('cba'));    // null
console.log(nextPermutation('158476531'));// '158513467'
console.log(previousPermutation('acb'));  // 'abc'

module.exports = { nextString, nextPermutation, previousPermutation };
