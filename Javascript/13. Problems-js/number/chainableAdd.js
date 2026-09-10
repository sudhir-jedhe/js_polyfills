/**
 * Chainable add.
 *
 * add(1).add(2).add(3).value() === 6
 * and the object also coerces to its running total.
 */

/**
 * @param {number} [initial=0]
 */
function add(initial = 0) {
  let total = initial;

  const api = {
    add(n) {
      total += n;
      return api; // chain
    },
    subtract(n) {
      total -= n;
      return api;
    },
    multiply(n) {
      total *= n;
      return api;
    },
    value() {
      return total;
    },
    valueOf() {
      return total;
    },
    toString() {
      return String(total);
    },
  };

  return api;
}

/** Class flavour of the same idea. */
class Chain {
  constructor(value = 0) {
    this.total = value;
  }
  add(n) {
    this.total += n;
    return this;
  }
  multiply(n) {
    this.total *= n;
    return this;
  }
  valueOf() {
    return this.total;
  }
}

// ---- Examples ----
console.log(add(1).add(2).add(3).value());     // 6
console.log(+add(10).subtract(4).multiply(2)); // 12
console.log(`${add(5).add(5)}`);               // '10'
console.log(+new Chain(2).add(3).multiply(4)); // 20

module.exports = { add, Chain };
