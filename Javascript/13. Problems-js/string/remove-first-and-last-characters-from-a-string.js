/**
 * Remove the first and last characters from a string.
 */

/** slice(1, -1) — the direct answer. */
const removeFirstAndLast = (str) => String(str).slice(1, -1);

/** substring version. */
const removeFirstAndLastSubstring = (str) => String(str).substring(1, str.length - 1);

/** Guarded: strings of length 0-2 collapse to '' rather than misbehaving. */
function trimEnds(str, n = 1) {
  const s = String(str);
  return s.length <= n * 2 ? '' : s.slice(n, -n);
}

/** Remove only the first character. */
const removeFirst = (str) => String(str).slice(1);

/** Remove only the last character. */
const removeLast = (str) => String(str).slice(0, -1);

/** Strip a matching pair of wrapping characters, e.g. quotes or brackets. */
function unwrap(str, open = '"', close = open) {
  const s = String(str);
  return s.startsWith(open) && s.endsWith(close) && s.length >= open.length + close.length
    ? s.slice(open.length, -close.length)
    : s;
}

// ---- Examples ----
console.log(removeFirstAndLast('hello'));   // 'ell'
console.log(removeFirstAndLast('ab'));      // ''
console.log(trimEnds('abcdef', 2));         // 'cd'
console.log(removeFirst('hello'));          // 'ello'
console.log(removeLast('hello'));           // 'hell'
console.log(unwrap('"quoted"'));            // 'quoted'
console.log(unwrap('[1,2]', '[', ']'));     // '1,2'
console.log(unwrap('plain'));               // 'plain'

module.exports = { removeFirstAndLast, removeFirstAndLastSubstring, trimEnds, removeFirst, removeLast, unwrap };
