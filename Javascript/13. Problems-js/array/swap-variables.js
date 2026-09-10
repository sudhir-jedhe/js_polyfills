/**
 * Swap two variables.
 *
 * Destructuring is the modern answer. The arithmetic and XOR tricks are
 * interview classics with real caveats.
 */

/** Destructuring — clear, works for any type. */
function swapDestructure(a, b) {
  [a, b] = [b, a];
  return [a, b];
}

/** With a temporary — the classic, and the fastest. */
function swapTemp(a, b) {
  const temp = a;
  a = b;
  b = temp;
  return [a, b];
}

/**
 * Arithmetic — no temporary, but risks overflow and loses precision on
 * floats.
 */
function swapArithmetic(a, b) {
  a = a + b;
  b = a - b;
  a = a - b;
  return [a, b];
}

/**
 * XOR — no temporary, integers only, and it BREAKS when both operands are
 * the same variable (it zeroes it).
 */
function swapXor(a, b) {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
}

/** Swap two array elements in place. */
function swapInArray(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return arr;
}

/** Swap two object properties. */
function swapProperties(obj, keyA, keyB) {
  [obj[keyA], obj[keyB]] = [obj[keyB], obj[keyA]];
  return obj;
}

/** Rotate three variables in one statement. */
const rotateThree = (a, b, c) => [c, a, b];

/** The XOR trap, demonstrated. */
function xorSelfSwapTrap() {
  const arr = [5, 3];
  const i = 0;
  const j = 0; // same index

  arr[i] ^= arr[j];
  arr[j] ^= arr[i];
  arr[i] ^= arr[j];

  return { result: arr[0], note: 'XOR-swapping an element with itself zeroes it' };
}

// ---- Examples ----
console.log(swapDestructure(1, 2));     // [2, 1]
console.log(swapTemp('a', 'b'));        // ['b', 'a']
console.log(swapArithmetic(3, 7));      // [7, 3]
console.log(swapXor(3, 7));             // [7, 3]
console.log(swapInArray([1, 2, 3], 0, 2)); // [3, 2, 1]
console.log(swapProperties({ x: 1, y: 2 }, 'x', 'y')); // { x: 2, y: 1 }
console.log(rotateThree(1, 2, 3));      // [3, 1, 2]
console.log(xorSelfSwapTrap());         // result: 0

module.exports = { swapDestructure, swapTemp, swapArithmetic, swapXor, swapInArray, swapProperties, rotateThree, xorSelfSwapTrap };
