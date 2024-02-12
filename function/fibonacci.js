// Approach 1 - Recursion
// Time: O(2^n)
// Space: O(n)
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

// Approach 2 - Memoized Recursion
// Time: O(n)
// Space: O(n)
function fib(n) {
  const cache = {};
  function memo(n) {
    if (n < 2) return n;
    cache[n] ??= memo(n - 1) + memo(n - 2);
    return cache[n];
  }
  return memo(n);
}

// Approach 3 - Tabulation
// Time: O(n)
// Space: O(n)
function fib(n) {
  const res = [0, 1, 1];
  for (let i = 3; i <= n; i++) {
    res.push(res[i - 1] + res[i - 2]);
  }
  return res[n];
}

// Approach 4 - Dynamic Tabulation
// Time: O(n)
// Space: O(1)
function fib(n) {
  if (n < 2) return n;
  const res = [1, 1];
  for (let i = 2; i < n; i++) {
    [res[0], res[1]] = [res[1], res[0] + res[1]];
  }
  return res[1];
}

// Approach 5 - Math (god tier)
// Time: O(1)
// Space: O(1)
function fib(n) {
  const A = (1 + Math.sqrt(5)) / 2;
  const B = (1 - Math.sqrt(5)) / 2;
  const fib = (Math.pow(A, n) - Math.pow(B, n)) / Math.sqrt(5);
  return Math.floor(fib);
}

/**************************************** */
/**
 * Rcursion with memo
 */
function fib(n, memo = {}) {
  if (n == 0 || n == 1) return n;

  if (memo[n]) {
    return memo[n];
  }
  memo[n] = fib(n - 2, memo) + fib(n - 1, memo);
  return memo[n];
}

/**
 * Rcursion without memo
 */
function fib(n, pre1 = 0, pre2 = 1) {
  if (n == 0) return 0;
  if (n == 1) return pre2;
  return fib(n - 1, pre2, pre1 + pre2);
}

/**
 * Iterative
 */
function fib(n) {
  if (n <= 1) return n;

  var pre1 = 0,
    pre2 = 1;

  for (var i = 2; i <= n; i++) {
    var cur = pre1 + pre2;
    pre1 = pre2;
    pre2 = cur;
  }
  return pre2;
}

/***************************************** */
/**
 * @param {number} n - non-negative integer
 * @return {number}
 */
function fib(n) {
  if (n <= 1) {
    return n;
  }
  var pre1 = 0,
    pre2 = 1;
  for (var i = 2; i <= n; i++) {
    var cur = pre1 + pre2;
    pre1 = pre2;
    pre2 = cur;
  }
  return pre2;
}

function fib(n, memo = new Map()) {
  if (n <= 1) {
    return n;
  }
  if (memo.has(n)) {
    return memo.get(n);
  }
  var res = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, res);
  return res;
}
