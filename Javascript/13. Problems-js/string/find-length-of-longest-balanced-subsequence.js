/**
 * Find the length of the longest balanced subsequence of brackets.
 *
 * A balanced subsequence keeps order but may skip characters. The greedy
 * counter is optimal: track how many '(' are still open; each ')' that
 * finds an open '(' contributes a pair.
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * @param {string} str a string of '(' and ')'
 * @returns {number} length (always even)
 */
function longestBalancedSubsequence(str) {
  let open = 0;
  let pairs = 0;

  for (const ch of str) {
    if (ch === '(') open++;
    else if (ch === ')' && open > 0) {
      open--;
      pairs++;
    }
  }

  return pairs * 2;
}

/** How many brackets must be inserted to make the string balanced. */
function minInsertionsToBalance(str) {
  let open = 0;
  let needed = 0;

  for (const ch of str) {
    if (ch === '(') open++;
    else if (open > 0) open--;
    else needed++; // an unmatched ')'
  }

  return needed + open;
}

/**
 * Longest balanced SUBSTRING (contiguous) — LeetCode 32.
 * Stack of indices; the base index sits at the bottom.
 */
function longestValidParentheses(str) {
  const stack = [-1];
  let best = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) stack.push(i); // new base
      else best = Math.max(best, i - stack[stack.length - 1]);
    }
  }

  return best;
}

/** Is the whole string balanced, with mixed bracket types? */
function isBalanced(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];

  for (const ch of str) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (pairs[ch] && stack.pop() !== pairs[ch]) return false;
  }

  return stack.length === 0;
}

// ---- Examples ----
console.log(longestBalancedSubsequence('()())'));   // 4
console.log(longestBalancedSubsequence('(()('));    // 2
console.log(minInsertionsToBalance('(()'));         // 1
console.log(longestValidParentheses(')()())'));     // 4
console.log(isBalanced('{[()]}'));                  // true
console.log(isBalanced('{[(])}'));                  // false

module.exports = { longestBalancedSubsequence, minInsertionsToBalance, longestValidParentheses, isBalanced };
