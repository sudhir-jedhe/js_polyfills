/**
 * Find the element that occurs exactly k times in an array.
 *
 * Count once, then scan the counts. Returning the FIRST such element in
 * original order needs the input order, which a Map preserves.
 *
 * Time  O(n)
 * Space O(distinct values)
 */

/** Frequency map, insertion-ordered. */
function frequencies(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

/** The first element with exactly k occurrences. */
function elementWithFrequency(arr, k) {
  for (const [value, count] of frequencies(arr)) {
    if (count === k) return value;
  }
  return undefined;
}

/** All elements with exactly k occurrences. */
const elementsWithFrequency = (arr, k) =>
  [...frequencies(arr).entries()].filter(([, count]) => count === k).map(([value]) => value);

/** Elements appearing MORE than k times. */
const elementsAboveFrequency = (arr, k) =>
  [...frequencies(arr).entries()].filter(([, count]) => count > k).map(([value]) => value);

/**
 * Elements appearing more than n/k times (LeetCode 229 for k = 3).
 * Boyer-Moore generalised: at most k-1 such elements can exist.
 */
function majorityElements(arr, k = 2) {
  const counts = frequencies(arr);
  const threshold = arr.length / k;
  return [...counts.entries()].filter(([, n]) => n > threshold).map(([v]) => v);
}

/** Frequency of one specific value. */
const frequencyOf = (arr, value) => arr.reduce((n, item) => n + (Object.is(item, value) ? 1 : 0), 0);

/** Group values by how often they occur. */
function byFrequency(arr) {
  const groups = new Map();

  for (const [value, count] of frequencies(arr)) {
    if (!groups.has(count)) groups.set(count, []);
    groups.get(count).push(value);
  }

  return Object.fromEntries([...groups].sort((a, b) => a[0] - b[0]));
}

// ---- Examples ----
const arr = [1, 2, 2, 3, 3, 3, 4];

console.log(elementWithFrequency(arr, 2));   // 2
console.log(elementWithFrequency(arr, 3));   // 3
console.log(elementsWithFrequency(arr, 1));  // [1, 4]
console.log(elementsAboveFrequency(arr, 1)); // [2, 3]
console.log(majorityElements([3, 2, 3], 2)); // [3]
console.log(frequencyOf(arr, 3));            // 3
console.log(byFrequency(arr));               // { '1': [1,4], '2': [2], '3': [3] }

module.exports = { elementWithFrequency, elementsWithFrequency, elementsAboveFrequency, majorityElements, frequencyOf, byFrequency, frequencies };
