/**
 * Most common element(s) in an array.
 *
 * Count once, then read the counts. The variants cover ties, the top n,
 * and counting by a derived key.
 */

/** Frequency map, insertion-ordered. */
function frequencies(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

/** The single most common element, ties resolved to first appearance. */
function mostCommon(arr) {
  let best;
  let bestCount = 0;

  for (const [value, count] of frequencies(arr)) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }

  return best;
}

/** With its count. */
function mostCommonWithCount(arr) {
  const value = mostCommon(arr);
  return value === undefined ? null : { value, count: frequencies(arr).get(value) };
}

/** Every element tied for most common. */
function allMostCommon(arr) {
  const counts = frequencies(arr);
  const max = Math.max(0, ...counts.values());
  return [...counts.entries()].filter(([, n]) => n === max).map(([v]) => v);
}

/** The n most common, descending by count. */
const topN = (arr, n) =>
  [...frequencies(arr).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([value, count]) => ({ value, count }));

/** Most common by a derived key: mostCommonBy(users, u => u.city). */
function mostCommonBy(arr, keyFn) {
  const counts = new Map();

  for (const item of arr) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  let best;
  let bestCount = 0;

  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }

  return { key: best, count: bestCount };
}

/**
 * Majority element — appears more than n/2 times (LeetCode 169).
 * Boyer-Moore voting: O(n) time, O(1) space.
 */
function majorityElement(arr) {
  let candidate = null;
  let count = 0;

  for (const value of arr) {
    if (count === 0) candidate = value;
    count += Object.is(value, candidate) ? 1 : -1;
  }

  // Verify — a majority is only guaranteed if one actually exists.
  const occurrences = arr.filter((v) => Object.is(v, candidate)).length;
  return occurrences > arr.length / 2 ? candidate : null;
}

// ---- Examples ----
const arr = ['a', 'b', 'a', 'c', 'b', 'a'];

console.log(mostCommon(arr));            // 'a'
console.log(mostCommonWithCount(arr));   // { value: 'a', count: 3 }
console.log(allMostCommon([1, 1, 2, 2]));// [1, 2]
console.log(topN(arr, 2));               // [{a,3}, {b,2}]
console.log(mostCommonBy([{ c: 'x' }, { c: 'y' }, { c: 'x' }], (o) => o.c)); // { key: 'x', count: 2 }
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
console.log(majorityElement([1, 2, 3]));             // null

module.exports = { mostCommon, mostCommonWithCount, allMostCommon, topN, mostCommonBy, majorityElement, frequencies };
