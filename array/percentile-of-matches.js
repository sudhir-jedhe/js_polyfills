Calculates the percentage of numbers in the given array that are less or equal to the given value.

Use Array.prototype.reduce() to calculate how many numbers are below the value and how many are the same value and apply the percentile formula.
const percentile = (arr, val) =>
  (100 *
    arr.reduce(
      (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
      0
    )) /
  arr.length;

percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6); // 55