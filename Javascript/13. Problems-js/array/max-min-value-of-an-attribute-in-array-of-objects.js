/**
 * Find the maximum and minimum value of an attribute in an array of objects.
 *
 * Reduce keeps it to one pass and, unlike Math.max(...arr.map(...)), it
 * does not blow the call stack on very large arrays.
 */

/** The maximum VALUE of an attribute. */
const maxValue = (arr, key) => arr.reduce((max, item) => Math.max(max, item[key]), -Infinity);

/** The minimum VALUE. */
const minValue = (arr, key) => arr.reduce((min, item) => Math.min(min, item[key]), Infinity);

/** The OBJECT with the maximum attribute (ties resolved to the first). */
const maxBy = (arr, key) =>
  arr.length ? arr.reduce((best, item) => (item[key] > best[key] ? item : best)) : null;

/** The object with the minimum attribute. */
const minBy = (arr, key) =>
  arr.length ? arr.reduce((best, item) => (item[key] < best[key] ? item : best)) : null;

/** Both extremes in one pass. */
function minMaxBy(arr, key) {
  if (!arr.length) return { min: null, max: null };

  let min = arr[0];
  let max = arr[0];

  for (const item of arr) {
    if (item[key] < min[key]) min = item;
    if (item[key] > max[key]) max = item;
  }

  return { min, max, minValue: min[key], maxValue: max[key] };
}

/** With a value function rather than a key — handles nested paths and dates. */
const maxByFn = (arr, valueFn) =>
  arr.length ? arr.reduce((best, item) => (valueFn(item) > valueFn(best) ? item : best)) : null;

/** Every object tied for the maximum. */
function allMaxBy(arr, key) {
  const max = maxValue(arr, key);
  return arr.filter((item) => item[key] === max);
}

/** Summary statistics for one attribute. */
function statsFor(arr, key) {
  const values = arr.map((item) => Number(item[key])).filter(Number.isFinite);
  if (!values.length) return null;

  const sum = values.reduce((a, b) => a + b, 0);
  const sorted = [...values].sort((a, b) => a - b);

  return {
    count: values.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    sum,
    mean: sum / values.length,
    median:
      values.length % 2 === 1
        ? sorted[(values.length - 1) / 2]
        : (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2,
  };
}

// ---- Examples ----
const products = [
  { name: 'a', price: 30, sold: '2024-01-01' },
  { name: 'b', price: 10, sold: '2025-06-01' },
  { name: 'c', price: 50, sold: '2023-03-01' },
];

console.log(maxValue(products, 'price'));   // 50
console.log(minValue(products, 'price'));   // 10
console.log(maxBy(products, 'price').name); // 'c'
console.log(minBy(products, 'price').name); // 'b'
console.log(minMaxBy(products, 'price'));
console.log(maxByFn(products, (p) => new Date(p.sold)).name); // 'b'
console.log(allMaxBy([{ n: 1 }, { n: 1 }], 'n').length);      // 2
console.log(statsFor(products, 'price'));

module.exports = { maxValue, minValue, maxBy, minBy, minMaxBy, maxByFn, allMaxBy, statsFor };
