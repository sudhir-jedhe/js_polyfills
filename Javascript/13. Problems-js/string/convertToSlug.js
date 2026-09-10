/**
 * Convert a string to a URL slug.
 *
 * 'Héllo, World! 2024' -> 'hello-world-2024'
 *
 * Steps: normalise accents away, lowercase, drop anything that is not a
 * letter/digit, collapse runs of separators into a single hyphen.
 */

/**
 * @param {string} str
 * @param {{ separator?: string, maxLength?: number }} [options]
 * @returns {string}
 */
function convertToSlug(str, { separator = '-', maxLength = 0 } = {}) {
  let slug = String(str)
    .normalize('NFD')                 // split accented chars into base + mark
    .replace(/[\u0300-\u036f]/g, '') // strip the combining marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, separator)         // non-alphanumeric -> separator
    .replace(new RegExp(`\\${separator}{2,}`, 'g'), separator) // collapse runs
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), ''); // trim ends

  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`\\${separator}[^${separator}]*$`), '');
  }

  return slug;
}

/** Guarantee uniqueness against a set of slugs already in use. */
function uniqueSlug(str, taken = new Set(), options) {
  const base = convertToSlug(str, options);
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** The reverse, for display: 'hello-world' -> 'Hello World'. */
const slugToTitle = (slug) =>
  String(slug)
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

// ---- Examples ----
console.log(convertToSlug('Hello, World!'));           // 'hello-world'
console.log(convertToSlug('  Héllo   Wörld 2024  '));  // 'hello-world-2024'
console.log(convertToSlug('C++ & JavaScript'));        // 'c-javascript'
console.log(convertToSlug('A Very Long Title Here', { maxLength: 12 })); // 'a-very-long'
console.log(convertToSlug('Snake Case', { separator: '_' })); // 'snake_case'
console.log(uniqueSlug('Hello World', new Set(['hello-world']))); // 'hello-world-2'
console.log(slugToTitle('hello-world'));               // 'Hello World'

module.exports = { convertToSlug, uniqueSlug, slugToTitle };
