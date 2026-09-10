/**
 * Check whether two stacks are equal.
 *
 * "Equal" means the same elements in the same order from top to bottom.
 * The interesting constraint is doing it with only push/pop/peek/isEmpty
 * and restoring both stacks afterwards.
 */

class Stack {
  #items = [];

  push(item) {
    this.#items.push(item);
    return this;
  }
  pop() {
    return this.#items.pop();
  }
  peek() {
    return this.#items[this.#items.length - 1];
  }
  isEmpty() {
    return this.#items.length === 0;
  }
  get size() {
    return this.#items.length;
  }
  toArray() {
    return [...this.#items];
  }

  static from(arr) {
    const s = new Stack();
    for (const item of arr) s.push(item);
    return s;
  }
}

/**
 * Compare by popping into holding stacks, then push everything back so both
 * inputs are unchanged.
 * Time  O(n)
 * Space O(n)
 */
function areStacksEqual(a, b) {
  if (a.size !== b.size) return false;

  const holdA = [];
  const holdB = [];
  let equal = true;

  while (!a.isEmpty() && !b.isEmpty()) {
    const x = a.pop();
    const y = b.pop();
    holdA.push(x);
    holdB.push(y);

    if (x !== y) {
      equal = false;
      break;
    }
  }

  // Restore both stacks regardless of the outcome.
  while (holdA.length) a.push(holdA.pop());
  while (holdB.length) b.push(holdB.pop());

  return equal;
}

/** The easy version when you may read the underlying arrays. */
const areStacksEqualSimple = (a, b) => {
  const x = a.toArray();
  const y = b.toArray();
  return x.length === y.length && x.every((v, i) => v === y[i]);
};

/** Two queues, for the companion question. */
function areQueuesEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Deep comparison, for stacks holding objects. */
const areStacksDeepEqual = (a, b) =>
  JSON.stringify(a.toArray()) === JSON.stringify(b.toArray());

// ---- Examples ----
const s1 = Stack.from([1, 2, 3]);
const s2 = Stack.from([1, 2, 3]);
const s3 = Stack.from([1, 2, 4]);

console.log(areStacksEqual(s1, s2));  // true
console.log(areStacksEqual(s1, s3));  // false
console.log(s1.toArray());            // [1,2,3] — restored
console.log(areStacksEqualSimple(s1, s2)); // true
console.log(areQueuesEqual([1, 2], [1, 2]));// true
console.log(areStacksDeepEqual(Stack.from([{ a: 1 }]), Stack.from([{ a: 1 }]))); // true

module.exports = { Stack, areStacksEqual, areStacksEqualSimple, areQueuesEqual, areStacksDeepEqual };
