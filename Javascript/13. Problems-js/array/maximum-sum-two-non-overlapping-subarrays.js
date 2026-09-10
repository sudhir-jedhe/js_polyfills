/**
 * Maximum sum of two non-overlapping subarrays of given sizes
 * (LeetCode 1031).
 *
 * Sweep once keeping the best L-length window seen to the LEFT while the
 * M-length window slides on the right — then repeat with the roles swapped,
 * because either subarray may come first.
 *
 * Time  O(n)
 * Space O(n) for the prefix sums
 */

/** Prefix sums: prefix[i] = sum of arr[0..i). */
function prefixSums(arr) {
  const prefix = new Array(arr.length + 1).fill(0);
  for (let i = 0; i < arr.length; i++) prefix[i + 1] = prefix[i] + arr[i];
  return prefix;
}

/**
 * @param {number[]} arr
 * @param {number} firstLen
 * @param {number} secondLen
 * @returns {number}
 */
function maxSumTwoNoOverlap(arr, firstLen, secondLen) {
  const prefix = prefixSums(arr);

  /** Best total with an `a`-length window strictly before a `b`-length one. */
  const best = (a, b) => {
    let bestA = 0;
    let result = 0;

    for (let i = a + b; i <= arr.length; i++) {
      // The a-window ending at i - b.
      bestA = Math.max(bestA, prefix[i - b] - prefix[i - b - a]);
      // The b-window ending at i.
      result = Math.max(result, bestA + prefix[i] - prefix[i - b]);
    }

    return result;
  };

  return Math.max(best(firstLen, secondLen), best(secondLen, firstLen));
}

/** Which two windows achieve it. */
function maxSumTwoNoOverlapWindows(arr, firstLen, secondLen) {
  const prefix = prefixSums(arr);
  let best = { sum: -Infinity, first: null, second: null };

  const scan = (a, b) => {
    let bestA = -Infinity;
    let bestAStart = 0;

    for (let i = a + b; i <= arr.length; i++) {
      const aSum = prefix[i - b] - prefix[i - b - a];
      if (aSum > bestA) {
        bestA = aSum;
        bestAStart = i - b - a;
      }

      const total = bestA + prefix[i] - prefix[i - b];
      if (total > best.sum) {
        best = {
          sum: total,
          first: arr.slice(bestAStart, bestAStart + a),
          second: arr.slice(i - b, i),
        };
      }
    }
  };

  scan(firstLen, secondLen);
  scan(secondLen, firstLen);
  return best;
}

/** Maximum sum of a single window of length k — the building block. */
function maxWindowSum(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];

  let best = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    best = Math.max(best, sum);
  }

  return best;
}

/** Three non-overlapping windows of equal length (LeetCode 689). */
function maxSumOfThreeSubarrays(arr, k) {
  const prefix = prefixSums(arr);
  const windowSum = (start) => prefix[start + k] - prefix[start];

  const n = arr.length - k + 1;
  const bestLeft = new Array(n).fill(0);
  const bestRight = new Array(n).fill(0);

  for (let i = 1; i < n; i++) {
    bestLeft[i] = windowSum(i) > windowSum(bestLeft[i - 1]) ? i : bestLeft[i - 1];
  }

  bestRight[n - 1] = n - 1;
  for (let i = n - 2; i >= 0; i--) {
    bestRight[i] = windowSum(i) >= windowSum(bestRight[i + 1]) ? i : bestRight[i + 1];
  }

  let best = null;
  let bestTotal = -Infinity;

  for (let mid = k; mid + k < arr.length - k + 1 + k; mid++) {
    if (mid - k < 0 || mid + k >= n + k - 1 + 1) continue;
    const left = bestLeft[mid - k];
    const right = bestRight[Math.min(mid + k, n - 1)];
    const total = windowSum(left) + windowSum(mid) + windowSum(right);

    if (total > bestTotal) {
      bestTotal = total;
      best = [left, mid, right];
    }
  }

  return { indexes: best, sum: bestTotal };
}

// ---- Examples ----
console.log(maxSumTwoNoOverlap([0, 6, 5, 2, 2, 5, 1, 9, 4], 1, 2));  // 20
console.log(maxSumTwoNoOverlap([3, 8, 1, 3, 2, 1, 8, 9, 0], 3, 2));  // 29
console.log(maxSumTwoNoOverlapWindows([0, 6, 5, 2, 2, 5, 1, 9, 4], 1, 2));
console.log(maxWindowSum([1, 4, 2, 10, 2, 3, 1, 0, 20], 4)); // 24
console.log(maxSumOfThreeSubarrays([1, 2, 1, 2, 6, 7, 5, 1], 2));

module.exports = { maxSumTwoNoOverlap, maxSumTwoNoOverlapWindows, maxWindowSum, maxSumOfThreeSubarrays, prefixSums };
