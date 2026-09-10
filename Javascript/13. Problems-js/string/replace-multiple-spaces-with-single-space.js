/**
 * Replace multiple spaces with a single space.
 *
 * \s+ also collapses tabs and newlines, which is usually what you want when
 * normalising user input.
 */

/** Collapse runs of any whitespace, then trim. */
const collapseWhitespace = (str) => String(str).replace(/\s+/g, ' ').trim();

/** Collapse only literal spaces, leaving tabs and newlines alone. */
const collapseSpaces = (str) => String(str).replace(/ {2,}/g, ' ');

/** Collapse spaces within each line but keep the line breaks. */
const collapsePerLine = (str) =>
  String(str)
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .join('\n');

/** split/filter/join — no regex. */
const collapseBySplit = (str) => String(str).split(/\s+/).filter(Boolean).join(' ');

/** Remove ALL whitespace. */
const removeAllWhitespace = (str) => String(str).replace(/\s+/g, '');

/** Collapse blank lines down to at most one. */
const collapseBlankLines = (str) => String(str).replace(/\n{3,}/g, '\n\n');

// ---- Examples ----
console.log(collapseWhitespace('  hello    world  '));  // 'hello world'
console.log(collapseWhitespace('a\t\tb\n\nc'));         // 'a b c'
console.log(collapseSpaces('a    b\tc'));               // 'a b\tc'
console.log(collapsePerLine('a   b\n  c    d '));       // 'a b\nc d'
console.log(collapseBySplit('  x   y  '));              // 'x y'
console.log(removeAllWhitespace(' 1 2 3 '));            // '123'

module.exports = { collapseWhitespace, collapseSpaces, collapsePerLine, collapseBySplit, removeAllWhitespace, collapseBlankLines };
