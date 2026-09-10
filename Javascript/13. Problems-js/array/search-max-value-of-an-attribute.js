/**
 * Search for the maximum value of an attribute in an array of objects.
 *
 * reduce is the safe general answer; Math.max(...arr.map(...)) is shorter
 * but blows the call stack past roughly 100k elements.
 */

/** The maximum VALUE of the attribute. */
const maxAttribute = (arr, key) =>
  arr.reduce((max, item) => Math.max(max, Number(item[key])), -Infinity);

/** The OBJECT holding it. */
const maxByAttribute = (arr, key) =>
  arr.length ? arr.reduce((best, item) => (item[key] > best[key] ? item : best)) : null;

/** Spread version — concise, but limited by the argument-count cap. */
const maxAttributeSpread = (arr, key) => Math.max(...arr.map((item) => item[key]));

/** With a value function, so nested paths and dates work. */
const maxByFn = (arr, valueFn) =>
  arr.length ? arr.reduce((best, item) => (valueFn(item) > valueFn(best) ? item : best)) : null;

/** All objects tied for the maximum. */
function allMaxByAttribute(arr, key) {
  const max = maxAttribute(arr, key);
  return arr.filter((item) => Number(item[key]) === max);
}

/** The n objects with the largest attribute. */
const topNByAttribute = (arr, key, n) =>
  [...arr].sort((a, b) => b[key] - a[key]).slice(0, n);

/** Minimum and maximum in a single pass. */
function minMaxAttribute(arr, key) {
  if (!arr.length) return { min: null, max: null };

  let min = arr[0];
  let max = arr[0];

  for (const item of arr) {
    if (item[key] < min[key]) min = item;
    if (item[key] > max[key]) max = item;
  }

  return { min, max };
}

/** Group by one key, then find the max of another within each group. */
function maxPerGroup(arr, groupKey, valueKey) {
  const best = new Map();

  for (const item of arr) {
    const group = item[groupKey];
    const current = best.get(group);
    if (!current || item[valueKey] > current[valueKey]) best.set(group, item);
  }

  return Object.fromEntries(best);
}

// ---- Examples ----
const products = [
  { name: 'a', price: 30, region: 'east' },
  { name: 'b', price: 10, region: 'west' },
  { name: 'c', price: 50, region: 'east' },
];

console.log(maxAttribute(products, 'price'));      // 50
console.log(maxByAttribute(products, 'price').name);// 'c'
console.log(maxAttributeSpread(products, 'price')); // 50
console.log(maxByFn(products, (p) => p.name.charCodeAt(0)).name); // 'c'
console.log(allMaxByAttribute([{ v: 1 }, { v: 1 }], 'v').length);  // 2
console.log(topNByAttribute(products, 'price', 2).map((p) => p.name)); // ['c','a']
console.log(minMaxAttribute(products, 'price'));
console.log(maxPerGroup(products, 'region', 'price'));

module.exports = { maxAttribute, maxByAttribute, maxAttributeSpread, maxByFn, allMaxByAttribute, topNByAttribute, minMaxAttribute, maxPerGroup };
