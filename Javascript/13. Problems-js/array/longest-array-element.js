/**
 * Find the longest element in an array.
 *
 * "Longest" depends on the element type: string length, array length, or a
 * derived measure. reduce keeps it to one pass.
 */

/** Longest string (ties resolved to the first occurrence). */
const longestString = (arr) =>
  arr.length ? arr.reduce((best, cur) => (String(cur).length > String(best).length ? cur : best)) : null;

/** Longest by any measure. */
const longestBy = (arr, measure) =>
  arr.length ? arr.reduce((best, cur) => (measure(cur) > measure(best) ? cur : best)) : null;

/** Every element tied for longest. */
function allLongest(arr, measure = (v) => String(v).length) {
  if (!arr.length) return [];

  const max = Math.max(...arr.map(measure));
  return arr.filter((item) => measure(item) === max);
}

/** Longest nested array. */
const longestSubarray = (arrays) => longestBy(arrays, (a) => a.length);

/** Longest word in a sentence. */
const longestWord = (sentence) => longestString(String(sentence).match(/[\w'-]+/g) || []);

/** Shortest, the mirror. */
const shortestString = (arr) =>
  arr.length ? arr.reduce((best, cur) => (String(cur).length < String(best).length ? cur : best)) : null;

/** Sorted by length, descending. */
const byLengthDesc = (arr) => [...arr].sort((a, b) => String(b).length - String(a).length);

/** Longest measured in GRAPHEMES, so emoji count as one character. */
function longestByGraphemes(arr, locale = 'en') {
  const count = (s) => {
    if (typeof Intl === 'undefined' || !Intl.Segmenter) return [...String(s)].length;
    return [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(String(s))].length;
  };

  return longestBy(arr, count);
}

// ---- Examples ----
const words = ['apple', 'banana', 'fig', 'cherry'];

console.log(longestString(words));        // 'banana'
console.log(shortestString(words));       // 'fig'
console.log(allLongest(['aa', 'bb', 'c']));// ['aa', 'bb']
console.log(longestSubarray([[1], [1, 2, 3], [1, 2]])); // [1, 2, 3]
console.log(longestWord('the quick brown fox jumped')); // 'jumped'
console.log(byLengthDesc(words));         // ['banana','cherry','apple','fig']
console.log(longestBy([{ n: 'ab' }, { n: 'abcd' }], (o) => o.n.length)); // { n: 'abcd' }

module.exports = { longestString, longestBy, allLongest, longestSubarray, longestWord, shortestString, byLengthDesc, longestByGraphemes };
