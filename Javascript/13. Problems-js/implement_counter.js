/**
 * Implement count().
 *
 * `count()` returns how many times it has been called.
 * `count.reset()` sets the counter back to 0.
 */

/** Closure-based counter, exposed as a callable with a `reset` method. */
const count = (() => {
  let n = 0;

  const fn = () => ++n;
  fn.reset = () => {
    n = 0;
  };
  fn.current = () => n;

  return fn;
})();

/** Factory, when you need several independent counters. */
function createCounter(start = 0) {
  let n = start;

  const fn = () => ++n;
  fn.reset = () => {
    n = start;
  };
  fn.current = () => n;

  return fn;
}

/** Class version, same behaviour. */
class Counter {
  #n = 0;
  next() {
    return ++this.#n;
  }
  reset() {
    this.#n = 0;
  }
  get value() {
    return this.#n;
  }
}

// ---- Examples ----
console.log(count()); // 1
console.log(count()); // 2
console.log(count()); // 3
count.reset();
console.log(count()); // 1

const c = createCounter();
console.log(c(), c()); // 1 2
console.log(count());  // 2  <- independent of `c`

const k = new Counter();
k.next();
k.next();
console.log(k.value); // 2

module.exports = { count, createCounter, Counter };
