/**
 * Add floating point numbers accurately.
 *
 * 0.1 + 0.2 === 0.30000000000000004 because binary floats cannot represent
 * those decimals exactly. Three ways around it.
 */

/** Round to a fixed number of decimals — fine for display/money-ish work. */
function addFloatRound(a, b, decimals = 10) {
  return Number((a + b).toFixed(decimals));
}

/**
 * Scale to integers, add, scale back. Exact for inputs whose scaled value
 * stays inside Number.MAX_SAFE_INTEGER.
 */
function addFloat(a, b) {
  const decimalsOf = (n) => {
    const s = String(n);
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
  };

  const factor = 10 ** Math.max(decimalsOf(a), decimalsOf(b));
  return (Math.round(a * factor) + Math.round(b * factor)) / factor;
}

/** Sum a whole list without accumulating error. */
function sumFloats(nums) {
  return nums.reduce((acc, n) => addFloat(acc, n), 0);
}

// ---- Examples ----
console.log(0.1 + 0.2);            // 0.30000000000000004
console.log(addFloat(0.1, 0.2));   // 0.3
console.log(addFloat(1.005, 2.01));// 3.015
console.log(addFloatRound(0.1, 0.2)); // 0.3
console.log(sumFloats([0.1, 0.2, 0.3])); // 0.6

module.exports = { addFloat, addFloatRound, sumFloats };
