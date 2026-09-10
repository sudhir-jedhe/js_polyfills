/**
 * Top K Frequent Elements (LeetCode 347).
 *
 * Counting sort by frequency gives O(n) — a frequency can never exceed n,
 * so bucket the values by their count and read the buckets from the top.
 * Sorting is O(n log n) and fine for small inputs.
 */

/** Frequency map. */
function frequencies(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

/**
 * Bucket sort by frequency.
 * Time  O(n), Space O(n)
 */
function topKFrequent(arr, k) {
  const counts = frequencies(arr);
  const buckets = Array.from({ length: arr.length + 1 }, () => []);

  for (const [value, count] of counts) buckets[count].push(value);

  const out = [];
  for (let count = buckets.length - 1; count >= 0 && out.length < k; count--) {
    for (const value of buckets[count]) {
      out.push(value);
      if (out.length === k) break;
    }
  }

  return out;
}

/** Sort-based — shorter, O(n log n). */
const topKFrequentSort = (arr, k) =>
  [...frequencies(arr).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([value]) => value);

/** With the counts attached, which is usually more useful. */
const topKWithCounts = (arr, k) =>
  [...frequencies(arr).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([value, count]) => ({ value, count }));

/** The k LEAST frequent. */
const bottomKFrequent = (arr, k) =>
  [...frequencies(arr).entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, k)
    .map(([value]) => value);

/** Top k frequent words, ties broken alphabetically (LeetCode 692). */
const topKFrequentWords = (words, k) =>
  [...frequencies(words).entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, k)
    .map(([word]) => word);

// ---- Examples ----
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));      // [1, 2]
console.log(topKFrequent([1], 1));                     // [1]
console.log(topKFrequentSort([4, 4, 5, 5, 5, 6], 2));  // [5, 4]
console.log(topKWithCounts(['a', 'b', 'a'], 2));       // [{a,2}, {b,1}]
console.log(bottomKFrequent([1, 1, 2, 3, 3, 3], 1));   // [2]
console.log(topKFrequentWords(['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2)); // ['i','love']

module.exports = { topKFrequent, topKFrequentSort, topKWithCounts, bottomKFrequent, topKFrequentWords, frequencies };
