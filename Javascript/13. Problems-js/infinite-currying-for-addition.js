/**
 * Infinite currying for addition.
 *
 * add(1)(2)(3)(4)... returns a function that keeps accepting numbers,
 * and evaluates to the running total when coerced to a primitive.
 */

/**
 * Uses valueOf/toString so the chain collapses to a number in any
 * arithmetic or string context. `+add(1)(2)` or `` `${add(1)(2)}` ``.
 *
 * @param {number} a
 * @returns {function & { valueOf(): number }}
 */
function add(a) {
  const next = (b) => add(a + b);

  next.valueOf = () => a;
  next.toString = () => String(a);
  next[Symbol.toPrimitive] = () => a;

  return next;
}

/**
 * Explicit-terminator variant: call with no argument to get the total.
 * add2(1)(2)(3)() === 6
 */
function addUntilEmpty(a = 0) {
  return function next(b) {
    if (b === undefined) return a;
    return addUntilEmpty(a + b);
  };
}

/**
 * Fixed-arity currying: curry any function of known length.
 * curry((a,b,c) => a+b+c)(1)(2)(3) === 6
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...rest) => curried.apply(this, [...args, ...rest]);
  };
}

// ---- Examples ----
console.log(+add(1)(2)(3));        // 6
console.log(`${add(5)(10)}`);      // '15'
console.log(add(1)(2)(3) + 0);     // 6

console.log(addUntilEmpty(1)(2)(3)()); // 6

const sum3 = curry((a, b, c) => a + b + c);
console.log(sum3(1)(2)(3)); // 6
console.log(sum3(1, 2)(3)); // 6

module.exports = { add, addUntilEmpty, curry };
