/**
 * Minimize operations to make both arrays equal by decrementing a value
 * from either or both.
 *
 * One operation either decrements one element of one array, or decrements
 * one element of each. Pairing the decrements is what saves work: the
 * answer is max(sumA, sumB) once both are reduced to a common target
 * (usually zero, or the elementwise minimum).
 *
 * Time  O(n)
 * Space O(1)
 */

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/**
 * Reduce both arrays to all zeros. Each operation removes 1 from A, 1 from
 * B, or 1 from each — so pairing is free and the cost is the larger total.
 */
function minOperationsToZero(a, b) {
  const sumA = sum(a);
  const sumB = sum(b);
  return {
    operations: Math.max(sumA, sumB),
    paired: Math.min(sumA, sumB),
    solo: Math.abs(sumA - sumB),
  };
}

/**
 * Make the arrays elementwise EQUAL, decrement only. Each position must
 * come down to min(a[i], b[i]), and the two decrements at a position can
 * be paired only when both sides need one.
 */
function minOperationsElementwise(a, b) {
  let needA = 0;
  let needB = 0;

  for (let i = 0; i < a.length; i++) {
    const target = Math.min(a[i], b[i]);
    needA += a[i] - target;
    needB += b[i] - target;
  }

  return { operations: Math.max(needA, needB), needA, needB };
}

/**
 * Make every element equal when you may increment AND decrement: the
 * cheapest common target is the MEDIAN (LeetCode 462).
 */
function minMovesToEqualElements(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const median = sorted[sorted.length >> 1];
  return sorted.reduce((total, n) => total + Math.abs(n - median), 0);
}

/**
 * Increment n-1 elements by 1 each move (LeetCode 453) — equivalent to
 * decrementing ONE element, so the answer is sum - n * min.
 */
const minMovesIncrementRest = (arr) => sum(arr) - arr.length * Math.min(...arr);

/** Can the two arrays be made equal by reordering alone? */
function canBeEqualByReorder(a, b) {
  if (a.length !== b.length) return false;

  const counts = new Map();
  for (const n of a) counts.set(n, (counts.get(n) || 0) + 1);

  for (const n of b) {
    const left = counts.get(n);
    if (!left) return false;
    counts.set(n, left - 1);
  }

  return true;
}

// ---- Examples ----
console.log(minOperationsToZero([1, 2, 3], [4, 5]));      // max(6, 9) = 9
console.log(minOperationsElementwise([3, 5, 2], [1, 5, 4]));
console.log(minMovesToEqualElements([1, 2, 3]));          // 2
console.log(minMovesIncrementRest([1, 2, 3]));            // 3
console.log(canBeEqualByReorder([1, 2, 3], [3, 2, 1]));   // true

module.exports = { minOperationsToZero, minOperationsElementwise, minMovesToEqualElements, minMovesIncrementRest, canBeEqualByReorder };
