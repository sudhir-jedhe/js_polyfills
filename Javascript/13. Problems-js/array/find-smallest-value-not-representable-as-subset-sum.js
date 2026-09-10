/**
 * Find the smallest positive value that cannot be represented as the sum of
 * a subset of the array.
 *
 * Sort, then sweep: if every value up to `reachable - 1` is representable
 * and the next element is bigger than `reachable`, that gap is the answer.
 * Otherwise the element extends the reachable range.
 *
 * Time  O(n log n) for the sort, O(n) for the sweep
 * Space O(1)
 */

/**
 * @param {number[]} arr positive integers
 * @returns {number}
 */
function smallestNonRepresentable(arr) {
  const sorted = [...arr].filter((n) => n > 0).sort((a, b) => a - b);

  let reachable = 1; // everything in [1, reachable - 1] is representable

  for (const value of sorted) {
    if (value > reachable) break; // a gap at `reachable`
    reachable += value;
  }

  return reachable;
}

/** Brute force with a reachability table, to verify the greedy sweep. */
function smallestNonRepresentableBrute(arr) {
  const total = arr.reduce((a, b) => a + b, 0);
  const reachable = new Array(total + 1).fill(false);
  reachable[0] = true;

  for (const value of arr) {
    for (let s = total; s >= value; s--) {
      if (reachable[s - value]) reachable[s] = true;
    }
  }

  for (let s = 1; s <= total; s++) {
    if (!reachable[s]) return s;
  }

  return total + 1;
}

/** The full set of representable sums. */
function representableSums(arr) {
  let sums = new Set([0]);

  for (const value of arr) {
    const next = new Set(sums);
    for (const s of sums) next.add(s + value);
    sums = next;
  }

  sums.delete(0);
  return [...sums].sort((a, b) => a - b);
}

/**
 * How many coins must be ADDED so every value in [1, n] is representable
 * (LeetCode 330 - Patching Array).
 */
function minPatches(sorted, n) {
  let reachable = 1;
  let patches = 0;
  let i = 0;

  while (reachable <= n) {
    if (i < sorted.length && sorted[i] <= reachable) {
      reachable += sorted[i++];
    } else {
      reachable += reachable; // patch with `reachable` itself
      patches++;
    }
  }

  return patches;
}

// ---- Examples ----
console.log(smallestNonRepresentable([1, 3, 6, 10, 11, 15])); // 2
console.log(smallestNonRepresentable([1, 1, 1, 1]));          // 5
console.log(smallestNonRepresentable([1, 2, 5, 10, 20, 40])); // 4
console.log(smallestNonRepresentableBrute([1, 3, 6]));        // 2
console.log(representableSums([1, 2, 3]));                    // [1,2,3,4,5,6]
console.log(minPatches([1, 3], 6));                           // 1

module.exports = { smallestNonRepresentable, smallestNonRepresentableBrute, representableSums, minPatches };
