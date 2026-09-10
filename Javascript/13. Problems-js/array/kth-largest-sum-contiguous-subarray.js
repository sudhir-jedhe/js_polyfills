/**
 * Kth largest sum of a contiguous subarray.
 *
 * Compute every subarray sum with prefix sums, then keep only the k largest
 * using a min-heap of size k — O(n^2 log k) instead of sorting all n^2 sums.
 */

/** A small binary min-heap, enough for the "keep the k largest" pattern. */
class MinHeap {
  #items = [];

  get size() {
    return this.#items.length;
  }
  peek() {
    return this.#items[0];
  }

  push(value) {
    this.#items.push(value);

    let i = this.#items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.#items[parent] <= this.#items[i]) break;
      [this.#items[parent], this.#items[i]] = [this.#items[i], this.#items[parent]];
      i = parent;
    }

    return this;
  }

  pop() {
    if (this.#items.length === 0) return undefined;

    const top = this.#items[0];
    const last = this.#items.pop();

    if (this.#items.length) {
      this.#items[0] = last;
      let i = 0;

      for (;;) {
        const left = 2 * i + 1;
        const right = left + 1;
        let smallest = i;

        if (left < this.#items.length && this.#items[left] < this.#items[smallest]) smallest = left;
        if (right < this.#items.length && this.#items[right] < this.#items[smallest]) smallest = right;
        if (smallest === i) break;

        [this.#items[i], this.#items[smallest]] = [this.#items[smallest], this.#items[i]];
        i = smallest;
      }
    }

    return top;
  }
}

/**
 * @param {number[]} arr
 * @param {number} k
 * @returns {number} the kth largest contiguous-subarray sum
 */
function kthLargestSubarraySum(arr, k) {
  const n = arr.length;

  // prefix[i] = sum of arr[0..i)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];

  const heap = new MinHeap();

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sum = prefix[j] - prefix[i];

      if (heap.size < k) heap.push(sum);
      else if (sum > heap.peek()) {
        heap.pop();
        heap.push(sum);
      }
    }
  }

  return heap.peek();
}

/** Every subarray sum, sorted descending — simple, O(n^2 log n). */
function allSubarraySums(arr) {
  const sums = [];

  for (let i = 0; i < arr.length; i++) {
    let sum = 0;
    for (let j = i; j < arr.length; j++) {
      sum += arr[j];
      sums.push(sum);
    }
  }

  return sums.sort((a, b) => b - a);
}

/** Maximum subarray sum — Kadane's algorithm, O(n). */
function maxSubarraySum(arr) {
  let best = -Infinity;
  let current = 0;

  for (const n of arr) {
    current = Math.max(n, current + n);
    best = Math.max(best, current);
  }

  return best;
}

// ---- Examples ----
const arr = [10, -10, 20, -40];

console.log(kthLargestSubarraySum(arr, 6));  // 6th largest subarray sum
console.log(allSubarraySums(arr).slice(0, 6));
console.log(kthLargestSubarraySum([20, -5, -1], 3)); // 14
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6

module.exports = { kthLargestSubarraySum, allSubarraySums, maxSubarraySum, MinHeap };
