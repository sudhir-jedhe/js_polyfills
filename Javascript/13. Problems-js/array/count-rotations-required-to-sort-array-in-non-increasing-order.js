/**
 * Count the rotations required to sort an array in non-increasing order.
 *
 * A rotated non-increasing array has exactly one position where an element
 * is SMALLER than its predecessor... plus the wrap. The number of right
 * rotations needed is the index just after that break point.
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {number[]} arr
 * @returns {number} rotations needed, or -1 if it is not a rotated
 *                   non-increasing array
 */
function countRotationsNonIncreasing(arr) {
  const n = arr.length;
  if (n <= 1) return 0;

  let breakIndex = -1;

  for (let i = 0; i < n - 1; i++) {
    if (arr[i] < arr[i + 1]) {
      if (breakIndex !== -1) return -1; // more than one break -> not rotated sorted
      breakIndex = i;
    }
  }

  if (breakIndex === -1) return 0; // already non-increasing

  // The wrap must also hold: last element must not exceed the first.
  if (arr[n - 1] > arr[0]) return -1;

  return breakIndex + 1;
}

/** The mirror problem: rotations to sort in non-DECREASING order. */
function countRotationsNonDecreasing(arr) {
  const n = arr.length;
  if (n <= 1) return 0;

  let breakIndex = -1;
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      if (breakIndex !== -1) return -1;
      breakIndex = i;
    }
  }

  if (breakIndex === -1) return 0;
  if (arr[n - 1] > arr[0]) return -1;

  return breakIndex + 1;
}

/**
 * Binary-search version for a rotated sorted array with distinct values:
 * find the index of the minimum, which equals the rotation count.
 * Time O(log n)
 */
function countRotationsBinarySearch(arr) {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] > arr[hi]) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

// ---- Examples ----
console.log(countRotationsNonIncreasing([3, 2, 1, 5, 4]));  // 3
console.log(countRotationsNonIncreasing([5, 4, 3, 2, 1]));  // 0
console.log(countRotationsNonIncreasing([1, 3, 2]));        // -1
console.log(countRotationsNonDecreasing([4, 5, 1, 2, 3]));  // 2
console.log(countRotationsBinarySearch([15, 18, 2, 3, 6, 12])); // 2

module.exports = { countRotationsNonIncreasing, countRotationsNonDecreasing, countRotationsBinarySearch };
