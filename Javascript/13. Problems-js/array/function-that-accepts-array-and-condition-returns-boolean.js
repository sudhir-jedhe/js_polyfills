/**
 * Implement a function that accepts an array and a condition, and returns
 * boolean values.
 *
 * This is the family around `every` / `some` / `filter`: apply a predicate
 * and report the outcome in whatever shape the caller needs.
 */

/** A boolean per element. */
const mapCondition = (arr, condition) => arr.map((item, i) => Boolean(condition(item, i, arr)));

/** Does every element satisfy the condition? */
const all = (arr, condition) => arr.every((item, i) => Boolean(condition(item, i, arr)));

/** Does at least one? */
const any = (arr, condition) => arr.some((item, i) => Boolean(condition(item, i, arr)));

/** Does none? */
const none = (arr, condition) => !any(arr, condition);

/** How many satisfy it? */
const countWhere = (arr, condition) =>
  arr.reduce((n, item, i) => n + (condition(item, i, arr) ? 1 : 0), 0);

/** Split into passing and failing groups. */
const partition = (arr, condition) =>
  arr.reduce(
    (acc, item, i) => {
      acc[condition(item, i, arr) ? 0 : 1].push(item);
      return acc;
    },
    [[], []]
  );

/** A summary object, which is often what the caller actually wants. */
const evaluate = (arr, condition) => {
  const results = mapCondition(arr, condition);
  const passed = results.filter(Boolean).length;

  return {
    results,
    all: passed === arr.length,
    any: passed > 0,
    none: passed === 0,
    passed,
    failed: arr.length - passed,
  };
};

/** Combine several conditions. */
const andConditions = (...conditions) => (item, i, arr) => conditions.every((c) => c(item, i, arr));
const orConditions = (...conditions) => (item, i, arr) => conditions.some((c) => c(item, i, arr));
const notCondition = (condition) => (item, i, arr) => !condition(item, i, arr);

// ---- Examples ----
const nums = [1, 2, 3, 4, 5];
const isEven = (n) => n % 2 === 0;

console.log(mapCondition(nums, isEven));   // [false, true, false, true, false]
console.log(all(nums, (n) => n > 0));      // true
console.log(any(nums, isEven));            // true
console.log(none(nums, (n) => n > 10));    // true
console.log(countWhere(nums, isEven));     // 2
console.log(partition(nums, isEven));      // [[2,4], [1,3,5]]
console.log(evaluate(nums, isEven));
console.log(all(nums, andConditions((n) => n > 0, (n) => n < 10))); // true
console.log(any(nums, notCondition(isEven)));                       // true

module.exports = { mapCondition, all, any, none, countWhere, partition, evaluate, andConditions, orConditions, notCondition };
