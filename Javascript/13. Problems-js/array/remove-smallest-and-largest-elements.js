/**
 * Remove the smallest and largest elements from an array.
 *
 * One pass to find both extremes, then filter out only the FIRST occurrence
 * of each (the usual reading of the problem — removing every occurrence is
 * offered separately).
 *
 * Time  O(n)
 * Space O(n) for the result
 */

/** Remove one instance of the min and one of the max. */
function removeMinAndMax(arr) {
  if (arr.length <= 2) return [];

  let min = arr[0];
  let max = arr[0];
  let minIndex = 0;
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
      minIndex = i;
    }
    if (arr[i] > max) {
      max = arr[i];
      maxIndex = i;
    }
  }

  return arr.filter((_, i) => i !== minIndex && i !== maxIndex);
}

/** Remove EVERY occurrence of the min and the max. */
function removeAllMinAndMax(arr) {
  if (arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return arr.filter((n) => n !== min && n !== max);
}

/** Sort and slice — simpler to read, O(n log n), and it reorders the data. */
const removeMinAndMaxSorted = (arr) => (arr.length <= 2 ? [] : [...arr].sort((a, b) => a - b).slice(1, -1));

/** Trim the k smallest and k largest — a trimmed mean's first step. */
function trimExtremes(arr, k) {
  const sorted = [...arr].sort((a, b) => a - b);
  return k * 2 >= sorted.length ? [] : sorted.slice(k, sorted.length - k);
}

/** Mean after trimming the extremes — robust against outliers. */
function trimmedMean(arr, k = 1) {
  const kept = trimExtremes(arr, k);
  return kept.length ? kept.reduce((a, b) => a + b, 0) / kept.length : NaN;
}

// ---- Examples ----
console.log(removeMinAndMax([4, 1, 9, 3, 7]));      // [4, 3, 7]
console.log(removeMinAndMax([5, 5]));               // []
console.log(removeAllMinAndMax([1, 2, 3, 1, 3]));   // [2]
console.log(removeMinAndMaxSorted([4, 1, 9, 3, 7]));// [3, 4, 7]
console.log(trimExtremes([1, 2, 3, 4, 5, 6], 2));   // [3, 4]
console.log(trimmedMean([1, 2, 3, 4, 100]));        // 3

module.exports = { removeMinAndMax, removeAllMinAndMax, removeMinAndMaxSorted, trimExtremes, trimmedMean };
