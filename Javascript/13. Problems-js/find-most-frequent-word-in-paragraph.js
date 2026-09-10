/**
 * Find the most frequent word in a paragraph.
 *
 * Case-insensitive, punctuation stripped. Ties are broken by first
 * appearance. Optionally ignore a list of banned/stop words.
 */

/**
 * @param {string} paragraph
 * @param {string[]} [banned=[]]
 * @returns {{ word: string | null, count: number }}
 */
function mostFrequentWord(paragraph, banned = []) {
  const skip = new Set(banned.map((w) => w.toLowerCase()));

  const words = String(paragraph)
    .toLowerCase()
    .match(/[a-z0-9']+/g) || [];

  const counts = new Map();
  let best = null;
  let bestCount = 0;

  for (const word of words) {
    if (skip.has(word)) continue;
    const next = (counts.get(word) || 0) + 1;
    counts.set(word, next);
    if (next > bestCount) {
      best = word;
      bestCount = next;
    }
  }

  return { word: best, count: bestCount };
}

/** Full frequency table, sorted by count desc. */
function wordFrequencies(paragraph) {
  const words = String(paragraph).toLowerCase().match(/[a-z0-9']+/g) || [];
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

// ---- Examples ----
const para = 'Bob hit a ball, the hit BALL flew far after it was hit.';
console.log(mostFrequentWord(para));           // { word: 'hit', count: 3 }
console.log(mostFrequentWord(para, ['hit']));  // { word: 'ball', count: 2 }
console.log(wordFrequencies('a b a c b a').slice(0, 2)); // [['a',3], ['b',2]]

module.exports = { mostFrequentWord, wordFrequencies };
