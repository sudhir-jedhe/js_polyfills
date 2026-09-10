/**
 * Find all autobiographical (self-descriptive) numbers with a given number
 * of digits.
 *
 * In an autobiographical number, digit at position i counts how many times
 * the digit i appears in the number. 6210001000 is the 10-digit example:
 * six 0s, two 1s, one 2, one 6.
 *
 * Brute force over all d-digit numbers is 10^d, so this uses the two
 * structural constraints instead:
 *   - the digits sum to d (every position is accounted for)
 *   - sum of i * digit[i] also equals d
 */

/** Is this specific number autobiographical? */
function isAutobiographical(n) {
  const digits = [...String(n)].map(Number);

  for (let i = 0; i < digits.length; i++) {
    const occurrences = digits.filter((d) => d === i).length;
    if (occurrences !== digits[i]) return false;
  }

  return true;
}

/**
 * All autobiographical numbers with exactly `length` digits.
 * Builds candidates whose digit sum is `length`, then verifies.
 */
function autobiographicalNumbers(length) {
  const out = [];
  const digits = new Array(length).fill(0);

  function build(index, remaining) {
    if (index === length) {
      if (remaining === 0 && digits[0] !== 0 && isAutobiographical(digits.join(''))) {
        out.push(Number(digits.join('')));
      }
      return;
    }

    // Digits must still sum to `length`, so cap the choice.
    for (let d = 0; d <= Math.min(9, remaining); d++) {
      digits[index] = d;
      build(index + 1, remaining - d);
    }

    digits[index] = 0;
  }

  build(0, length);
  return out;
}

/** All of them up to 10 digits (there are only a handful). */
const allAutobiographical = () =>
  Array.from({ length: 10 }, (_, i) => i + 1).flatMap(autobiographicalNumbers);

/**
 * Self-descriptive in another sense: does the number describe its own digit
 * counts as "count digit" pairs? e.g. 22 -> "two 2s".
 */
function describeDigits(n) {
  const counts = new Map();
  for (const ch of String(n)) counts.set(ch, (counts.get(ch) || 0) + 1);
  return [...counts.entries()].map(([digit, count]) => `${count}x${digit}`).join(' ');
}

// ---- Examples ----
console.log(isAutobiographical(1210));      // true
console.log(isAutobiographical(2020));      // true
console.log(isAutobiographical(1234));      // false
console.log(autobiographicalNumbers(4));    // [1210, 2020]
console.log(autobiographicalNumbers(5));    // [21200]
console.log(describeDigits(1210));          // '1x1 1x2 2x0'

module.exports = { isAutobiographical, autobiographicalNumbers, allAutobiographical, describeDigits };
