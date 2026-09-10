/**
 * Find all distinct subset (subsequence) sums of an array.
 *
 * A Set of running sums grows by adding each new element to every sum seen
 * so far. For non-negative integers with a bounded total, a boolean array
 * is faster and uses less memory.
 *
 * Time  O(n * distinctSums)
 */

/** Every distinct subset sum, sorted ascending. Works with negatives. */
function distinctSubsetSums(arr) {
  let sums = new Set([0]);

  for (const value of arr) {
    const next = new Set(sums);
    for (const s of sums) next.add(s + value);
    sums = next;
  }

  return [...sums].sort((a, b) => a - b);
}

/**
 * Boolean-array version for non-negative integers.
 * Time  O(n * total), Space O(total)
 */
function distinctSubsetSumsDP(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const reachable = new Array(total + 1).fill(false);
  reachable[0] = true;

  for (const value of arr) {
    for (let s = total; s >= value; s--) {
      if (reachable[s - value]) reachable[s] = true;
    }
  }

  return reachable.map((ok, s) => (ok ? s : -1)).filter((s) => s !== -1);
}

/** How many distinct sums there are, without listing them. */
const countDistinctSubsetSums = (arr) => distinctSubsetSums(arr).length;

/** The subsets themselves, grouped by their sum. */
function subsetsBySum(arr) {
  const bySum = new Map();

  const total = 1 << arr.length;
  for (let mask = 0; mask < total; mask++) {
    const subset = [];
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
      if (mask & (1 << i)) {
        subset.push(arr[i]);
        sum += arr[i];
      }
    }

    if (!bySum.has(sum)) bySum.set(sum, []);
    bySum.get(sum).push(subset);
  }

  return bySum;
}

/** The smallest positive integer that is NOT a subset sum. */
function smallestNonRepresentable(arr) {
  const sorted = [...arr].filter((n) => n > 0).sort((a, b) => a - b);
  let reachable = 1;

  for (const value of sorted) {
    if (value > reachable) break; // a gap opens here
    reachable += value;
  }

  return reachable;
}

// ---- Examples ----
console.log(distinctSubsetSums([1, 2, 3]));      // [0, 1, 2, 3, 4, 5, 6]
console.log(distinctSubsetSums([2, 2]));         // [0, 2, 4]
console.log(distinctSubsetSums([1, -1]));        // [-1, 0, 1]
console.log(distinctSubsetSumsDP([1, 2, 3]));    // [0,1,2,3,4,5,6]
console.log(countDistinctSubsetSums([1, 2, 3])); // 7
console.log(subsetsBySum([1, 2]).get(3));        // [[1, 2]]
console.log(smallestNonRepresentable([1, 2, 5, 10, 20, 40])); // 4

module.exports = { distinctSubsetSums, distinctSubsetSumsDP, countDistinctSubsetSums, subsetsBySum, smallestNonRepresentable };
