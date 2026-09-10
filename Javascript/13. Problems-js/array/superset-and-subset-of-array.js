/**
 * Superset and subset checks for arrays.
 *
 * Set semantics ignore order and duplicates; multiset semantics respect
 * duplicate counts. Both are here, plus the contiguous "subarray" and the
 * order-preserving "subsequence".
 */

/** Is `sub` a SET-subset of `sup`? Duplicates ignored. */
function isSubset(sub, sup) {
  const set = new Set(sup);
  return [...new Set(sub)].every((item) => set.has(item));
}

/** Is `sup` a superset of `sub`? */
const isSuperset = (sup, sub) => isSubset(sub, sup);

/** Proper subset: a subset that is not equal. */
const isProperSubset = (sub, sup) =>
  isSubset(sub, sup) && new Set(sub).size < new Set(sup).size;

/**
 * MULTISET subset: every value must appear at least as many times in `sup`.
 * [1,1] is a multiset-subset of [1,1,2] but not of [1,2].
 */
function isMultisetSubset(sub, sup) {
  const counts = new Map();
  for (const item of sup) counts.set(item, (counts.get(item) || 0) + 1);

  for (const item of sub) {
    const left = counts.get(item) || 0;
    if (left === 0) return false;
    counts.set(item, left - 1);
  }

  return true;
}

/** Is `sub` a contiguous SUBARRAY of `sup`? */
function isSubarray(sub, sup) {
  if (sub.length === 0) return true;

  outer: for (let i = 0; i + sub.length <= sup.length; i++) {
    for (let j = 0; j < sub.length; j++) {
      if (sup[i + j] !== sub[j]) continue outer;
    }
    return true;
  }

  return false;
}

/** Is `sub` a SUBSEQUENCE of `sup`? Order preserved, gaps allowed. */
function isSubsequence(sub, sup) {
  let j = 0;

  for (const item of sup) {
    if (item === sub[j]) j++;
    if (j === sub.length) return true;
  }

  return sub.length === 0;
}

/** Are the two arrays equal as sets? */
const areSetsEqual = (a, b) => {
  const setA = new Set(a);
  const setB = new Set(b);
  return setA.size === setB.size && [...setA].every((v) => setB.has(v));
};

/** Every subset, via bitmasks — 2^n of them. */
function powerSet(arr) {
  const out = [];

  for (let mask = 0; mask < 1 << arr.length; mask++) {
    const subset = [];
    for (let i = 0; i < arr.length; i++) {
      if (mask & (1 << i)) subset.push(arr[i]);
    }
    out.push(subset);
  }

  return out;
}

// ---- Examples ----
console.log(isSubset([1, 2], [1, 2, 3]));         // true
console.log(isSubset([1, 4], [1, 2, 3]));         // false
console.log(isSuperset([1, 2, 3], [2]));          // true
console.log(isProperSubset([1, 2], [1, 2]));      // false
console.log(isMultisetSubset([1, 1], [1, 2]));    // false
console.log(isMultisetSubset([1, 1], [1, 1, 2])); // true
console.log(isSubarray([2, 3], [1, 2, 3, 4]));    // true
console.log(isSubarray([1, 3], [1, 2, 3]));       // false
console.log(isSubsequence([1, 3], [1, 2, 3]));    // true
console.log(areSetsEqual([1, 2, 2], [2, 1]));     // true
console.log(powerSet([1, 2]));                    // [[],[1],[2],[1,2]]

module.exports = { isSubset, isSuperset, isProperSubset, isMultisetSubset, isSubarray, isSubsequence, areSetsEqual, powerSet };
