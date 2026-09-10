/**
 * Merge two sorted arrays into a single sorted array.
 *
 * The two-pointer merge is O(m + n) — concatenating and sorting is
 * O((m+n) log(m+n)) and throws away the fact that the inputs are ordered.
 */

/**
 * @param {number[]} a sorted ascending
 * @param {number[]} b sorted ascending
 * @returns {number[]}
 */
function merge(a, b) {
  const out = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }

  // One of these is already exhausted.
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);

  return out;
}

/** Merge and drop duplicates in the same pass. */
function mergeUnique(a, b) {
  const merged = merge(a, b);
  const out = [];

  for (const value of merged) {
    if (out[out.length - 1] !== value) out.push(value);
  }

  return out;
}

/**
 * LeetCode 88: merge b into a IN PLACE, where a has m real values followed
 * by n empty slots. Filling from the BACK avoids overwriting unread values.
 */
function mergeInPlace(a, m, b, n) {
  let i = m - 1;
  let j = n - 1;
  let write = m + n - 1;

  while (j >= 0) {
    a[write--] = i >= 0 && a[i] > b[j] ? a[i--] : b[j--];
  }

  return a;
}

/** Merge k sorted arrays by repeated pairwise merging — O(N log k). */
function mergeK(arrays) {
  if (arrays.length === 0) return [];

  let current = arrays;
  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      next.push(i + 1 < current.length ? merge(current[i], current[i + 1]) : current[i]);
    }
    current = next;
  }

  return current[0];
}

/** With a comparator, for objects. */
function mergeBy(a, b, compare) {
  const out = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    out.push(compare(a[i], b[j]) <= 0 ? a[i++] : b[j++]);
  }

  return [...out, ...a.slice(i), ...b.slice(j)];
}

/** Merge sort, built on the same merge step. */
function mergeSort(arr) {
  if (arr.length <= 1) return [...arr];

  const mid = arr.length >> 1;
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

// ---- Examples ----
console.log(merge([1, 3, 5], [2, 4, 6]));       // [1,2,3,4,5,6]
console.log(merge([1, 2], []));                 // [1, 2]
console.log(mergeUnique([1, 2, 3], [2, 3, 4])); // [1,2,3,4]
console.log(mergeInPlace([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3)); // [1,2,2,3,5,6]
console.log(mergeK([[1, 4], [2, 5], [3, 6]]));  // [1,2,3,4,5,6]
console.log(mergeBy([{ n: 1 }], [{ n: 0 }], (x, y) => x.n - y.n)); // [{n:0},{n:1}]
console.log(mergeSort([5, 2, 9, 1, 7]));        // [1,2,5,7,9]

module.exports = { merge, mergeUnique, mergeInPlace, mergeK, mergeBy, mergeSort };
