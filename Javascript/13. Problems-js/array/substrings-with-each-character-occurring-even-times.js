/**
 * Number of substrings where each character occurs an EVEN number of times.
 *
 * Track a bitmask of character parities. Two positions with the same mask
 * bracket a substring where every character appears an even number of
 * times, so count equal masks.
 *
 * Time  O(n)
 * Space O(distinct masks)
 */

/**
 * @param {string} str lowercase a-z
 * @returns {number}
 */
function countEvenSubstrings(str) {
  const counts = new Map([[0, 1]]); // the empty prefix has all-even parities
  let mask = 0;
  let total = 0;

  for (const ch of str) {
    mask ^= 1 << (ch.charCodeAt(0) - 97); // flip this character's parity bit

    total += counts.get(mask) || 0;       // every earlier equal mask closes one
    counts.set(mask, (counts.get(mask) || 0) + 1);
  }

  return total;
}

/** The substrings themselves, as [start, end] pairs. */
function findEvenSubstrings(str) {
  const positions = new Map([[0, [0]]]);
  let mask = 0;
  const out = [];

  for (let i = 0; i < str.length; i++) {
    mask ^= 1 << (str.charCodeAt(i) - 97);

    for (const start of positions.get(mask) || []) out.push([start, i]);

    if (!positions.has(mask)) positions.set(mask, []);
    positions.get(mask).push(i + 1);
  }

  return out;
}

/**
 * Longest substring where every VOWEL occurs an even number of times
 * (LeetCode 1371) — the same trick with only 5 bits.
 */
function longestEvenVowels(str) {
  const VOWELS = 'aeiou';
  const firstSeen = new Map([[0, -1]]);

  let mask = 0;
  let best = 0;

  for (let i = 0; i < str.length; i++) {
    const v = VOWELS.indexOf(str[i]);
    if (v !== -1) mask ^= 1 << v;

    if (firstSeen.has(mask)) best = Math.max(best, i - firstSeen.get(mask));
    else firstSeen.set(mask, i);
  }

  return best;
}

/** Brute-force verification for small inputs. */
function countEvenSubstringsBrute(str) {
  let total = 0;

  for (let i = 0; i < str.length; i++) {
    const counts = new Map();

    for (let j = i; j < str.length; j++) {
      counts.set(str[j], (counts.get(str[j]) || 0) + 1);
      if ([...counts.values()].every((n) => n % 2 === 0)) total++;
    }
  }

  return total;
}

// ---- Examples ----
console.log(countEvenSubstrings('abab'));      // 'abab' and 'baba'-style spans
console.log(countEvenSubstringsBrute('abab')); // same answer
console.log(countEvenSubstrings('aa'));        // 1
console.log(findEvenSubstrings('aabb'));
console.log(longestEvenVowels('eleetminicoworoep')); // 13

module.exports = { countEvenSubstrings, findEvenSubstrings, longestEvenVowels, countEvenSubstringsBrute };
