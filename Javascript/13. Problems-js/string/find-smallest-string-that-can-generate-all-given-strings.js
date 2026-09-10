/**
 * Find the smallest string whose characters can generate all given strings.
 *
 * "Generate" means every given string must be buildable from the result's
 * characters, so the answer holds, for each character, the MAXIMUM count
 * that any single input needs. This is the "common superset multiset".
 *
 * Time  O(total characters)
 */

/** @param {string} str @returns {Map<string, number>} */
function charCount(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return counts;
}

/**
 * @param {string[]} strings
 * @returns {string} characters sorted, so the output is deterministic
 */
function smallestGeneratingString(strings) {
  const required = new Map();

  for (const str of strings) {
    for (const [ch, count] of charCount(str)) {
      required.set(ch, Math.max(required.get(ch) || 0, count));
    }
  }

  return [...required.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .flatMap(([ch, count]) => Array(count).fill(ch))
    .join('');
}

/** Can `pool` build `target` using each character at most as often as it has it? */
function canBuild(pool, target) {
  const available = charCount(pool);

  for (const [ch, need] of charCount(target)) {
    if ((available.get(ch) || 0) < need) return false;
  }

  return true;
}

/**
 * The dual problem: the LARGEST string usable by ALL of them —
 * the common subset, taking the minimum count per character.
 */
function largestCommonSubset(strings) {
  if (strings.length === 0) return '';

  let common = charCount(strings[0]);

  for (const str of strings.slice(1)) {
    const counts = charCount(str);
    const next = new Map();
    for (const [ch, n] of common) {
      const shared = Math.min(n, counts.get(ch) || 0);
      if (shared > 0) next.set(ch, shared);
    }
    common = next;
  }

  return [...common.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .flatMap(([ch, n]) => Array(n).fill(ch))
    .join('');
}

// ---- Examples ----
console.log(smallestGeneratingString(['your', 'you', 'or', 'yo'])); // 'oruy'
console.log(smallestGeneratingString(['abc', 'aab']));              // 'aabc'
console.log(canBuild('aabc', 'aab'));                               // true
console.log(canBuild('abc', 'aab'));                                // false
console.log(largestCommonSubset(['bella', 'label', 'roller']));     // 'ell'

module.exports = { smallestGeneratingString, canBuild, largestCommonSubset, charCount };
