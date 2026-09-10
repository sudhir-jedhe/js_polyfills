/**
 * Return the first argument that is neither null nor undefined.
 *
 * This is what `??` does for two operands; these helpers generalise it to
 * any number of candidates, including lazily-evaluated ones.
 */

/** First non-nullish argument, or undefined. */
const coalesce = (...args) => args.find((value) => value != null);

/** Using ?? directly — short-circuits, so later expressions are not built. */
const coalesceOperator = (a, b, c) => a ?? b ?? c;

/**
 * Lazy version: each candidate is a function, so expensive fallbacks only
 * run when they are actually needed.
 */
function coalesceLazy(...thunks) {
  for (const thunk of thunks) {
    const value = typeof thunk === 'function' ? thunk() : thunk;
    if (value != null) return value;
  }
  return undefined;
}

/** First TRUTHY value — the || behaviour, which also skips 0 and ''. */
const firstTruthy = (...args) => args.find(Boolean);

/** First value satisfying a predicate. */
const firstWhere = (values, predicate) => values.find(predicate);

/**
 * The difference that bites: `||` treats 0, '' and false as missing;
 * `??` only treats null and undefined that way.
 */
const compareOperators = (value, fallback) => ({
  'with ||': value || fallback,
  'with ??': value ?? fallback,
});

// ---- Examples ----
console.log(coalesce(undefined, null, 0, 'x'));   // 0  (0 is not nullish)
console.log(coalesce(null, undefined));           // undefined
console.log(coalesceOperator(null, undefined, 'fallback')); // 'fallback'
console.log(coalesceLazy(() => null, () => 'computed'));    // 'computed'
console.log(firstTruthy(0, '', 'first'));         // 'first'
console.log(firstWhere([1, 5, 9], (n) => n > 4)); // 5
console.log(compareOperators(0, 'default'));      // { '||': 'default', '??': 0 }

module.exports = { coalesce, coalesceOperator, coalesceLazy, firstTruthy, firstWhere, compareOperators };
