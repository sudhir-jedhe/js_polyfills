/**
 * Find the largest number that can be formed by changing at most k digits.
 *
 * Greedy from the left: the most significant positions matter most, so
 * spend each change on the leftmost digit that is not already 9.
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * @param {string|number} num
 * @param {number} k maximum digit replacements
 * @returns {string}
 */
function largestAfterKChanges(num, k) {
  const digits = [...String(num)];
  let remaining = k;

  for (let i = 0; i < digits.length && remaining > 0; i++) {
    if (digits[i] !== '9') {
      digits[i] = '9';
      remaining--;
    }
  }

  return digits.join('');
}

/**
 * The SMALLEST number instead. The leading digit may not become 0
 * (unless the number is a single digit).
 */
function smallestAfterKChanges(num, k) {
  const digits = [...String(num)];
  let remaining = k;

  if (remaining > 0 && digits[0] !== '1' && digits.length > 1) {
    digits[0] = '1';
    remaining--;
  } else if (remaining > 0 && digits.length === 1 && digits[0] !== '0') {
    digits[0] = '0';
    remaining--;
  }

  for (let i = 1; i < digits.length && remaining > 0; i++) {
    if (digits[i] !== '0') {
      digits[i] = '0';
      remaining--;
    }
  }

  return digits.join('');
}

/**
 * Largest by REMOVING k digits (the mirror of LeetCode 402):
 * a monotonic stack keeps the largest digits at the front.
 */
function largestAfterRemovingK(num, k) {
  const stack = [];
  let toRemove = k;

  for (const digit of String(num)) {
    while (toRemove > 0 && stack.length && stack[stack.length - 1] < digit) {
      stack.pop();
      toRemove--;
    }
    stack.push(digit);
  }

  return stack.slice(0, stack.length - toRemove).join('') || '0';
}

/** Smallest after removing k digits (LeetCode 402). */
function smallestAfterRemovingK(num, k) {
  const stack = [];
  let toRemove = k;

  for (const digit of String(num)) {
    while (toRemove > 0 && stack.length && stack[stack.length - 1] > digit) {
      stack.pop();
      toRemove--;
    }
    stack.push(digit);
  }

  return stack.slice(0, stack.length - toRemove).join('').replace(/^0+(?=\d)/, '') || '0';
}

/** Max difference between the largest and smallest reachable value. */
const spread = (num, k) =>
  Number(largestAfterKChanges(num, k)) - Number(smallestAfterKChanges(num, k));

// ---- Examples ----
console.log(largestAfterKChanges(2596, 2));   // '9996'
console.log(largestAfterKChanges(9999, 3));   // '9999'
console.log(smallestAfterKChanges(2596, 2));  // '1096'
console.log(largestAfterRemovingK('1924', 2));// '94'
console.log(smallestAfterRemovingK('1432219', 3)); // '1219'
console.log(spread(2596, 2));                 // 8900

module.exports = { largestAfterKChanges, smallestAfterKChanges, largestAfterRemovingK, smallestAfterRemovingK, spread };
