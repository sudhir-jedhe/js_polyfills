/**
 * Find the second largest element in an array.
 *
 * One pass with two running maxima is O(n) and handles duplicates by
 * requiring the second value to be strictly smaller than the largest.
 */

/** Second DISTINCT largest, or null when there isn't one. */
function secondLargest(arr) {
  let first = -Infinity;
  let second = -Infinity;

  for (const n of arr) {
    if (n > first) {
      second = first;
      first = n;
    } else if (n > second && n < first) {
      second = n;
    }
  }

  return second === -Infinity ? null : second;
}

/** Set + sort — clearer, O(n log n). */
const secondLargestSort = (arr) => {
  const unique = [...new Set(arr)].sort((a, b) => b - a);
  return unique.length >= 2 ? unique[1] : null;
};

/** Second SMALLEST, the mirror. */
function secondSmallest(arr) {
  let first = Infinity;
  let second = Infinity;

  for (const n of arr) {
    if (n < first) {
      second = first;
      first = n;
    } else if (n < second && n > first) {
      second = n;
    }
  }

  return second === Infinity ? null : second;
}

/** The kth largest DISTINCT value. */
function kthLargestDistinct(arr, k) {
  const unique = [...new Set(arr)].sort((a, b) => b - a);
  return unique[k - 1] ?? null;
}

/**
 * The kth largest INCLUDING duplicates (LeetCode 215), via quickselect.
 * Average O(n), worst case O(n^2).
 */
function kthLargest(arr, k) {
  const nums = [...arr];
  let target = nums.length - k; // index in ascending order
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const pivot = nums[hi];
    let store = lo;

    for (let i = lo; i < hi; i++) {
      if (nums[i] < pivot) {
        [nums[i], nums[store]] = [nums[store], nums[i]];
        store++;
      }
    }

    [nums[store], nums[hi]] = [nums[hi], nums[store]];

    if (store === target) return nums[store];
    if (store < target) lo = store + 1;
    else hi = store - 1;
  }

  return undefined;
}

// ---- Examples ----
console.log(secondLargest([5, 1, 9, 3]));       // 5
console.log(secondLargest([9, 9, 9]));          // null
console.log(secondLargest([9, 9, 5]));          // 5
console.log(secondLargestSort([5, 1, 9, 3]));   // 5
console.log(secondSmallest([5, 1, 9, 3]));      // 3
console.log(kthLargestDistinct([5, 1, 9, 9, 3], 2)); // 5
console.log(kthLargest([3, 2, 1, 5, 6, 4], 2)); // 5

module.exports = { secondLargest, secondLargestSort, secondSmallest, kthLargestDistinct, kthLargest };
