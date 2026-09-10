/**
 * Count pairs (i < j) that are both even, both odd, or whose sum is
 * divisible by k.
 *
 * Counting by remainder class turns an O(n^2) scan into O(n + k).
 */

/** Pairs where both values are even OR both are odd. */
function countSameParityPairs(arr) {
  let even = 0;
  let odd = 0;

  for (const n of arr) {
    if (Math.abs(n) % 2 === 0) even++;
    else odd++;
  }

  // C(even, 2) + C(odd, 2)
  return (even * (even - 1)) / 2 + (odd * (odd - 1)) / 2;
}

/**
 * Pairs whose SUM is divisible by k.
 * Two numbers pair up when (a % k) + (b % k) is 0 or k.
 * Time  O(n + k)
 */
function countPairsDivisibleByK(arr, k) {
  const buckets = new Array(k).fill(0);
  for (const n of arr) buckets[((n % k) + k) % k]++;

  let pairs = (buckets[0] * (buckets[0] - 1)) / 2; // both ≡ 0

  for (let r = 1; r <= k / 2; r++) {
    if (r === k - r) {
      // the exact middle remainder pairs with itself
      pairs += (buckets[r] * (buckets[r] - 1)) / 2;
    } else {
      pairs += buckets[r] * buckets[k - r];
    }
  }

  return pairs;
}

/** Pairs whose sum equals exactly k. */
function countPairsWithSum(arr, k) {
  const seen = new Map();
  let pairs = 0;

  for (const n of arr) {
    pairs += seen.get(k - n) || 0;
    seen.set(n, (seen.get(n) || 0) + 1);
  }

  return pairs;
}

/** The pairs themselves, not just the count. */
function findPairsWithSum(arr, k) {
  const seen = new Map();
  const out = [];

  for (let i = 0; i < arr.length; i++) {
    const need = k - arr[i];
    for (const j of seen.get(need) || []) out.push([j, i]);
    if (!seen.has(arr[i])) seen.set(arr[i], []);
    seen.get(arr[i]).push(i);
  }

  return out;
}

/** Brute force, for verifying the counting logic. */
function countSameParityPairsBrute(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] % 2 === arr[j] % 2) count++;
    }
  }
  return count;
}

// ---- Examples ----
console.log(countSameParityPairs([1, 2, 3, 4]));      // 2  (1&3, 2&4)
console.log(countSameParityPairsBrute([1, 2, 3, 4])); // 2
console.log(countPairsDivisibleByK([2, 2, 1, 7, 5, 3], 4)); // 5
console.log(countPairsWithSum([1, 5, 7, -1, 5], 6));  // 3
console.log(findPairsWithSum([1, 5, 7, -1], 6));      // [[0,1], [2,3]]

module.exports = { countSameParityPairs, countPairsDivisibleByK, countPairsWithSum, findPairsWithSum };
