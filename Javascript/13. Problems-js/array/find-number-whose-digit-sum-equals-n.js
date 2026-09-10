/**
 * Find the smallest number X whose digits sum to N.
 *
 * Greedy from the right: fill the least significant positions with 9s so the
 * number has as few digits as possible, then put the remainder in front.
 *
 * Time  O(N / 9)
 */

/**
 * @param {number} n target digit sum
 * @returns {string} smallest number with that digit sum, as a string
 *                   (strings keep exactness beyond Number.MAX_SAFE_INTEGER)
 */
function smallestWithDigitSum(n) {
  if (n <= 0) return '0';
  if (n > 9 * 100) {
    // Still fine — the string just gets long.
  }

  const nines = Math.floor(n / 9);
  const remainder = n % 9;

  return (remainder > 0 ? String(remainder) : '') + '9'.repeat(nines);
}

/** The LARGEST number with a given digit count and digit sum. */
function largestWithDigitSum(digits, sum) {
  if (sum > digits * 9 || sum < 1) return null;

  const out = [];
  let remaining = sum;

  for (let i = 0; i < digits; i++) {
    const d = Math.min(9, remaining - (digits - i - 1) * 0);
    const take = Math.min(9, remaining);
    out.push(take);
    remaining -= take;
  }

  return remaining === 0 ? out.join('') : null;
}

/** The smallest number with a FIXED digit count and digit sum (LeetCode 967-ish). */
function smallestWithDigitsAndSum(digits, sum) {
  if (sum < 1 || sum > digits * 9) return null;

  const out = new Array(digits).fill(0);
  let remaining = sum - 1; // reserve 1 for the leading digit
  out[0] = 1;

  for (let i = digits - 1; i >= 0 && remaining > 0; i--) {
    const add = Math.min(9 - out[i], remaining);
    out[i] += add;
    remaining -= add;
  }

  return out.join('');
}

/** Sum of a number's digits. */
const digitSum = (n) => [...String(Math.abs(n))].reduce((a, d) => a + Number(d), 0);

/** Brute-force search, to verify the greedy answer for small n. */
function smallestWithDigitSumBrute(n, limit = 100000) {
  for (let i = 1; i <= limit; i++) {
    if (digitSum(i) === n) return String(i);
  }
  return null;
}

// ---- Examples ----
console.log(smallestWithDigitSum(9));    // '9'
console.log(smallestWithDigitSum(10));   // '19'
console.log(smallestWithDigitSum(20));   // '299'
console.log(smallestWithDigitSumBrute(20)); // '299'
console.log(smallestWithDigitsAndSum(3, 20)); // '299'
console.log(largestWithDigitSum(3, 20));      // '992'
console.log(digitSum(299));              // 20

module.exports = { smallestWithDigitSum, smallestWithDigitsAndSum, largestWithDigitSum, digitSum, smallestWithDigitSumBrute };
