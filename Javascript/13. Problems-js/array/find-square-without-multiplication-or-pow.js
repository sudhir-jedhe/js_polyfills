/**
 * Find the square of a number without using * or Math.pow.
 *
 * Three routes: repeated addition, the odd-number identity
 * (n^2 = 1 + 3 + 5 + ... + (2n-1)), and bit shifting, which is the
 * O(log n) answer.
 */

/** Repeated addition — O(n). */
function squareByAddition(n) {
  const value = Math.abs(n);
  let result = 0;

  for (let i = 0; i < value; i++) result += value;
  return result;
}

/** Sum of the first n odd numbers — also O(n), but a nicer identity. */
function squareByOddSum(n) {
  const value = Math.abs(n);
  let result = 0;

  for (let i = 0; i < value; i++) result += 2 * i + 1;
  return result;
}

/**
 * Bit shifting: n^2 = (n/2)^2 * 4, adjusted for an odd n.
 * Time O(log n)
 */
function squareByShift(n) {
  const value = Math.abs(n);
  if (value === 0) return 0;

  const half = value >> 1;
  const halfSquared = squareByShift(half);

  // even: (2h)^2 = 4h^2 ; odd: (2h+1)^2 = 4h^2 + 4h + 1
  return value % 2 === 0
    ? halfSquared << 2
    : (halfSquared << 2) + (half << 2) + 1;
}

/** Cube without multiplication, using the same repeated-addition idea. */
const cubeByAddition = (n) => {
  const squared = squareByAddition(n);
  let result = 0;
  for (let i = 0; i < Math.abs(n); i++) result += squared;
  return Math.sign(n) < 0 ? -result : result;
};

/** Integer square root by binary search — the inverse operation. */
function integerSqrt(n) {
  if (n < 0) return NaN;

  let lo = 0;
  let hi = n;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const square = squareByShift(mid);

    if (square === n) return mid;
    if (square < n) lo = mid + 1;
    else hi = mid - 1;
  }

  return hi; // floor of the true square root
}

// ---- Examples ----
console.log(squareByAddition(7));   // 49
console.log(squareByOddSum(7));     // 49
console.log(squareByShift(7));      // 49
console.log(squareByShift(12));     // 144
console.log(squareByShift(-5));     // 25
console.log(cubeByAddition(3));     // 27
console.log(integerSqrt(50));       // 7

module.exports = { squareByAddition, squareByOddSum, squareByShift, cubeByAddition, integerSqrt };
