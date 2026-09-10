/**
 * Armstrong (narcissistic) number.
 *
 * A number equal to the sum of its own digits each raised to the power of
 * the digit count. 153 = 1^3 + 5^3 + 3^3.
 */

/**
 * @param {number} n
 * @returns {boolean}
 */
function isArmstrong(n) {
  if (!Number.isInteger(n) || n < 0) return false;

  const digits = String(n).split('');
  const power = digits.length;

  const sum = digits.reduce((acc, d) => acc + Number(d) ** power, 0);
  return sum === n;
}

/** Arithmetic version — no string conversion. */
function isArmstrongMath(n) {
  if (!Number.isInteger(n) || n < 0) return false;

  let digits = 0;
  for (let t = n; t > 0; t = Math.floor(t / 10)) digits++;
  if (n === 0) digits = 1;

  let sum = 0;
  for (let t = n; t > 0; t = Math.floor(t / 10)) {
    sum += (t % 10) ** digits;
  }

  return sum === n;
}

/** Every Armstrong number up to `limit`. */
function armstrongNumbersUpTo(limit) {
  const out = [];
  for (let i = 0; i <= limit; i++) if (isArmstrong(i)) out.push(i);
  return out;
}

// ---- Examples ----
console.log(isArmstrong(153));   // true
console.log(isArmstrong(9474));  // true
console.log(isArmstrong(154));   // false
console.log(isArmstrongMath(370));// true
console.log(armstrongNumbersUpTo(1000)); // [0,1,2,...,9,153,370,371,407]

module.exports = { isArmstrong, isArmstrongMath, armstrongNumbersUpTo };
