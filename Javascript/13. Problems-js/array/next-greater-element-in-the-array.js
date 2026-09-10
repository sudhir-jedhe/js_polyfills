/**
 * Next Greater Element.
 *
 * For each element, find the first element to its right that is larger.
 * A monotonic decreasing stack solves it in one pass: each index is pushed
 * and popped at most once.
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * @param {number[]} arr
 * @returns {number[]} -1 where there is no greater element
 */
function nextGreaterElements(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = []; // indexes whose answer is still unknown

  for (let i = 0; i < arr.length; i++) {
    // Everything smaller than arr[i] has just found its answer.
    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

/** Circular version: the array wraps around (LeetCode 503). */
function nextGreaterCircular(arr) {
  const n = arr.length;
  const result = new Array(n).fill(-1);
  const stack = [];

  // Two passes over the array simulate the wrap.
  for (let i = 0; i < n * 2; i++) {
    const value = arr[i % n];
    while (stack.length && arr[stack[stack.length - 1]] < value) {
      result[stack.pop()] = value;
    }
    if (i < n) stack.push(i);
  }

  return result;
}

/** Next SMALLER element to the right — flip the comparison. */
function nextSmallerElements(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

/** Previous greater element — walk from the right instead. */
function previousGreaterElements(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

// ---- Examples ----
console.log(nextGreaterElements([4, 5, 2, 25]));   // [5, 25, 25, -1]
console.log(nextGreaterElements([13, 7, 6, 12]));  // [-1, 12, 12, -1]
console.log(nextGreaterCircular([1, 2, 1]));       // [2, -1, 2]
console.log(nextSmallerElements([4, 8, 5, 2, 25]));// [2, 5, 2, -1, -1]
console.log(previousGreaterElements([10, 4, 2, 20, 40])); // [-1, 10, 4, -1, -1]

module.exports = { nextGreaterElements, nextGreaterCircular, nextSmallerElements, previousGreaterElements };
