/**
 * Minimize the cost of converting all occurrences of each distinct
 * character to lowercase or uppercase.
 *
 * Each distinct LETTER is decided independently: convert all its uppercase
 * occurrences down, or all its lowercase occurrences up — whichever is
 * fewer conversions. Summing those minima gives the answer.
 *
 * Time  O(n)
 * Space O(1) — 26 letters
 */

/**
 * @param {string} str
 * @param {{ toLowerCost?: number, toUpperCost?: number }} [costs]
 * @returns {{ total: number, decisions: Record<string, string> }}
 */
function minimizeCaseCost(str, { toLowerCost = 1, toUpperCost = 1 } = {}) {
  const lower = new Map();
  const upper = new Map();

  for (const ch of str) {
    if (ch >= 'a' && ch <= 'z') lower.set(ch, (lower.get(ch) || 0) + 1);
    else if (ch >= 'A' && ch <= 'Z') {
      const key = ch.toLowerCase();
      upper.set(key, (upper.get(key) || 0) + 1);
    }
  }

  let total = 0;
  const decisions = {};

  for (const letter of new Set([...lower.keys(), ...upper.keys()])) {
    const lowerCount = lower.get(letter) || 0;
    const upperCount = upper.get(letter) || 0;

    const costToLower = upperCount * toLowerCost; // convert the uppercase ones down
    const costToUpper = lowerCount * toUpperCost; // convert the lowercase ones up

    if (costToLower <= costToUpper) {
      total += costToLower;
      decisions[letter] = 'lowercase';
    } else {
      total += costToUpper;
      decisions[letter] = 'uppercase';
    }
  }

  return { total, decisions };
}

/** Apply the decisions, so the result can be checked. */
function applyDecisions(str, decisions) {
  return [...str]
    .map((ch) => {
      const letter = ch.toLowerCase();
      if (!decisions[letter]) return ch;
      return decisions[letter] === 'lowercase' ? letter : letter.toUpperCase();
    })
    .join('');
}

/** How many characters are currently in each case. */
function caseCounts(str) {
  let lower = 0;
  let upper = 0;
  let other = 0;

  for (const ch of str) {
    if (ch >= 'a' && ch <= 'z') lower++;
    else if (ch >= 'A' && ch <= 'Z') upper++;
    else other++;
  }

  return { lower, upper, other };
}

/** The simpler variant: make the WHOLE string one case, minimum changes. */
function minChangesToOneCase(str) {
  const { lower, upper } = caseCounts(str);
  return { cost: Math.min(lower, upper), target: lower <= upper ? 'uppercase' : 'lowercase' };
}

// ---- Examples ----
const result = minimizeCaseCost('aAbBBc');
console.log(result);
// a: 1 lower 1 upper -> either; b: 1 lower 2 upper -> uppercase; c: lowercase

console.log(applyDecisions('aAbBBc', result.decisions));
console.log(caseCounts('aAbBBc'));       // { lower: 3, upper: 3, other: 0 }
console.log(minChangesToOneCase('aAbBBc'));

module.exports = { minimizeCaseCost, applyDecisions, caseCounts, minChangesToOneCase };
