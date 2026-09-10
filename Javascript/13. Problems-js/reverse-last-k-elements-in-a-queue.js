/**
 * Reverse the last K elements of a queue.
 *
 * The first (n - k) elements keep their order; the final k are reversed.
 * Classic approach: dequeue the first n-k into a holding queue, push the
 * remaining k onto a stack, then rebuild.
 *
 * Time  O(n)
 * Space O(n)
 */

/**
 * @param {number[]} queue front of the queue is index 0
 * @param {number} k
 * @returns {number[]} a new queue
 */
function reverseLastK(queue, k) {
  const n = queue.length;
  if (k <= 0 || k > n) return [...queue];

  const head = queue.slice(0, n - k);
  const tail = queue.slice(n - k).reverse();

  return [...head, ...tail];
}

/** In-place two-pointer swap over the last k slots — O(1) extra space. */
function reverseLastKInPlace(queue, k) {
  const n = queue.length;
  if (k <= 0 || k > n) return queue;

  let lo = n - k;
  let hi = n - 1;

  while (lo < hi) {
    [queue[lo], queue[hi]] = [queue[hi], queue[lo]];
    lo++;
    hi--;
  }

  return queue;
}

/** The textbook queue + stack version, for the interview answer. */
function reverseLastKWithStack(queue, k) {
  const q = [...queue];
  const n = q.length;
  if (k <= 0 || k > n) return q;

  const front = [];
  for (let i = 0; i < n - k; i++) front.push(q.shift()); // dequeue

  const stack = [];
  while (q.length) stack.push(q.shift()); // dequeue -> push

  const out = front;
  while (stack.length) out.push(stack.pop()); // pop -> enqueue

  return out;
}

// ---- Examples ----
console.log(reverseLastK([1, 2, 3, 4, 5], 3));          // [1, 2, 5, 4, 3]
console.log(reverseLastKInPlace([1, 2, 3, 4, 5], 2));   // [1, 2, 3, 5, 4]
console.log(reverseLastKWithStack([10, 20, 30, 40], 4));// [40, 30, 20, 10]
console.log(reverseLastK([1, 2, 3], 0));                // [1, 2, 3]

module.exports = { reverseLastK, reverseLastKInPlace, reverseLastKWithStack };
