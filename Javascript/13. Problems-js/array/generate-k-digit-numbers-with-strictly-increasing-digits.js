/**
 * Generate all k-digit numbers whose digits are in strictly increasing
 * order.
 *
 * Since the digits must strictly increase, each number is just a choice of
 * k distinct digits from 1..9 in ascending order — C(9, k) of them, so at
 * most 126 for any k.
 */

/**
 * @param {number} k number of digits
 * @returns {number[]}
 */
function increasingDigitNumbers(k) {
  if (k < 1 || k > 9) return [];

  const out = [];
  const current = [];

  function build(start) {
    if (current.length === k) {
      out.push(Number(current.join('')));
      return;
    }

    // Leave enough digits to finish: the last usable start is 9 - remaining + 1.
    const remaining = k - current.length;
    for (let d = start; d <= 10 - remaining; d++) {
      current.push(d);
      build(d + 1);
      current.pop();
    }
  }

  build(1);
  return out;
}

/** Non-decreasing digits instead — repeats are allowed. */
function nonDecreasingDigitNumbers(k) {
  const out = [];
  const current = [];

  function build(start) {
    if (current.length === k) {
      out.push(Number(current.join('')));
      return;
    }
    for (let d = start; d <= 9; d++) {
      current.push(d);
      build(d);
      current.pop();
    }
  }

  build(1);
  return out;
}

/** Strictly DECREASING digits. */
const decreasingDigitNumbers = (k) =>
  increasingDigitNumbers(k).map((n) => Number([...String(n)].reverse().join('')));

/** Does a given number have strictly increasing digits? */
function hasIncreasingDigits(n) {
  const digits = String(Math.abs(n));
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] <= digits[i - 1]) return false;
  }
  return true;
}

/** Count without generating: C(9, k). */
function countIncreasingDigitNumbers(k) {
  if (k < 1 || k > 9) return 0;

  let result = 1;
  for (let i = 0; i < k; i++) result = (result * (9 - i)) / (i + 1);
  return Math.round(result);
}

// ---- Examples ----
console.log(increasingDigitNumbers(2).slice(0, 8)); // [12,13,14,15,16,17,18,19]
console.log(increasingDigitNumbers(3).length);      // 84 = C(9,3)
console.log(countIncreasingDigitNumbers(3));        // 84
console.log(increasingDigitNumbers(9));             // [123456789]
console.log(nonDecreasingDigitNumbers(2).length);   // 45
console.log(decreasingDigitNumbers(2).slice(0, 5)); // [21,31,41,51,61]
console.log(hasIncreasingDigits(13579));            // true

module.exports = { increasingDigitNumbers, nonDecreasingDigitNumbers, decreasingDigitNumbers, hasIncreasingDigits, countIncreasingDigitNumbers };
