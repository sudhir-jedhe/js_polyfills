/**
 * Most frequent element, character or word.
 *
 * Same counting core applied to three common inputs, plus the streaming
 * version for when the data does not fit in memory.
 */

/** Generic frequency map. */
function frequencies(items) {
  const counts = new Map();
  for (const item of items) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

/** Most frequent array element, with its count. */
function mostFrequent(arr) {
  let best = null;
  let bestCount = 0;

  for (const [value, count] of frequencies(arr)) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }

  return bestCount ? { value: best, count: bestCount } : null;
}

/** Most frequent CHARACTER in a string. */
const mostFrequentChar = (str) => mostFrequent([...String(str)]);

/** Most frequent WORD in a text, case-insensitive. */
function mostFrequentWord(text, banned = []) {
  const skip = new Set(banned.map((w) => w.toLowerCase()));
  const words = (String(text).toLowerCase().match(/[a-z0-9']+/g) || []).filter(
    (w) => !skip.has(w)
  );
  return mostFrequent(words);
}

/** The n most frequent, descending. */
const topFrequent = (items, n) =>
  [...frequencies(items).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([value, count]) => ({ value, count }));

/** Least frequent. */
function leastFrequent(arr) {
  let best = null;
  let bestCount = Infinity;

  for (const [value, count] of frequencies(arr)) {
    if (count < bestCount) {
      best = value;
      bestCount = count;
    }
  }

  return bestCount === Infinity ? null : { value: best, count: bestCount };
}

/**
 * Streaming counter — feed items one at a time and query the current
 * leader in O(1).
 */
class FrequencyCounter {
  #counts = new Map();
  #best = null;
  #bestCount = 0;

  add(item) {
    const count = (this.#counts.get(item) || 0) + 1;
    this.#counts.set(item, count);

    if (count > this.#bestCount) {
      this.#best = item;
      this.#bestCount = count;
    }

    return this;
  }

  get mostFrequent() {
    return this.#bestCount ? { value: this.#best, count: this.#bestCount } : null;
  }

  countOf(item) {
    return this.#counts.get(item) || 0;
  }
}

// ---- Examples ----
console.log(mostFrequent([1, 3, 3, 7, 3]));      // { value: 3, count: 3 }
console.log(mostFrequentChar('mississippi'));    // { value: 'i' or 's', count: 4 }
console.log(mostFrequentWord('the cat the hat', ['the'])); // { value: 'cat', count: 1 }
console.log(topFrequent(['a', 'b', 'a', 'c', 'b', 'a'], 2)); // [{a,3},{b,2}]
console.log(leastFrequent([1, 1, 2, 3, 3]));     // { value: 2, count: 1 }

const counter = new FrequencyCounter();
['x', 'y', 'x'].forEach((i) => counter.add(i));
console.log(counter.mostFrequent, counter.countOf('y')); // { x, 2 } 1

module.exports = { mostFrequent, mostFrequentChar, mostFrequentWord, topFrequent, leastFrequent, FrequencyCounter, frequencies };
