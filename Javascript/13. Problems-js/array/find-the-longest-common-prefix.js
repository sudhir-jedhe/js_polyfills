/**
 * Longest Common Prefix (LeetCode 14).
 *
 * The answer can never be longer than the shortest string, and comparing
 * only the lexicographically smallest and largest strings is enough —
 * anything they share, every string in between shares too.
 */

/** Vertical scan: compare character i across all strings. */
function longestCommonPrefix(strs) {
  if (!strs.length) return '';

  for (let i = 0; i < strs[0].length; i++) {
    const ch = strs[0][i];

    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) {
        return strs[0].slice(0, i);
      }
    }
  }

  return strs[0];
}

/**
 * Sort and compare only the first and last strings — O(n log n) on the
 * sort but only one character-by-character comparison.
 */
function longestCommonPrefixSorted(strs) {
  if (!strs.length) return '';

  const sorted = [...strs].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  let i = 0;
  while (i < first.length && first[i] === last[i]) i++;

  return first.slice(0, i);
}

/** Horizontal scan: shrink a running prefix across the list. */
function longestCommonPrefixReduce(strs) {
  if (!strs.length) return '';

  return strs.reduce((prefix, str) => {
    while (!str.startsWith(prefix)) prefix = prefix.slice(0, -1);
    return prefix;
  });
}

/** Longest common SUFFIX — reverse everything and reuse. */
const longestCommonSuffix = (strs) =>
  [...longestCommonPrefix(strs.map((s) => [...s].reverse().join('')))].reverse().join('');

/** Trie-based, when you need repeated prefix queries over the same set. */
function buildPrefixTrie(strs) {
  const root = { children: new Map(), count: 0 };

  for (const str of strs) {
    let node = root;
    for (const ch of str) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), count: 0 });
      node = node.children.get(ch);
      node.count++;
    }
  }

  return root;
}

// ---- Examples ----
console.log(longestCommonPrefix(['flower', 'flow', 'flight'])); // 'fl'
console.log(longestCommonPrefix(['dog', 'racecar', 'car']));    // ''
console.log(longestCommonPrefix(['same', 'same']));             // 'same'
console.log(longestCommonPrefixSorted(['interspecies', 'interstellar', 'interstate'])); // 'inters'
console.log(longestCommonPrefixReduce(['abc', 'abd']));         // 'ab'
console.log(longestCommonSuffix(['running', 'jumping']));       // 'ing'

module.exports = { longestCommonPrefix, longestCommonPrefixSorted, longestCommonPrefixReduce, longestCommonSuffix, buildPrefixTrie };
