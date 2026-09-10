/**
 * Sort an array of objects by date.
 *
 * The reliable rule: convert to a timestamp and subtract. Comparing Date
 * objects with < / > works, but subtracting is clearer and handles string
 * dates uniformly.
 */

/** Ascending: oldest first. */
const sortByDateAsc = (items, key = 'date') =>
  [...items].sort((a, b) => new Date(a[key]) - new Date(b[key]));

/** Descending: newest first. */
const sortByDateDesc = (items, key = 'date') =>
  [...items].sort((a, b) => new Date(b[key]) - new Date(a[key]));

/**
 * General comparator factory — handles dates, numbers and strings, and
 * pushes missing values to the end.
 */
function byField(key, direction = 'asc') {
  const sign = direction === 'desc' ? -1 : 1;

  return (a, b) => {
    const av = a[key];
    const bv = b[key];

    if (av == null) return 1;
    if (bv == null) return -1;

    const ad = new Date(av).getTime();
    const bd = new Date(bv).getTime();

    if (!Number.isNaN(ad) && !Number.isNaN(bd)) return (ad - bd) * sign;

    return String(av).localeCompare(String(bv)) * sign;
  };
}

/** Sort by several fields in priority order. */
const sortBy = (items, keys, direction = 'asc') =>
  [...items].sort((a, b) => {
    for (const key of keys) {
      const result = byField(key, direction)(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });

// ---- Examples ----
const posts = [
  { title: 'b', date: '2024-03-01' },
  { title: 'a', date: '2023-01-15' },
  { title: 'c', date: '2025-07-20' },
];

console.log(sortByDateAsc(posts).map((p) => p.title));  // ['a', 'b', 'c']
console.log(sortByDateDesc(posts).map((p) => p.title)); // ['c', 'b', 'a']
console.log(sortBy(posts, ['date', 'title']).map((p) => p.title)); // ['a','b','c']

module.exports = { sortByDateAsc, sortByDateDesc, byField, sortBy };
