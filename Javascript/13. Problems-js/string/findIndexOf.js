/**
 * Implement indexOf.
 *
 * Naive substring search plus KMP, which is the right answer when the
 * haystack is large.
 */

/**
 * Naive scan.
 * Time  O(n * m) worst case
 * @param {string} haystack
 * @param {string} needle
 * @param {number} [from=0]
 * @returns {number} index, or -1
 */
function findIndexOf(haystack, needle, from = 0) {
  if (needle === '') return Math.min(Math.max(from, 0), haystack.length);

  outer: for (let i = Math.max(from, 0); i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }

  return -1;
}

/**
 * Knuth-Morris-Pratt.
 * Time  O(n + m), no backtracking in the haystack.
 */
function kmpIndexOf(haystack, needle) {
  if (needle === '') return 0;
  if (needle.length > haystack.length) return -1;

  // lps[i] = length of the longest proper prefix of needle[0..i] that is
  // also a suffix of it.
  const lps = new Array(needle.length).fill(0);
  for (let i = 1, len = 0; i < needle.length; ) {
    if (needle[i] === needle[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }

  for (let i = 0, j = 0; i < haystack.length; ) {
    if (haystack[i] === needle[j]) {
      i++;
      j++;
      if (j === needle.length) return i - j;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }

  return -1;
}

/** Every index where the needle occurs (overlapping allowed). */
function allIndexesOf(haystack, needle) {
  const out = [];
  let i = 0;

  while ((i = haystack.indexOf(needle, i)) !== -1) {
    out.push(i);
    i++;
  }

  return out;
}

/** Array.prototype.indexOf equivalent, for completeness. */
function arrayIndexOf(arr, value, from = 0) {
  for (let i = Math.max(from, 0); i < arr.length; i++) {
    if (arr[i] === value) return i;
  }
  return -1;
}

// ---- Examples ----
console.log(findIndexOf('hello world', 'world'));  // 6
console.log(findIndexOf('aaaa', 'aa', 1));         // 1
console.log(findIndexOf('abc', 'xyz'));            // -1
console.log(kmpIndexOf('ababcabcabababd', 'ababd'));// 10
console.log(allIndexesOf('abababa', 'aba'));        // [0, 2, 4]
console.log(arrayIndexOf([1, 2, 3], 3));            // 2

module.exports = { findIndexOf, kmpIndexOf, allIndexesOf, arrayIndexOf };
