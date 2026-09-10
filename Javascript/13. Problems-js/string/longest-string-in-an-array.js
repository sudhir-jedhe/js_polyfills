/**
 * Find the longest string in an array.
 *
 * reduce keeps it to a single pass; the sort version is shorter but O(n log n)
 * and mutates unless you copy first.
 */

/** Single pass, ties resolved in favour of the first occurrence. */
function longestString(arr) {
  if (!arr.length) return null;
  return arr.reduce((best, current) => (current.length > best.length ? current : best));
}

/** Sort-based — clear, but slower and needs a copy to avoid mutating. */
const longestStringSort = (arr) => [...arr].sort((a, b) => b.length - a.length)[0] ?? null;

/** The shortest one. */
const shortestString = (arr) =>
  arr.length ? arr.reduce((best, cur) => (cur.length < best.length ? cur : best)) : null;

/** Every string tied for longest. */
function allLongest(arr) {
  const max = Math.max(0, ...arr.map((s) => s.length));
  return arr.filter((s) => s.length === max);
}

/** Longest by a custom measure, e.g. word count or grapheme count. */
const longestBy = (arr, measure) =>
  arr.length ? arr.reduce((best, cur) => (measure(cur) > measure(best) ? cur : best)) : null;

// ---- Examples ----
const words = ['apple', 'banana', 'fig', 'cherry'];

console.log(longestString(words));      // 'banana'
console.log(longestStringSort(words));  // 'banana'
console.log(shortestString(words));     // 'fig'
console.log(allLongest(['aa', 'bb', 'c']));// ['aa', 'bb']
console.log(longestBy(['a b c', 'dd'], (s) => s.split(' ').length)); // 'a b c'
console.log(longestString([]));         // null

module.exports = { longestString, longestStringSort, shortestString, allLongest, longestBy };
