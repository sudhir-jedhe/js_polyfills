/**
 * Perfect squares.
 *
 * Testing, generating, and the "fewest perfect squares summing to n"
 * problem (LeetCode 279).
 */

/** Is n a perfect square? Rounding avoids the sqrt precision trap. */
function isPerfectSquare(n) {
  if (!Number.isInteger(n) || n < 0) return false;

  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

/** Binary search version — no floating point at all (LeetCode 367). */
function isPerfectSquareBinary(n) {
  if (n < 0) return false;
  if (n < 2) return true;

  let lo = 1;
  let hi = Math.floor(n / 2);

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const square = mid * mid;

    if (square === n) return true;
    if (square < n) lo = mid + 1;
    else hi = mid - 1;
  }

  return false;
}

/**
 * Newton's method — converges quadratically and is the standard way to get
 * an exact integer square root.
 */
function integerSqrt(n) {
  if (n < 2) return n;

  let x = n;
  let y = Math.floor((x + 1) / 2);

  while (y < x) {
    x = y;
    y = Math.floor((x + Math.floor(n / x)) / 2);
  }

  return x;
}

/** All perfect squares up to n. */
const perfectSquaresUpTo = (n) =>
  Array.from({ length: Math.floor(Math.sqrt(n)) + 1 }, (_, i) => i * i).filter((s) => s <= n);

/**
 * Fewest perfect squares summing to n (LeetCode 279).
 * Lagrange's four-square theorem bounds the answer at 4.
 * Time O(n * sqrt(n))
 */
function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let root = 1; root * root <= i; root++) {
      dp[i] = Math.min(dp[i], dp[i - root * root] + 1);
    }
  }

  return dp[n];
}

/** Which squares those are. */
function squaresSummingTo(n) {
  const dp = new Array(n + 1).fill(Infinity);
  const choice = new Array(n + 1).fill(0);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let root = 1; root * root <= i; root++) {
      if (dp[i - root * root] + 1 < dp[i]) {
        dp[i] = dp[i - root * root] + 1;
        choice[i] = root * root;
      }
    }
  }

  const out = [];
  for (let i = n; i > 0; i -= choice[i]) out.push(choice[i]);
  return out;
}

/** Perfect cubes, the same idea one dimension up. */
const isPerfectCube = (n) => {
  const root = Math.round(Math.cbrt(Math.abs(n)));
  return root ** 3 === Math.abs(n);
};

// ---- Examples ----
console.log(isPerfectSquare(144));        // true
console.log(isPerfectSquare(145));        // false
console.log(isPerfectSquareBinary(16));   // true
console.log(integerSqrt(50));             // 7
console.log(perfectSquaresUpTo(50));      // [0,1,4,9,16,25,36,49]
console.log(numSquares(12));              // 3  (4 + 4 + 4)
console.log(squaresSummingTo(12));        // [4, 4, 4]
console.log(numSquares(13));              // 2  (4 + 9)
console.log(isPerfectCube(27));           // true

module.exports = { isPerfectSquare, isPerfectSquareBinary, integerSqrt, perfectSquaresUpTo, numSquares, squaresSummingTo, isPerfectCube };
