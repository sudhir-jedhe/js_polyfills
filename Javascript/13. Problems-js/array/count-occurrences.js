/**
 * Count occurrences of a value in an array.
 *
 * One value, all values, by predicate, and by a derived key.
 */

/** How many times a single value appears. */
const countOccurrences = (arr, value) =>
  arr.reduce((count, item) => (Object.is(item, value) ? count + 1 : count), 0);

/** filter().length — simpler, allocates an intermediate array. */
const countOccurrencesFilter = (arr, value) => arr.filter((item) => item === value).length;

/** A frequency map of every value. */
function frequencyMap(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

/** The same, as a plain object. */
const frequencies = (arr) => Object.fromEntries(frequencyMap(arr));

/** Count by a predicate. */
const countWhere = (arr, predicate) => arr.reduce((n, item, i) => n + (predicate(item, i) ? 1 : 0), 0);

/** Count occurrences in a SORTED array with binary search — O(log n). */
function countInSorted(sorted, value) {
  const bound = (findUpper) => {
    let lo = 0;
    let hi = sorted.length;

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (findUpper ? sorted[mid] <= value : sorted[mid] < value) lo = mid + 1;
      else hi = mid;
    }

    return lo;
  };

  return bound(true) - bound(false);
}

/** The most frequent value. */
function mostFrequent(arr) {
  let best = null;
  let bestCount = 0;

  for (const [value, count] of frequencyMap(arr)) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }

  return { value: best, count: bestCount };
}

// ---- Examples ----
console.log(countOccurrences([1, 2, 2, 3, 2], 2));   // 3
console.log(countOccurrences([NaN, NaN], NaN));      // 2  (Object.is finds NaN)
console.log(countOccurrencesFilter(['a', 'b', 'a'], 'a')); // 2
console.log(frequencies([1, 1, 2]));                 // { '1': 2, '2': 1 }
console.log(countWhere([1, 2, 3, 4], (n) => n % 2 === 0)); // 2
console.log(countInSorted([1, 2, 2, 2, 3], 2));      // 3
console.log(mostFrequent(['a', 'b', 'a', 'c', 'a'])); // { value: 'a', count: 3 }

module.exports = { countOccurrences, countOccurrencesFilter, frequencyMap, frequencies, countWhere, countInSorted, mostFrequent };
