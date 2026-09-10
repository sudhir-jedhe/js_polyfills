/**
 * Remove the portion of a string after a certain character.
 *
 * 'file.name.txt' cut at '.' -> 'file' (first) or 'file.name' (last).
 */

/** Everything before the FIRST occurrence. */
function beforeFirst(str, char) {
  const s = String(str);
  const i = s.indexOf(char);
  return i === -1 ? s : s.slice(0, i);
}

/** Everything before the LAST occurrence. */
function beforeLast(str, char) {
  const s = String(str);
  const i = s.lastIndexOf(char);
  return i === -1 ? s : s.slice(0, i);
}

/** Everything AFTER the first occurrence. */
function afterFirst(str, char) {
  const s = String(str);
  const i = s.indexOf(char);
  return i === -1 ? '' : s.slice(i + char.length);
}

/** split-based one-liner for the first-occurrence case. */
const beforeFirstSplit = (str, char) => String(str).split(char)[0];

/** Regex: keep everything up to the character, drop the rest. */
const truncateAt = (str, char) => {
  const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return String(str).replace(new RegExp(`${escaped}.*$`), '');
};

/** Practical case: strip the query string and hash off a URL. */
const stripQuery = (url) => String(url).split(/[?#]/)[0];

/** Practical case: filename without its extension. */
const withoutExtension = (filename) => beforeLast(filename, '.');

// ---- Examples ----
console.log(beforeFirst('file.name.txt', '.'));  // 'file'
console.log(beforeLast('file.name.txt', '.'));   // 'file.name'
console.log(afterFirst('key=value', '='));       // 'value'
console.log(beforeFirstSplit('a-b-c', '-'));     // 'a'
console.log(truncateAt('hello world', ' '));     // 'hello'
console.log(stripQuery('https://a.com/x?y=1#z'));// 'https://a.com/x'
console.log(withoutExtension('report.final.pdf'));// 'report.final'

module.exports = { beforeFirst, beforeLast, afterFirst, beforeFirstSplit, truncateAt, stripQuery, withoutExtension };
