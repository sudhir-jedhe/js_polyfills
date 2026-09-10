/**
 * A stack with O(1) min() and max().
 *
 * The trick: alongside the value stack, keep auxiliary stacks holding the
 * running minimum and maximum. Every push records the current extreme, so
 * popping restores the previous one for free.
 *
 * Time  O(1) for push, pop, peek, min and max
 * Space O(n)
 */

class MinMaxStack {
  #values = [];
  #mins = [];
  #maxes = [];

  push(value) {
    this.#values.push(value);
    this.#mins.push(this.#mins.length ? Math.min(value, this.min) : value);
    this.#maxes.push(this.#maxes.length ? Math.max(value, this.max) : value);
    return this;
  }

  pop() {
    this.#mins.pop();
    this.#maxes.pop();
    return this.#values.pop();
  }

  peek() {
    return this.#values[this.#values.length - 1];
  }

  get min() {
    return this.#mins[this.#mins.length - 1];
  }

  get max() {
    return this.#maxes[this.#maxes.length - 1];
  }

  get size() {
    return this.#values.length;
  }

  isEmpty() {
    return this.#values.length === 0;
  }

  toArray() {
    return [...this.#values];
  }
}

/**
 * A space-optimised MinStack: instead of a full parallel stack, push onto
 * the min stack only when a new minimum arrives (LeetCode 155).
 */
class MinStack {
  #values = [];
  #mins = [];

  push(value) {
    this.#values.push(value);
    if (!this.#mins.length || value <= this.min) this.#mins.push(value);
    return this;
  }

  pop() {
    const value = this.#values.pop();
    if (value === this.min) this.#mins.pop();
    return value;
  }

  top() {
    return this.#values[this.#values.length - 1];
  }

  get min() {
    return this.#mins[this.#mins.length - 1];
  }
}

/** A queue with O(1) amortised min, built from two MinMaxStacks. */
class MinQueue {
  #inbox = new MinMaxStack();
  #outbox = new MinMaxStack();

  enqueue(value) {
    this.#inbox.push(value);
    return this;
  }

  dequeue() {
    if (this.#outbox.isEmpty()) {
      while (!this.#inbox.isEmpty()) this.#outbox.push(this.#inbox.pop());
    }
    return this.#outbox.pop();
  }

  get min() {
    if (this.#inbox.isEmpty()) return this.#outbox.min;
    if (this.#outbox.isEmpty()) return this.#inbox.min;
    return Math.min(this.#inbox.min, this.#outbox.min);
  }
}

// ---- Examples ----
const stack = new MinMaxStack();
stack.push(5).push(2).push(8).push(1);

console.log(stack.min, stack.max);  // 1 8
stack.pop();
console.log(stack.min, stack.max);  // 2 8
console.log(stack.peek(), stack.size); // 8 3

const minStack = new MinStack();
minStack.push(-2).push(0).push(-3);
console.log(minStack.min); // -3
minStack.pop();
console.log(minStack.min, minStack.top()); // -2 0

const queue = new MinQueue();
queue.enqueue(4).enqueue(1).enqueue(7);
console.log(queue.min, queue.dequeue(), queue.min); // 1 4 1

module.exports = { MinMaxStack, MinStack, MinQueue };
