/**
 * Divide a number into two parts such that the sum of their digit sums is
 * maximum.
 *
 * Split n into a + b (both non-negative) maximising digitSum(a)+digitSum(b).
 * The greedy answer: make one part the largest number of all 9s that is
 * <= n, because 9s carry the most digit-sum per unit.
 */

/** Sum of a number's decimal digits. */
const digitSum = (n) => {
  let value = Math.abs(Math.trunc(n));
  let sum = 0;
  while (value > 0) {
    sum += value % 10;
    value = Math.floor(value / 10);
  }
  return sum;
};

/**
 * @param {number} n
 * @returns {{ a: number, b: number, total: number }}
 */
function maxDigitSumSplit(n) {
  if (n < 10) return { a: n, b: 0, total: digitSum(n) };

  // Largest all-9s number with one fewer digit than n, e.g. 99 for 356.
  const digits = String(n).length;
  const nines = 10 ** (digits - 1) - 1;

  const a = Math.min(nines, n);
  const b = n - a;

  return { a, b, total: digitSum(a) + digitSum(b) };
}

/** Brute force, to verify the greedy choice on small inputs. */
function maxDigitSumSplitBrute(n) {
  let best = { a: 0, b: n, total: digitSum(n) };

  for (let a = 0; a <= n; a++) {
    const total = digitSum(a) + digitSum(n - a);
    if (total > best.total) best = { a, b: n - a, total };
  }

  return best;
}

/** Split into k parts, same greedy idea applied repeatedly. */
function maxDigitSumSplitK(n, k) {
  const parts = [];
  let remaining = n;

  for (let i = 0; i < k - 1 && remaining > 0; i++) {
    const digits = String(remaining).length;
    const nines = 10 ** (digits - 1) - 1;
    const part = Math.min(nines, remaining);
    parts.push(part);
    remaining -= part;
  }

  parts.push(remaining);
  while (parts.length < k) parts.push(0);

  return { parts, total: parts.reduce((sum, p) => sum + digitSum(p), 0) };
}

// ---- Examples ----
console.log(maxDigitSumSplit(35));       // { a: 9, b: 26, total: 17 }
console.log(maxDigitSumSplitBrute(35));  // matches
console.log(maxDigitSumSplit(7));        // { a: 7, b: 0, total: 7 }
console.log(maxDigitSumSplit(100));      // { a: 99, b: 1, total: 19 }
console.log(maxDigitSumSplitK(250, 3));
console.log(digitSum(493193));           // 29

module.exports = { maxDigitSumSplit, maxDigitSumSplitBrute, maxDigitSumSplitK, digitSum };
