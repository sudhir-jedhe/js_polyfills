/**
 * Calculator object.
 *
 * Create an object `calculator` with three methods:
 *   read(a, b) - stores the two values as properties `a` and `b`
 *   sum()      - returns a + b
 *   mul()      - returns a * b
 */

const calculator = {
  a: 0,
  b: 0,

  read(a, b) {
    this.a = Number(a);
    this.b = Number(b);
    return this; // chainable
  },

  sum() {
    return this.a + this.b;
  },

  mul() {
    return this.a * this.b;
  },
};

/** Factory version, so each calculator has its own state. */
function createCalculator() {
  return {
    a: 0,
    b: 0,
    read(a, b) {
      this.a = Number(a);
      this.b = Number(b);
      return this;
    },
    sum() {
      return this.a + this.b;
    },
    mul() {
      return this.a * this.b;
    },
  };
}

// ---- Examples ----
calculator.read(5, 10);
console.log(calculator.sum()); // 15
console.log(calculator.mul()); // 50

console.log(createCalculator().read(3, 4).sum()); // 7

module.exports = { calculator, createCalculator };
