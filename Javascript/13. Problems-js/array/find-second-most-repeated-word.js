/**
 * Find the second most repeated word in a sequence.
 *
 * Count, then take the second highest count. Ties are broken by first
 * appearance, which a Map preserves for free.
 *
 * Time  O(n)
 */

/** Frequency map, insertion-ordered. */
function wordCounts(words) {
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  return counts;
}

/**
 * @param {string[]} words
 * @returns {{ word: string, count: number } | null}
 */
function secondMostRepeated(words) {
  let first = null;
  let second = null;

  for (const [word, count] of wordCounts(words)) {
    if (!first || count > first.count) {
      second = first;
      first = { word, count };
    } else if (!second || count > second.count) {
      second = { word, count };
    }
  }

  return second;
}

/** Sort-based version — easier to read, O(n log n). */
function secondMostRepeatedSort(words) {
  const sorted = [...wordCounts(words).entries()].sort((a, b) => b[1] - a[1]);
  return sorted[1] ? { word: sorted[1][0], count: sorted[1][1] } : null;
}

/** The most repeated word. */
function mostRepeated(words) {
  let best = null;

  for (const [word, count] of wordCounts(words)) {
    if (!best || count > best.count) best = { word, count };
  }

  return best;
}

/** The kth most repeated. */
const kthMostRepeated = (words, k) => {
  const sorted = [...wordCounts(words).entries()].sort((a, b) => b[1] - a[1]);
  return sorted[k - 1] ? { word: sorted[k - 1][0], count: sorted[k - 1][1] } : null;
};

/** Split a sentence into words first, if that's the input. */
const wordsOf = (text) => String(text).toLowerCase().match(/[a-z0-9']+/g) || [];

// ---- Examples ----
const words = ['aaa', 'bbb', 'ccc', 'bbb', 'aaa', 'aaa'];

console.log(secondMostRepeated(words));      // { word: 'bbb', count: 2 }
console.log(secondMostRepeatedSort(words));  // { word: 'bbb', count: 2 }
console.log(mostRepeated(words));            // { word: 'aaa', count: 3 }
console.log(kthMostRepeated(words, 3));      // { word: 'ccc', count: 1 }
console.log(secondMostRepeated(['only']));   // null
console.log(secondMostRepeated(wordsOf('the cat the hat the cat sat'))); // { word: 'cat', count: 2 }

module.exports = { secondMostRepeated, secondMostRepeatedSort, mostRepeated, kthMostRepeated, wordCounts, wordsOf };
