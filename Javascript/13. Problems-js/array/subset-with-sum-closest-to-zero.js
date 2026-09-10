/**
 * Find the subset whose sum is closest to zero.
 *
 * With negatives in play there is no simple DP range, so meet-in-the-middle
 * is the right tool: split the array in half, enumerate all subset sums of
 * each half, sort one side, and binary search for the best complement.
 *
 * Time  O(2^(n/2) * n)
 * Space O(2^(n/2))
 */

/** All subset sums of an array, as a flat list. */
function subsetSums(arr) {
  const out = [0];

  for (const value of arr) {
    const len = out.length;
    for (let i = 0; i < len; i++) out.push(out[i] + value);
  }

  return out;
}

/**
 * Meet in the middle: the sum closest to zero over all NON-EMPTY subsets.
 * @param {number[]} arr
 */
function closestToZero(arr) {
  if (arr.length === 0) return { sum: 0, subset: [] };

  const mid = arr.length >> 1;
  const left = subsetSumsWithSubsets(arr.slice(0, mid));
  const right = subsetSumsWithSubsets(arr.slice(mid));

  right.sort((a, b) => a.sum - b.sum);
  const rightSums = right.map((r) => r.sum);

  let best = null;

  for (const l of left) {
    // Find where -l.sum would sit among the right-half sums.
    let lo = 0;
    let hi = rightSums.length;

    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (rightSums[m] < -l.sum) lo = m + 1;
      else hi = m;
    }

    for (const index of [lo - 1, lo]) {
      if (index < 0 || index >= right.length) continue;

      const total = l.sum + right[index].sum;
      const subset = [...l.subset, ...right[index].subset];
      if (subset.length === 0) continue; // skip the empty subset

      if (!best || Math.abs(total) < Math.abs(best.sum)) {
        best = { sum: total, subset };
      }
    }
  }

  return best;
}

/** Subset sums together with the subsets that produce them. */
function subsetSumsWithSubsets(arr) {
  let out = [{ sum: 0, subset: [] }];

  for (const value of arr) {
    out = [...out, ...out.map(({ sum, subset }) => ({ sum: sum + value, subset: [...subset, value] }))];
  }

  return out;
}

/** Brute force over all 2^n subsets — for verification on small inputs. */
function closestToZeroBrute(arr) {
  let best = null;

  for (let mask = 1; mask < 1 << arr.length; mask++) {
    let sum = 0;
    const subset = [];

    for (let i = 0; i < arr.length; i++) {
      if (mask & (1 << i)) {
        sum += arr[i];
        subset.push(arr[i]);
      }
    }

    if (!best || Math.abs(sum) < Math.abs(best.sum)) best = { sum, subset };
  }

  return best;
}

/** The PAIR whose sum is closest to zero — the simpler two-pointer cousin. */
function closestPairToZero(arr) {
  const sorted = [...arr].sort((a, b) => a - b);

  let lo = 0;
  let hi = sorted.length - 1;
  let best = null;

  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (!best || Math.abs(sum) < Math.abs(best.sum)) best = { sum, pair: [sorted[lo], sorted[hi]] };

    if (sum < 0) lo++;
    else hi--;
  }

  return best;
}

// ---- Examples ----
console.log(closestToZero([-7, -3, -2, 5, 8]));      // sum 0 via [-3,-2,5]
console.log(closestToZeroBrute([-7, -3, -2, 5, 8])); // same
console.log(closestToZero([1, 3, 5]));               // 1
console.log(closestPairToZero([1, 60, -10, 70, -80, 85])); // [-80, 85] -> 5
console.log(subsetSums([1, 2]));                     // [0, 1, 2, 3]

module.exports = { closestToZero, closestToZeroBrute, closestPairToZero, subsetSums, subsetSumsWithSubsets };
