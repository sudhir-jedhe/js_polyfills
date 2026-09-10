/**
 * Array rotation.
 *
 * Left and right rotation, by slicing, by the reversal trick (O(1) space)
 * and by juggling with GCD cycles.
 */

/** Normalise k into [0, n). Handles k > n and negative k. */
const normalise = (k, n) => (n === 0 ? 0 : ((k % n) + n) % n);

/** Rotate left by k — the first k elements move to the end. */
function rotateLeft(arr, k) {
  const n = arr.length;
  const shift = normalise(k, n);
  return shift === 0 ? [...arr] : [...arr.slice(shift), ...arr.slice(0, shift)];
}

/** Rotate right by k — the last k elements move to the front. */
function rotateRight(arr, k) {
  const n = arr.length;
  const shift = normalise(k, n);
  return shift === 0 ? [...arr] : [...arr.slice(n - shift), ...arr.slice(0, n - shift)];
}

/**
 * Reversal algorithm — rotate in place with O(1) extra space.
 * Reverse the first k, reverse the rest, reverse the whole thing.
 */
function rotateLeftInPlace(arr, k) {
  const n = arr.length;
  const shift = normalise(k, n);
  if (shift === 0) return arr;

  const reverse = (lo, hi) => {
    while (lo < hi) {
      [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
      lo++;
      hi--;
    }
  };

  reverse(0, shift - 1);
  reverse(shift, n - 1);
  reverse(0, n - 1);

  return arr;
}

/**
 * Juggling algorithm: move elements along gcd(n, k) independent cycles.
 * Each element is moved exactly once.
 */
function rotateLeftJuggling(arr, k) {
  const n = arr.length;
  const shift = normalise(k, n);
  if (shift === 0) return arr;

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const cycles = gcd(n, shift);

  for (let start = 0; start < cycles; start++) {
    const temp = arr[start];
    let current = start;

    for (;;) {
      const next = (current + shift) % n;
      if (next === start) break;
      arr[current] = arr[next];
      current = next;
    }

    arr[current] = temp;
  }

  return arr;
}

/** Rotate a 2-D matrix 90 degrees clockwise. */
const rotateMatrix90 = (matrix) =>
  matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());

// ---- Examples ----
console.log(rotateLeft([1, 2, 3, 4, 5], 2));        // [3, 4, 5, 1, 2]
console.log(rotateRight([1, 2, 3, 4, 5], 2));       // [4, 5, 1, 2, 3]
console.log(rotateLeft([1, 2, 3], 7));              // [2, 3, 1]
console.log(rotateLeftInPlace([1, 2, 3, 4, 5], 2)); // [3, 4, 5, 1, 2]
console.log(rotateLeftJuggling([1, 2, 3, 4, 5, 6], 2)); // [3,4,5,6,1,2]
console.log(rotateMatrix90([[1, 2], [3, 4]]));      // [[3,1],[4,2]]

module.exports = { rotateLeft, rotateRight, rotateLeftInPlace, rotateLeftJuggling, rotateMatrix90 };
