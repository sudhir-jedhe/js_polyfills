/**
 * Find the Next Smaller Element for every position.
 *
 * The mirror of Next Greater Element: a monotonic INCREASING stack. Each
 * index is pushed and popped at most once.
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * Next smaller element to the RIGHT.
 * @param {number[]} arr
 * @returns {number[]} -1 where none exists
 */
function nextSmallerRight(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = []; // indexes still waiting for an answer

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

/** Next smaller element to the LEFT — same scan, from the right. */
function nextSmallerLeft(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

/** Their INDEXES rather than the values. */
function nextSmallerRightIndexes(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) {
      result[stack.pop()] = i;
    }
    stack.push(i);
  }

  return result;
}

/**
 * A classic use: largest rectangle in a histogram (LeetCode 84) is exactly
 * "next smaller on each side" turned into widths.
 */
function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;

  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i]; // sentinel flushes the stack

    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, height * (i - left));
    }

    stack.push(i);
  }

  return best;
}

// ---- Examples ----
console.log(nextSmallerRight([4, 8, 5, 2, 25]));  // [2, 5, 2, -1, -1]
console.log(nextSmallerLeft([1, 6, 4, 10, 2, 5]));// [-1, 1, 1, 4, 1, 2]
console.log(nextSmallerRightIndexes([4, 8, 5, 2]));// [3, 2, 3, -1]
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 10

module.exports = { nextSmallerRight, nextSmallerLeft, nextSmallerRightIndexes, largestRectangleArea };
