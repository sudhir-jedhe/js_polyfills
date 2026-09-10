/**
 * Balanced parentheses (LeetCode 20).
 *
 * A stack: push every opening bracket, and on a closing bracket check that
 * the top of the stack is its partner.
 *
 * Time  O(n)
 * Space O(n)
 */

const PAIRS = { ')': '(', ']': '[', '}': '{' };
const OPENERS = new Set(Object.values(PAIRS));

/**
 * @param {string} str
 * @returns {boolean}
 */
function isBalanced(str) {
  const stack = [];

  for (const ch of str) {
    if (OPENERS.has(ch)) {
      stack.push(ch);
    } else if (PAIRS[ch]) {
      if (stack.pop() !== PAIRS[ch]) return false;
    }
    // any other character is ignored
  }

  return stack.length === 0;
}

/** Report WHERE it went wrong, which is what a linter needs. */
function findImbalance(str) {
  const stack = [];

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (OPENERS.has(ch)) {
      stack.push({ ch, index: i });
    } else if (PAIRS[ch]) {
      const top = stack.pop();
      if (!top) return { index: i, message: `Unexpected '${ch}'` };
      if (top.ch !== PAIRS[ch]) {
        return { index: i, message: `Expected closer for '${top.ch}' opened at ${top.index}` };
      }
    }
  }

  if (stack.length) {
    const { ch, index } = stack[stack.length - 1];
    return { index, message: `Unclosed '${ch}'` };
  }

  return null;
}

/** Single bracket type: a counter is enough, O(1) space. */
function isBalancedSimple(str) {
  let open = 0;

  for (const ch of str) {
    if (ch === '(') open++;
    else if (ch === ')' && --open < 0) return false;
  }

  return open === 0;
}

/** Minimum insertions to make the string balanced (LeetCode 921). */
function minAddToMakeValid(str) {
  let open = 0;
  let needed = 0;

  for (const ch of str) {
    if (ch === '(') open++;
    else if (open > 0) open--;
    else needed++;
  }

  return needed + open;
}

/** Generate every valid combination of n bracket pairs (LeetCode 22). */
function generateParentheses(n) {
  const out = [];

  function build(current, open, close) {
    if (current.length === n * 2) {
      out.push(current);
      return;
    }
    if (open < n) build(`${current}(`, open + 1, close);
    if (close < open) build(`${current})`, open, close + 1);
  }

  build('', 0, 0);
  return out;
}

// ---- Examples ----
console.log(isBalanced('{[()]}'));          // true
console.log(isBalanced('{[(])}'));          // false
console.log(isBalanced('(('));              // false
console.log(isBalanced('a(b)c[d]'));        // true
console.log(findImbalance('([)]'));         // { index: 2, message: ... }
console.log(isBalancedSimple('(()())'));    // true
console.log(minAddToMakeValid('())'));      // 1
console.log(generateParentheses(3));        // 5 combinations

module.exports = { isBalanced, findImbalance, isBalancedSimple, minAddToMakeValid, generateParentheses };
