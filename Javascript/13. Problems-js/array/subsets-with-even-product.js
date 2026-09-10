/**
 * Total number of subsets in which the product of the elements is EVEN.
 *
 * A product is odd only when every factor is odd. So:
 *   subsets with an odd product = 2^(number of odd elements)   (all-odd subsets)
 *   subsets with an even product = 2^n - 2^(odd count)
 *
 * The empty subset has an empty product of 1 (odd), which the formula
 * already handles.
 *
 * Time  O(n)
 */

/** Count of subsets whose product is even. */
function countEvenProductSubsets(arr) {
  const n = arr.length;
  const odd = arr.filter((v) => Math.abs(v) % 2 === 1).length;

  return 2 ** n - 2 ** odd;
}

/** Count of subsets whose product is odd — every element must be odd. */
const countOddProductSubsets = (arr) =>
  2 ** arr.filter((v) => Math.abs(v) % 2 === 1).length;

/** Exact for large n. */
function countEvenProductSubsetsBigInt(arr) {
  const n = BigInt(arr.length);
  const odd = BigInt(arr.filter((v) => Math.abs(v) % 2 === 1).length);
  return 2n ** n - 2n ** odd;
}

/** Brute force, to verify the formula. */
function countEvenProductSubsetsBrute(arr) {
  let count = 0;

  for (let mask = 0; mask < 1 << arr.length; mask++) {
    let product = 1;
    for (let i = 0; i < arr.length; i++) {
      if (mask & (1 << i)) product *= arr[i];
    }
    if (Math.abs(product) % 2 === 0) count++;
  }

  return count;
}

/** Subsets with an even SUM: half of all subsets, unless every value is even. */
function countEvenSumSubsets(arr) {
  const odd = arr.filter((v) => Math.abs(v) % 2 === 1).length;
  const n = arr.length;

  // Choose an even number of odd elements; the even ones are free.
  return odd === 0 ? 2 ** n : 2 ** (n - 1);
}

/** The even-product subsets themselves, for small inputs. */
function evenProductSubsets(arr) {
  const out = [];

  for (let mask = 1; mask < 1 << arr.length; mask++) {
    const subset = [];
    let product = 1;

    for (let i = 0; i < arr.length; i++) {
      if (mask & (1 << i)) {
        subset.push(arr[i]);
        product *= arr[i];
      }
    }

    if (Math.abs(product) % 2 === 0) out.push(subset);
  }

  return out;
}

// ---- Examples ----
console.log(countEvenProductSubsets([1, 2, 3]));       // 8 - 4 = 4
console.log(countEvenProductSubsetsBrute([1, 2, 3]));  // 4
console.log(countEvenProductSubsets([1, 3, 5]));       // 0
console.log(countOddProductSubsets([1, 2, 3]));        // 4
console.log(countEvenSumSubsets([1, 2, 3]));           // 4
console.log(evenProductSubsets([1, 2, 3]));            // [[2],[1,2],[2,3],[1,2,3]]
console.log(countEvenProductSubsetsBigInt(new Array(60).fill(2)).toString());

module.exports = { countEvenProductSubsets, countOddProductSubsets, countEvenProductSubsetsBigInt, countEvenProductSubsetsBrute, countEvenSumSubsets, evenProductSubsets };
