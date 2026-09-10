/**
 * Check whether an integer is positive, negative or zero.
 *
 * Note that JavaScript has both +0 and -0; Math.sign preserves that
 * distinction, which is usually not what you want in a UI.
 */

/**
 * @param {number} n
 * @returns {'positive' | 'negative' | 'zero'}
 */
function classify(n) {
  if (!Number.isFinite(n)) return 'zero'; // or throw, depending on your contract
  if (n > 0) return 'positive';
  if (n < 0) return 'negative';
  return 'zero'; // covers both +0 and -0
}

/** Numeric sign: 1, -1 or 0. */
const signOf = (n) => (n > 0 ? 1 : n < 0 ? -1 : 0);

/** Built-in — careful, Math.sign(-0) is -0, not 0. */
const signBuiltIn = (n) => Math.sign(n);

// ---- Examples ----
console.log(classify(42));   // 'positive'
console.log(classify(-7));   // 'negative'
console.log(classify(0));    // 'zero'
console.log(classify(-0));   // 'zero'
console.log(signOf(-3));     // -1
console.log(Object.is(signBuiltIn(-0), -0)); // true  <- the gotcha

module.exports = { classify, signOf, signBuiltIn };
