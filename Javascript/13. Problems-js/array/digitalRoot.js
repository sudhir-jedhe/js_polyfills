/**
 * Digital root.
 *
 * Repeatedly sum a number's digits until a single digit remains.
 * 493193 -> 4+9+3+1+9+3 = 29 -> 2+9 = 11 -> 1+1 = 2
 *
 * The closed form (digital roots are the number mod 9) makes it O(1).
 */

/** O(1) closed form: 1 + (n - 1) % 9, with 0 mapping to 0. */
const digitalRoot = (n) => {
  const value = Math.abs(Math.trunc(n));
  return value === 0 ? 0 : 1 + ((value - 1) % 9);
};

/** Iterative version — what the problem literally describes. */
function digitalRootIterative(n) {
  let value = Math.abs(Math.trunc(n));

  while (value > 9) {
    let sum = 0;
    while (value > 0) {
      sum += value % 10;
      value = Math.floor(value / 10);
    }
    value = sum;
  }

  return value;
}

/** Recursive version. */
const digitalRootRecursive = (n) => {
  const value = Math.abs(Math.trunc(n));
  if (value < 10) return value;
  return digitalRootRecursive(String(value).split('').reduce((a, d) => a + Number(d), 0));
};

/** How many summing rounds it took — the "additive persistence". */
function additivePersistence(n) {
  let value = Math.abs(Math.trunc(n));
  let steps = 0;

  while (value > 9) {
    value = String(value).split('').reduce((a, d) => a + Number(d), 0);
    steps++;
  }

  return steps;
}

/** Multiplicative digital root: multiply the digits instead of adding. */
function multiplicativeDigitalRoot(n) {
  let value = Math.abs(Math.trunc(n));

  while (value > 9) {
    value = String(value).split('').reduce((a, d) => a * Number(d), 1);
  }

  return value;
}

/** Works for arbitrarily large numbers given as strings. */
const digitalRootBig = (str) => {
  const sum = [...String(str).replace(/\D/g, '')].reduce((a, d) => a + Number(d), 0);
  return sum === 0 ? 0 : 1 + ((sum - 1) % 9);
};

// ---- Examples ----
console.log(digitalRoot(493193));            // 2
console.log(digitalRootIterative(493193));   // 2
console.log(digitalRootRecursive(942));      // 6
console.log(digitalRoot(0));                 // 0
console.log(additivePersistence(493193));    // 3
console.log(multiplicativeDigitalRoot(39));  // 4  (39 -> 27 -> 14 -> 4)
console.log(digitalRootBig('99999999999999999999')); // 9

module.exports = { digitalRoot, digitalRootIterative, digitalRootRecursive, additivePersistence, multiplicativeDigitalRoot, digitalRootBig };
