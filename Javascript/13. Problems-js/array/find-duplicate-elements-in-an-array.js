/**
 * Find duplicate elements in an array.
 *
 * A Set of "already seen" values gives O(n); the classic nested loop is
 * O(n^2) and only worth it when extra space is forbidden.
 */

/** Every value that appears more than once, each listed once. */
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }

  return [...duplicates];
}

/** Duplicates with their counts. */
function duplicateCounts(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) || 0) + 1);
  return Object.fromEntries([...counts].filter(([, n]) => n > 1));
}

/** filter/indexOf one-liner — readable, but O(n^2). */
const findDuplicatesFilter = (arr) =>
  [...new Set(arr.filter((item, i) => arr.indexOf(item) !== i))];

/** The FIRST value that repeats, in order of the repeat. */
function firstDuplicate(arr) {
  const seen = new Set();
  for (const item of arr) {
    if (seen.has(item)) return item;
    seen.add(item);
  }
  return null;
}

/**
 * Values 1..n in an array of length n+1 — Floyd's cycle detection finds
 * the single duplicate in O(n) time and O(1) space (LeetCode 287).
 */
function findDuplicateCycle(nums) {
  let slow = nums[0];
  let fast = nums[0];

  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
}

/** Duplicates in an array of objects, by a key. */
function findDuplicatesBy(arr, keyFn) {
  const seen = new Set();
  const dupes = [];

  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) dupes.push(item);
    else seen.add(key);
  }

  return dupes;
}

// ---- Examples ----
console.log(findDuplicates([1, 2, 3, 2, 4, 1, 1]));   // [1, 2]
console.log(duplicateCounts([1, 2, 3, 2, 4, 1, 1]));  // { '1': 3, '2': 2 }
console.log(findDuplicatesFilter(['a', 'b', 'a']));   // ['a']
console.log(firstDuplicate([3, 1, 3, 4, 1]));         // 3
console.log(findDuplicateCycle([1, 3, 4, 2, 2]));     // 2
console.log(findDuplicatesBy([{ id: 1 }, { id: 2 }, { id: 1 }], (o) => o.id)); // [{id:1}]

module.exports = { findDuplicates, duplicateCounts, findDuplicatesFilter, firstDuplicate, findDuplicateCycle, findDuplicatesBy };
