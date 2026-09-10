/**
 * Convert an array of integers to an array of strings.
 *
 * The classic gotcha: `[1, 2, 3].map(String)` is safe, but
 * `['1','2','3'].map(parseInt)` is NOT — parseInt receives the index as its
 * radix argument. Both directions are shown here.
 */

/** Numbers -> strings. */
const toStringArray = (nums) => nums.map(String);

/** Same, template-literal flavour. */
const toStringArrayTemplate = (nums) => nums.map((n) => `${n}`);

/** Strings -> numbers, done correctly. */
const toNumberArray = (strs) => strs.map(Number);

/** The bug, kept as a reminder. */
const brokenToNumberArray = (strs) => strs.map(parseInt);

// ---- Examples ----
console.log(toStringArray([1, 2, 3]));        // ['1', '2', '3']
console.log(toStringArrayTemplate([-1, 0]));  // ['-1', '0']
console.log(toNumberArray(['1', '2', '3']));  // [1, 2, 3]
console.log(brokenToNumberArray(['1', '2', '3'])); // [1, NaN, NaN]  <- radix bug

module.exports = { toStringArray, toStringArrayTemplate, toNumberArray };
