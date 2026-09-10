/**
 * Convert a number into an array of its digits.
 *
 * String-based versions are the readable ones; the arithmetic version
 * avoids string allocation and shows the division/modulo pattern.
 */

/** Digits, most significant first. */
const toDigits = (n) => [...String(Math.abs(Math.trunc(n)))].map(Number);

/** Same, without strings — collect remainders then reverse. */
function toDigitsMath(n) {
  let value = Math.abs(Math.trunc(n));
  if (value === 0) return [0];

  const digits = [];
  while (value > 0) {
    digits.unshift(value % 10);
    value = Math.floor(value / 10);
  }

  return digits;
}

/** Digits including the fractional part: 12.34 -> [1, 2, '.', 3, 4]. */
const toDigitsWithDecimal = (n) =>
  [...String(n)].map((ch) => (/\d/.test(ch) ? Number(ch) : ch));

/** Back the other way. */
const fromDigits = (digits) => Number(digits.join(''));

/** Sum of digits — the most common follow-up. */
const digitSum = (n) => toDigits(n).reduce((a, b) => a + b, 0);

/**
 * Digital root: repeatedly sum the digits until one remains.
 * Closed form: 1 + (n - 1) % 9 for n > 0.
 */
const digitalRoot = (n) => (n === 0 ? 0 : 1 + ((Math.abs(n) - 1) % 9));

/** Reverse a number's digits: 123 -> 321. */
const reverseNumber = (n) => Math.sign(n) * Number([...String(Math.abs(n))].reverse().join(''));

// ---- Examples ----
console.log(toDigits(12345));        // [1, 2, 3, 4, 5]
console.log(toDigits(-407));         // [4, 0, 7]
console.log(toDigitsMath(1000));     // [1, 0, 0, 0]
console.log(toDigitsMath(0));        // [0]
console.log(toDigitsWithDecimal(12.34)); // [1, 2, '.', 3, 4]
console.log(fromDigits([1, 2, 3]));  // 123
console.log(digitSum(9875));         // 29
console.log(digitalRoot(9875));      // 2
console.log(reverseNumber(-123));    // -321

module.exports = { toDigits, toDigitsMath, toDigitsWithDecimal, fromDigits, digitSum, digitalRoot, reverseNumber };
