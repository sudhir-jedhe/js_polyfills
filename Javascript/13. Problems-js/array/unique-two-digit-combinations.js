/**
 * Print all the unique 2-digit combinations of given numbers.
 *
 * Two readings: ordered PAIRS (12 and 21 both count) and unordered
 * COMBINATIONS (only one of them). Both are here, with and without repeats.
 */

/** Ordered pairs of distinct positions — permutations of size 2. */
function twoDigitPermutations(digits) {
  const out = new Set();

  for (let i = 0; i < digits.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      if (i === j) continue;
      out.add(`${digits[i]}${digits[j]}`);
    }
  }

  return [...out];
}

/** Unordered pairs of distinct positions — combinations of size 2. */
function twoDigitCombinations(digits) {
  const out = new Set();

  for (let i = 0; i < digits.length; i++) {
    for (let j = i + 1; j < digits.length; j++) {
      const [a, b] = [digits[i], digits[j]].sort();
      out.add(`${a}${b}`);
    }
  }

  return [...out];
}

/** Ordered pairs WITH repetition allowed (11, 22, ...). */
function twoDigitWithRepeats(digits) {
  const unique = [...new Set(digits)];
  const out = [];

  for (const a of unique) {
    for (const b of unique) out.push(`${a}${b}`);
  }

  return out;
}

/** Only pairs that form a valid 2-digit NUMBER (no leading zero). */
const twoDigitNumbers = (digits) =>
  twoDigitPermutations(digits)
    .filter((s) => s[0] !== '0')
    .map(Number)
    .sort((a, b) => a - b);

/** k-digit combinations, the general version. */
function kDigitCombinations(digits, k) {
  const out = new Set();
  const current = [];

  function build(start) {
    if (current.length === k) {
      out.add(current.join(''));
      return;
    }
    for (let i = start; i < digits.length; i++) {
      current.push(digits[i]);
      build(i + 1);
      current.pop();
    }
  }

  build(0);
  return [...out];
}

/** All permutations of size k. */
function kDigitPermutations(digits, k) {
  const out = new Set();
  const used = new Array(digits.length).fill(false);
  const current = [];

  function build() {
    if (current.length === k) {
      out.add(current.join(''));
      return;
    }
    for (let i = 0; i < digits.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(digits[i]);
      build();
      current.pop();
      used[i] = false;
    }
  }

  build();
  return [...out];
}

// ---- Examples ----
console.log(twoDigitPermutations([1, 2, 3]));  // ['12','13','21','23','31','32']
console.log(twoDigitCombinations([1, 2, 3]));  // ['12','13','23']
console.log(twoDigitWithRepeats([1, 2]));      // ['11','12','21','22']
console.log(twoDigitNumbers([0, 1, 2]));       // [10, 12, 20, 21]
console.log(kDigitCombinations([1, 2, 3, 4], 3));
console.log(kDigitPermutations([1, 2, 3], 2).length); // 6

module.exports = { twoDigitPermutations, twoDigitCombinations, twoDigitWithRepeats, twoDigitNumbers, kDigitCombinations, kDigitPermutations };
