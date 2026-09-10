/**
 * Sort strings.
 *
 * The default sort compares UTF-16 code units, so 'Z' sorts before 'a' and
 * accented letters land at the end. localeCompare is the correct tool, and
 * Intl.Collator is the fast one for large arrays.
 */

/** Default sort — code-unit order. Fast but not human order. */
const sortDefault = (arr) => [...arr].sort();

/** Locale-aware, case-insensitive-ish, handles accents properly. */
const sortLocale = (arr, locale = 'en') =>
  [...arr].sort((a, b) => a.localeCompare(b, locale));

/**
 * Intl.Collator — build the comparator once instead of per comparison.
 * Noticeably faster on large arrays.
 */
function sortCollated(arr, locale = 'en', options = { sensitivity: 'base' }) {
  const collator = new Intl.Collator(locale, options);
  return [...arr].sort(collator.compare);
}

/** Case-insensitive sort. */
const sortIgnoreCase = (arr) =>
  [...arr].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

/** By length, then alphabetically for ties. */
const sortByLength = (arr) =>
  [...arr].sort((a, b) => a.length - b.length || a.localeCompare(b));

/**
 * Natural sort: 'item2' before 'item10'.
 * numeric: true makes the collator compare embedded digit runs as numbers.
 */
function sortNatural(arr, locale = 'en') {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  return [...arr].sort(collator.compare);
}

/** Descending. */
const sortDesc = (arr) => sortLocale(arr).reverse();

// ---- Examples ----
const names = ['banana', 'Apple', 'cherry', 'apple'];

console.log(sortDefault(['b', 'A', 'a']));   // ['A', 'a', 'b']  <- code units
console.log(sortLocale(names));              // ['apple','Apple','banana','cherry']
console.log(sortCollated(names));            // case-insensitive order
console.log(sortIgnoreCase(names));
console.log(sortByLength(['ccc', 'a', 'bb']));// ['a','bb','ccc']
console.log(sortNatural(['item10', 'item2', 'item1'])); // ['item1','item2','item10']
console.log(sortDesc(['a', 'c', 'b']));      // ['c','b','a']

module.exports = { sortDefault, sortLocale, sortCollated, sortIgnoreCase, sortByLength, sortNatural, sortDesc };
