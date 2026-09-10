/**
 * Check if a string can be formed from another by at most X circular
 * clockwise shifts of each character.
 *
 * Each character of `source` may be advanced forward through the alphabet
 * (wrapping z -> a) by 0..x positions to reach the matching character of
 * `target`. Every position must be satisfiable independently.
 *
 * Time  O(n)
 */

/**
 * Clockwise distance from `from` to `to` in a 26-letter ring.
 * @param {string} from
 * @param {string} to
 * @returns {number} 0..25
 */
function shiftDistance(from, to) {
  return (to.charCodeAt(0) - from.charCodeAt(0) + 26) % 26;
}

/**
 * @param {string} source
 * @param {string} target
 * @param {number} x maximum shift allowed per character
 * @returns {boolean}
 */
function canFormByShifts(source, target, x) {
  if (source.length !== target.length) return false;

  for (let i = 0; i < source.length; i++) {
    if (shiftDistance(source[i], target[i]) > x) return false;
  }

  return true;
}

/** The per-character shifts required, or null if the lengths differ. */
function requiredShifts(source, target) {
  if (source.length !== target.length) return null;
  return [...source].map((ch, i) => shiftDistance(ch, target[i]));
}

/** Shift a whole string clockwise by n. */
const shiftString = (str, n) =>
  [...str]
    .map((ch) => String.fromCharCode(((ch.charCodeAt(0) - 97 + n) % 26) + 97))
    .join('');

// ---- Examples ----
console.log(canFormByShifts('abc', 'bcd', 1)); // true  (each shifts by 1)
console.log(canFormByShifts('abc', 'bcd', 0)); // false
console.log(canFormByShifts('you', 'ara', 6)); // true
console.log(requiredShifts('abc', 'bcd'));     // [1, 1, 1]
console.log(requiredShifts('az', 'ba'));       // [1, 1]  (z wraps to a)
console.log(shiftString('xyz', 3));            // 'abc'

module.exports = { canFormByShifts, requiredShifts, shiftDistance, shiftString };
