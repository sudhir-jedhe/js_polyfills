/**
 * Generate all combinations / permutations of a string.
 *
 * "Combinations" (subsets, order-independent): 2^n of them.
 * "Permutations" (arrangements, order matters): n! of them.
 */

/**
 * Every subsequence, including '' and the whole string.
 * Time  O(2^n * n)
 */
function allCombinations(str) {
  const out = [];

  function build(index, current) {
    if (index === str.length) {
      out.push(current);
      return;
    }
    build(index + 1, current + str[index]); // take
    build(index + 1, current);              // skip
  }

  build(0, '');
  return out;
}

/** Same, via bitmasks — each bit says whether to keep that character. */
function allCombinationsBitmask(str) {
  const out = [];

  for (let mask = 0; mask < 1 << str.length; mask++) {
    let s = '';
    for (let i = 0; i < str.length; i++) {
      if (mask & (1 << i)) s += str[i];
    }
    out.push(s);
  }

  return out;
}

/**
 * All permutations. Duplicate characters produce duplicate results,
 * so a Set is used to keep them unique.
 * Time  O(n! * n)
 */
function allPermutations(str) {
  if (str.length <= 1) return [str];

  const out = new Set();

  for (let i = 0; i < str.length; i++) {
    const rest = str.slice(0, i) + str.slice(i + 1);
    for (const perm of allPermutations(rest)) {
      out.add(str[i] + perm);
    }
  }

  return [...out];
}

/** Combinations of a fixed size k (n choose k). */
function combinationsOfSize(str, k) {
  const out = [];

  function build(start, current) {
    if (current.length === k) {
      out.push(current);
      return;
    }
    for (let i = start; i < str.length; i++) {
      build(i + 1, current + str[i]);
    }
  }

  build(0, '');
  return out;
}

// ---- Examples ----
console.log(allCombinations('abc'));
// ['abc','ab','ac','a','bc','b','c','']

console.log(allCombinationsBitmask('ab')); // ['','a','b','ab']
console.log(allPermutations('abc'));       // 6 arrangements
console.log(allPermutations('aab'));       // ['aab','aba','baa'] — deduped
console.log(combinationsOfSize('abcd', 2));// ['ab','ac','ad','bc','bd','cd']

module.exports = { allCombinations, allCombinationsBitmask, allPermutations, combinationsOfSize };
