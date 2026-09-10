/**
 * Sort an array by date, ascending.
 *
 * Subtracting two Dates gives their millisecond difference, which is
 * exactly what a comparator wants. Invalid dates produce NaN, and NaN in a
 * comparator gives an unpredictable order — so they need handling.
 */

/** Ascending by a date field. */
const sortAscendingByDate = (arr, key = 'date') =>
  [...arr].sort((a, b) => new Date(a[key]) - new Date(b[key]));

/** Descending. */
const sortDescendingByDate = (arr, key = 'date') =>
  [...arr].sort((a, b) => new Date(b[key]) - new Date(a[key]));

/**
 * Ascending, with invalid and missing dates pushed to the end instead of
 * scattered by NaN comparisons.
 */
function sortByDateSafe(arr, key = 'date') {
  return [...arr].sort((a, b) => {
    const ta = new Date(a[key]).getTime();
    const tb = new Date(b[key]).getTime();

    const aBad = Number.isNaN(ta);
    const bBad = Number.isNaN(tb);

    if (aBad && bBad) return 0;
    if (aBad) return 1;
    if (bBad) return -1;

    return ta - tb;
  });
}

/**
 * Parse first, sort once — avoids constructing a Date on every comparison,
 * which matters on large arrays (a Schwartzian transform).
 */
function sortByDateFast(arr, key = 'date') {
  return arr
    .map((item) => ({ item, time: new Date(item[key]).getTime() }))
    .sort((a, b) => a.time - b.time)
    .map(({ item }) => item);
}

/** Sort plain Date objects or date strings. */
const sortDates = (dates) => [...dates].sort((a, b) => new Date(a) - new Date(b));

/** Group by day, then sort each group. */
function groupByDay(arr, key = 'date') {
  const groups = new Map();

  for (const item of sortAscendingByDate(arr, key)) {
    const day = new Date(item[key]).toISOString().slice(0, 10);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(item);
  }

  return Object.fromEntries(groups);
}

/** Filter to a date range, inclusive. */
const inDateRange = (arr, key, from, to) =>
  arr.filter((item) => {
    const t = new Date(item[key]).getTime();
    return t >= new Date(from).getTime() && t <= new Date(to).getTime();
  });

// ---- Examples ----
const posts = [
  { title: 'b', date: '2024-03-01' },
  { title: 'a', date: '2023-01-15' },
  { title: 'c', date: '2025-07-20' },
  { title: 'x', date: 'not a date' },
];

console.log(sortAscendingByDate(posts.slice(0, 3)).map((p) => p.title)); // ['a','b','c']
console.log(sortDescendingByDate(posts.slice(0, 3)).map((p) => p.title));// ['c','b','a']
console.log(sortByDateSafe(posts).map((p) => p.title));                  // ['a','b','c','x']
console.log(sortByDateFast(posts.slice(0, 3)).map((p) => p.title));
console.log(sortDates(['2025-01-01', '2020-06-15']));
console.log(Object.keys(groupByDay(posts.slice(0, 3))));
console.log(inDateRange(posts, 'date', '2024-01-01', '2026-01-01').map((p) => p.title));

module.exports = { sortAscendingByDate, sortDescendingByDate, sortByDateSafe, sortByDateFast, sortDates, groupByDay, inDateRange };
