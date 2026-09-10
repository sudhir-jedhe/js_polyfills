/**
 * Last duplicate element in a sorted array.
 *
 * In a sorted array, duplicates are adjacent, so a single backward scan
 * finds the LAST value that repeats, along with its index.
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {number[]} sorted
 * @returns {{ value: number, index: number } | null} index of the second
 *          occurrence of the last duplicated value
 */
function lastDuplicate(sorted) {
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i] === sorted[i - 1]) {
      return { value: sorted[i], index: i };
    }
  }
  return null;
}

/** The FIRST duplicated value instead. */
function firstDuplicate(sorted) {
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) return { value: sorted[i], index: i };
  }
  return null;
}

/** Every duplicated value in a sorted array, in order. */
function allDuplicates(sorted) {
  const out = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] && sorted[i] !== out[out.length - 1]) {
      out.push(sorted[i]);
    }
  }
  return out;
}

/**
 * Remove duplicates from a sorted array in place, returning the new length
 * (LeetCode 26). The classic two-pointer companion problem.
 */
function removeDuplicatesInPlace(sorted) {
  if (sorted.length === 0) return 0;

  let write = 1;
  for (let read = 1; read < sorted.length; read++) {
    if (sorted[read] !== sorted[write - 1]) sorted[write++] = sorted[read];
  }

  return write;
}

/** Count of each duplicated value. */
function duplicateRuns(sorted) {
  const runs = [];
  let start = 0;

  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i] !== sorted[start]) {
      if (i - start > 1) runs.push({ value: sorted[start], count: i - start });
      start = i;
    }
  }

  return runs;
}

// ---- Examples ----
console.log(lastDuplicate([1, 2, 2, 3, 5, 5, 7]));  // { value: 5, index: 5 }
console.log(lastDuplicate([1, 2, 3]));              // null
console.log(firstDuplicate([1, 2, 2, 3, 5, 5]));    // { value: 2, index: 2 }
console.log(allDuplicates([1, 1, 2, 3, 3, 3, 4]));  // [1, 3]

const arr = [1, 1, 2, 2, 3];
console.log(removeDuplicatesInPlace(arr), arr.slice(0, 3)); // 3 [1,2,3]
console.log(duplicateRuns([1, 1, 2, 3, 3, 3]));     // [{1,2}, {3,3}]

module.exports = { lastDuplicate, firstDuplicate, allDuplicates, removeDuplicatesInPlace, duplicateRuns };
