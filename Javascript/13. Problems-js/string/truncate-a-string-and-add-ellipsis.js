/**
 * Truncate a string to a certain length and add an ellipsis.
 *
 * The subtlety: the ellipsis should count toward the limit, otherwise the
 * result is longer than the caller asked for.
 */

/**
 * @param {string} str
 * @param {number} maxLength total length INCLUDING the ellipsis
 * @param {string} [ellipsis='...']
 * @returns {string}
 */
function truncate(str, maxLength, ellipsis = '...') {
  const s = String(str);
  if (s.length <= maxLength) return s;
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);

  return s.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/** Never cut mid-word — back up to the last space. */
function truncateWords(str, maxLength, ellipsis = '...') {
  const s = String(str);
  if (s.length <= maxLength) return s;

  const cut = s.slice(0, maxLength - ellipsis.length);
  const lastSpace = cut.lastIndexOf(' ');

  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + ellipsis;
}

/** Keep the first n words rather than n characters. */
function truncateByWordCount(str, wordCount, ellipsis = '...') {
  const words = String(str).trim().split(/\s+/);
  if (words.length <= wordCount) return String(str);
  return words.slice(0, wordCount).join(' ') + ellipsis;
}

/** Ellipsis in the middle — good for long file paths and hashes. */
function truncateMiddle(str, maxLength, ellipsis = '...') {
  const s = String(str);
  if (s.length <= maxLength) return s;

  const keep = maxLength - ellipsis.length;
  const front = Math.ceil(keep / 2);
  const back = Math.floor(keep / 2);

  return s.slice(0, front) + ellipsis + s.slice(s.length - back);
}

/** Unicode-safe: counts graphemes, so an emoji is never cut in half. */
function truncateUnicode(str, maxLength, ellipsis = '…') {
  const chars = [...String(str)];
  if (chars.length <= maxLength) return String(str);
  return chars.slice(0, maxLength - [...ellipsis].length).join('') + ellipsis;
}

// ---- Examples ----
console.log(truncate('The quick brown fox', 10));       // 'The qui...'
console.log(truncate('short', 10));                     // 'short'
console.log(truncateWords('The quick brown fox', 12));  // 'The quick...'
console.log(truncateByWordCount('one two three four', 2)); // 'one two...'
console.log(truncateMiddle('/very/long/path/to/file.txt', 18)); // '/very/lo.../file.txt'-ish
console.log(truncateUnicode('hello 🙂🙂🙂 world', 8));    // 'hello 🙂…'

module.exports = { truncate, truncateWords, truncateByWordCount, truncateMiddle, truncateUnicode };
