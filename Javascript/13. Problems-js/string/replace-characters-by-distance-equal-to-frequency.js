/**
 * Modify a string by replacing characters with the alphabet whose distance
 * from that character equals its frequency.
 *
 * For each character c with frequency f, replace it with the letter f
 * positions after c (wrapping around a-z).
 *
 * Time  O(n)
 */

/** Forward shift with wraparound. */
const shiftForward = (ch, n) => {
  const code = ch.charCodeAt(0);
  if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + (n % 26)) % 26) + 97);
  if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + (n % 26)) % 26) + 65);
  return ch;
};

/** Backward shift with wraparound. */
const shiftBackward = (ch, n) => shiftForward(ch, 26 - (n % 26));

/**
 * @param {string} str
 * @returns {string}
 */
function replaceByFrequencyDistance(str) {
  const freq = new Map();
  for (const ch of str) freq.set(ch, (freq.get(ch) || 0) + 1);

  return [...str].map((ch) => shiftForward(ch, freq.get(ch))).join('');
}

/** The same shift applied backwards, when the problem asks for "before". */
function replaceByFrequencyDistanceBackward(str) {
  const freq = new Map();
  for (const ch of str) freq.set(ch, (freq.get(ch) || 0) + 1);

  return [...str].map((ch) => shiftBackward(ch, freq.get(ch))).join('');
}

/** Undo replaceByFrequencyDistance, given the ORIGINAL frequencies. */
const invertWithFrequencies = (encoded, freqOfOriginal) =>
  [...encoded].map((ch, i) => shiftBackward(ch, freqOfOriginal[i])).join('');

// ---- Examples ----
console.log(replaceByFrequencyDistance('geeksforgeeks'));
console.log(replaceByFrequencyDistance('aab'));  // 'ccc'
console.log(replaceByFrequencyDistance('xyz'));  // 'yza'  (each appears once)
console.log(replaceByFrequencyDistanceBackward('aab')); // backward shift
console.log(shiftForward('z', 1));               // 'a'
console.log(shiftBackward('a', 1));              // 'z'

module.exports = {
  replaceByFrequencyDistance,
  replaceByFrequencyDistanceBackward,
  invertWithFrequencies,
  shiftForward,
  shiftBackward,
};
