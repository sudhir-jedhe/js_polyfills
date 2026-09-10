/**
 * Sum of subsets nearest to K, formed from two given arrays.
 *
 * Take a subset from each array; find the pair of subset sums whose total
 * is closest to K. Enumerate one side's subset sums, sort them, and binary
 * search for each sum from the other side — meet in the middle.
 *
 * Time  O(2^n + 2^m * log(2^m))
 */

/** All subset sums of an array. */
function subsetSums(arr) {
  let sums = [0];

  for (const value of arr) {
    sums = [...sums, ...sums.map((s) => s + value)];
  }

  return sums;
}

/** Subset sums together with the subsets. */
function subsetSumsWithSubsets(arr) {
  let out = [{ sum: 0, subset: [] }];

  for (const value of arr) {
    out = [...out, ...out.map(({ sum, subset }) => ({ sum: sum + value, subset: [...subset, value] }))];
  }

  return out;
}

/**
 * @param {number[]} a
 * @param {number[]} b
 * @param {number} k
 */
function nearestToK(a, b, k) {
  const sumsA = subsetSumsWithSubsets(a);
  const sumsB = subsetSumsWithSubsets(b);

  sumsB.sort((x, y) => x.sum - y.sum);
  const values = sumsB.map((s) => s.sum);

  let best = null;

  for (const itemA of sumsA) {
    const need = k - itemA.sum;

    // Binary search for the insertion point of `need`.
    let lo = 0;
    let hi = values.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (values[mid] < need) lo = mid + 1;
      else hi = mid;
    }

    for (const index of [lo - 1, lo]) {
      if (index < 0 || index >= sumsB.length) continue;

      const total = itemA.sum + sumsB[index].sum;
      if (!best || Math.abs(total - k) < Math.abs(best.total - k)) {
        best = { total, fromA: itemA.subset, fromB: sumsB[index].subset };
      }
    }
  }

  return best;
}

/** Single-array version: the subset sum closest to k. */
function closestSubsetSum(arr, k) {
  const sums = subsetSumsWithSubsets(arr);
  return sums.reduce((best, item) =>
    Math.abs(item.sum - k) < Math.abs(best.sum - k) ? item : best
  );
}

/** Brute-force check for small inputs. */
function nearestToKBrute(a, b, k) {
  let best = null;

  for (const sumA of subsetSums(a)) {
    for (const sumB of subsetSums(b)) {
      const total = sumA + sumB;
      if (!best || Math.abs(total - k) < Math.abs(best - k)) best = total;
    }
  }

  return best;
}

// ---- Examples ----
console.log(nearestToK([1, 3, 5], [2, 4], 9));
console.log(nearestToKBrute([1, 3, 5], [2, 4], 9)); // same total
console.log(closestSubsetSum([1, 3, 5, 7], 10));    // sum 10 exactly
console.log(subsetSums([1, 2]));                    // [0, 1, 2, 3]

module.exports = { nearestToK, nearestToKBrute, closestSubsetSum, subsetSums, subsetSumsWithSubsets };
