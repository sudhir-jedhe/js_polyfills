/**
 * Generate all permutations of an array or string.
 *
 * n! results, so this is only practical for small inputs.
 * Backtracking with a "used" marker is the standard approach; Heap's
 * algorithm does it with the fewest swaps.
 */

/**
 * Backtracking. Duplicate values produce duplicate permutations unless
 * they are skipped (see permutationsUnique).
 * Time  O(n! * n)
 */
function permutations(input) {
  const items = typeof input === 'string' ? [...input] : input;
  const out = [];
  const current = [];
  const used = new Array(items.length).fill(false);

  function backtrack() {
    if (current.length === items.length) {
      out.push(typeof input === 'string' ? current.join('') : [...current]);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(items[i]);

      backtrack();

      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return out;
}

/**
 * Unique permutations when the input has repeated values (LeetCode 47).
 * Sort first, then skip a value whose identical predecessor is unused.
 */
function permutationsUnique(input) {
  const items = (typeof input === 'string' ? [...input] : [...input]).sort();
  const out = [];
  const current = [];
  const used = new Array(items.length).fill(false);

  function backtrack() {
    if (current.length === items.length) {
      out.push(typeof input === 'string' ? current.join('') : [...current]);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      if (i > 0 && items[i] === items[i - 1] && !used[i - 1]) continue; // dedupe

      used[i] = true;
      current.push(items[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return out;
}

/** Heap's algorithm — minimal swaps, iterative. */
function permutationsHeap(input) {
  const items = typeof input === 'string' ? [...input] : [...input];
  const out = [];
  const counters = new Array(items.length).fill(0);

  out.push(typeof input === 'string' ? items.join('') : [...items]);

  let i = 0;
  while (i < items.length) {
    if (counters[i] < i) {
      const j = i % 2 === 0 ? 0 : counters[i];
      [items[i], items[j]] = [items[j], items[i]];

      out.push(typeof input === 'string' ? items.join('') : [...items]);
      counters[i]++;
      i = 0;
    } else {
      counters[i] = 0;
      i++;
    }
  }

  return out;
}

/** Lazy generator — useful when you only need the first few. */
function* permutationsLazy(items, current = [], used = new Set()) {
  if (current.length === items.length) {
    yield [...current];
    return;
  }

  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    used.add(i);
    current.push(items[i]);
    yield* permutationsLazy(items, current, used);
    current.pop();
    used.delete(i);
  }
}

// ---- Examples ----
console.log(permutations([1, 2, 3]));   // 6 arrays
console.log(permutations('abc'));       // ['abc','acb','bac','bca','cab','cba']
console.log(permutationsUnique([1, 1, 2])); // [[1,1,2],[1,2,1],[2,1,1]]
console.log(permutationsHeap('ab'));    // ['ab', 'ba']

const gen = permutationsLazy([1, 2, 3]);
console.log(gen.next().value);          // [1, 2, 3]

module.exports = { permutations, permutationsUnique, permutationsHeap, permutationsLazy };
