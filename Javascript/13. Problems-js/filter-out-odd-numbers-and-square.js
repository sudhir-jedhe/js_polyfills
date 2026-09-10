/**
 * Filter out odd numbers and square the rest.
 *
 * Keep only the even numbers, then square each of them.
 */

/**
 * @param {number[]} nums
 * @returns {number[]}
 */
function squareEvens(nums) {
  return nums.filter((n) => n % 2 === 0).map((n) => n * n);
}

/** Single pass with reduce — one traversal instead of two. */
function squareEvensReduce(nums) {
  return nums.reduce((acc, n) => {
    if (n % 2 === 0) acc.push(n * n);
    return acc;
  }, []);
}

/** Generator variant, lazy for large inputs. */
function* squareEvensLazy(nums) {
  for (const n of nums) {
    if (n % 2 === 0) yield n * n;
  }
}

// ---- Examples ----
console.log(squareEvens([1, 2, 3, 4, 5, 6]));       // [4, 16, 36]
console.log(squareEvensReduce([1, 2, 3, 4, 5, 6])); // [4, 16, 36]
console.log([...squareEvensLazy([-2, 7, 8])]);      // [4, 64]

module.exports = { squareEvens, squareEvensReduce, squareEvensLazy };
