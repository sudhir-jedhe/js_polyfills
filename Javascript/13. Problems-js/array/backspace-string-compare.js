/**
 * Check whether two strings are equal when '#' means backspace
 * (LeetCode 844).
 *
 * The O(n) / O(1)-space answer walks both strings from the RIGHT, skipping
 * characters that a pending backspace consumes.
 */

/** Build the resulting string with a stack. O(n) time, O(n) space. */
function applyBackspaces(str) {
  const out = [];

  for (const ch of str) {
    if (ch === '#') out.pop();
    else out.push(ch);
  }

  return out.join('');
}

/** Simple comparison via the stack version. */
const backspaceCompareSimple = (a, b) => applyBackspaces(a) === applyBackspaces(b);

/**
 * Two-pointer scan from the right — O(1) extra space.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function backspaceCompare(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;

  /** Move an index back to the next surviving character. */
  const nextValid = (str, index) => {
    let skip = 0;

    while (index >= 0) {
      if (str[index] === '#') {
        skip++;
        index--;
      } else if (skip > 0) {
        skip--;
        index--;
      } else {
        break;
      }
    }

    return index;
  };

  while (i >= 0 || j >= 0) {
    i = nextValid(a, i);
    j = nextValid(b, j);

    if (i < 0 && j < 0) return true;   // both exhausted together
    if (i < 0 || j < 0) return false;  // one ran out first
    if (a[i] !== b[j]) return false;

    i--;
    j--;
  }

  return true;
}

// ---- Examples ----
console.log(applyBackspaces('ab#c'));            // 'ac'
console.log(backspaceCompare('ab#c', 'ad#c'));   // true
console.log(backspaceCompare('ab##', 'c#d#'));   // true  (both empty)
console.log(backspaceCompare('a#c', 'b'));       // false
console.log(backspaceCompare('bxj##tw', 'bxo#j##tw')); // true
console.log(backspaceCompareSimple('####', ''));  // true

module.exports = { backspaceCompare, backspaceCompareSimple, applyBackspaces };
