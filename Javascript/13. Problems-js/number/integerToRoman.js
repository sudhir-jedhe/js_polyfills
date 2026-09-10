/**
 * Integer to Roman numeral (LeetCode 12), and back.
 *
 * Greedy over a value table that already contains the subtractive forms
 * (CM, CD, XC, XL, IX, IV), so no special-casing is needed.
 *
 * Valid range: 1..3999
 */

const ROMAN = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/**
 * @param {number} num 1..3999
 * @returns {string}
 */
function intToRoman(num) {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new RangeError('Roman numerals cover 1..3999');
  }

  let remaining = num;
  let out = '';

  for (const [value, symbol] of ROMAN) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }

  return out;
}

const SYMBOL_VALUE = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/**
 * Roman -> integer. A symbol smaller than the one to its right is
 * subtracted rather than added.
 */
function romanToInt(roman) {
  const s = String(roman).toUpperCase();
  let total = 0;

  for (let i = 0; i < s.length; i++) {
    const current = SYMBOL_VALUE[s[i]];
    const next = SYMBOL_VALUE[s[i + 1]];
    total += next > current ? -current : current;
  }

  return total;
}

// ---- Examples ----
console.log(intToRoman(3));    // 'III'
console.log(intToRoman(58));   // 'LVIII'
console.log(intToRoman(1994)); // 'MCMXCIV'
console.log(romanToInt('MCMXCIV')); // 1994
console.log(romanToInt('LVIII'));   // 58

module.exports = { intToRoman, romanToInt, ROMAN };
