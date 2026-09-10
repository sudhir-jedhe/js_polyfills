/**
 * Implement a function that accepts a callback and restricts its invocation
 * to at most N times.
 *
 * After the limit is reached the callback is never called again; the wrapper
 * keeps returning the value produced by the last real invocation
 * (this is how lodash's `before` behaves).
 */

/**
 * @template {(...args: any[]) => any} F
 * @param {number} n   maximum number of times `fn` may run
 * @param {F} fn
 * @returns {F} a wrapped function
 */
function limitCalls(n, fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }

  let remaining = Math.floor(n);
  let lastResult;

  return function (...args) {
    if (remaining > 0) {
      remaining--;
      lastResult = fn.apply(this, args);
    }
    return lastResult;
  };
}

/** `once` is just the N = 1 case. */
const once = (fn) => limitCalls(1, fn);

// ---- Examples ----
const greet = limitCalls(3, (name) => `hello ${name}`);
console.log(greet('a')); // hello a
console.log(greet('b')); // hello b
console.log(greet('c')); // hello c
console.log(greet('d')); // hello c  <- callback no longer runs

let sideEffects = 0;
const init = once(() => ++sideEffects);
init();
init();
init();
console.log(sideEffects); // 1

module.exports = { limitCalls, once };
