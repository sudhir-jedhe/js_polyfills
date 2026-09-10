/**
 * Find the number that appears once when every other number appears twice
 * (LeetCode 136), plus the harder variants.
 *
 * XOR is the key: a ^ a === 0 and a ^ 0 === a, so XORing everything cancels
 * the pairs and leaves the single value. O(n) time, O(1) space.
 */

/** Every other number appears exactly twice. */
const singleNumber = (arr) => arr.reduce((acc, n) => acc ^ n, 0);

/**
 * Every other number appears exactly THREE times (LeetCode 137).
 * `ones` and `twos` track bits seen once and twice; a bit seen three times
 * is cleared from both.
 */
function singleNumberThrice(arr) {
  let ones = 0;
  let twos = 0;

  for (const n of arr) {
    ones = (ones ^ n) & ~twos;
    twos = (twos ^ n) & ~ones;
  }

  return ones;
}

/**
 * TWO numbers appear once, the rest twice (LeetCode 260).
 * XOR everything, isolate any set bit of the result, and partition on it.
 */
function singleNumbersTwo(arr) {
  const xorAll = arr.reduce((acc, n) => acc ^ n, 0);
  const lowestBit = xorAll & -xorAll; // isolate the rightmost set bit

  let a = 0;
  let b = 0;

  for (const n of arr) {
    if (n & lowestBit) a ^= n;
    else b ^= n;
  }

  return [a, b];
}

/** Map-based version — works for any repeat count and non-integers. */
function singleByCount(arr, appearances = 1) {
  const counts = new Map();
  for (const n of arr) counts.set(n, (counts.get(n) || 0) + 1);

  for (const [value, count] of counts) {
    if (count === appearances) return value;
  }

  return undefined;
}

/**
 * A SORTED array where every element appears twice except one
 * (LeetCode 540) — binary search in O(log n).
 */
function singleInSortedArray(sorted) {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2 === 1) mid--; // align to the start of a pair

    if (sorted[mid] === sorted[mid + 1]) lo = mid + 2;
    else hi = mid;
  }

  return sorted[lo];
}

// ---- Examples ----
console.log(singleNumber([4, 1, 2, 1, 2]));          // 4
console.log(singleNumber([2, 2, 1]));                // 1
console.log(singleNumberThrice([2, 2, 3, 2]));       // 3
console.log(singleNumbersTwo([1, 2, 1, 3, 2, 5]));   // [3, 5] (order may vary)
console.log(singleByCount(['a', 'b', 'a']));         // 'b'
console.log(singleInSortedArray([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2

module.exports = { singleNumber, singleNumberThrice, singleNumbersTwo, singleByCount, singleInSortedArray };
