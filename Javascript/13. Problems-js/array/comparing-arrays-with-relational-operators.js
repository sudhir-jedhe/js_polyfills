/**
 * Comparing arrays with > and < in JavaScript.
 *
 * Relational operators coerce both sides to PRIMITIVES first, which for an
 * array means join(',') — so [2] > [10] compares the strings '2' and '10'
 * and is true. Equality operators do NOT coerce arrays to strings against
 * each other, so [1] === [1] is false: different references.
 */

/** Show what the coercion actually produces. */
const toPrimitive = (arr) => String(arr); // same as arr.join(',')

/** Why [2] > [10] is true. */
function explainComparison(a, b) {
  return {
    a: toPrimitive(a),
    b: toPrimitive(b),
    'a > b': a > b,
    'a < b': a < b,
    'a == b': a == b,
    'a === b': a === b,
    note: 'relational operators compare the STRING forms',
  };
}

/** Compare arrays element by element, the way you probably meant. */
function compareArrays(a, b) {
  const n = Math.min(a.length, b.length);

  for (let i = 0; i < n; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }

  return a.length - b.length; // shorter array sorts first when prefixes match
}

/** Structural equality — what people usually want from `===`. */
const arraysEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => Object.is(v, b[i]));

/** Deep equality for nested arrays. */
function deepArraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return Object.is(a, b);
  return a.length === b.length && a.every((v, i) => deepArraysEqual(v, b[i]));
}

/** Compare numerically by sum, length or any derived measure. */
const compareBy = (a, b, measure) => measure(a) - measure(b);

// ---- Examples ----
console.log([2] > [10]);          // true   <- '2' > '10' as strings
console.log([2, 3] > [2, 10]);    // true   <- '2,3' > '2,10'
console.log([1] == [1]);          // false  <- different references
console.log([] == false);         // true   <- '' -> 0 -> false

console.log(explainComparison([2], [10]));
console.log(compareArrays([2], [10]));      // -1  (numeric, as intended)
console.log(compareArrays([1, 2], [1, 2, 3]));// -1
console.log(arraysEqual([1, 2], [1, 2]));   // true
console.log(deepArraysEqual([1, [2]], [1, [2]])); // true
console.log(compareBy([1, 2], [5], (arr) => arr.reduce((x, y) => x + y, 0))); // -2

module.exports = { compareArrays, arraysEqual, deepArraysEqual, compareBy, explainComparison, toPrimitive };
