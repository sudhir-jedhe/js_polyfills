/**
 * Delete the first element of an array without using shift().
 *
 * Several alternatives, with a note on which of them actually mutate.
 */

/** slice — returns a new array, original untouched. */
const withoutFirst = (arr) => arr.slice(1);

/** Destructuring rest — same result, very readable. */
const withoutFirstDestructured = ([, ...rest]) => rest;

/** splice — MUTATES the array and returns the removed element. */
function removeFirstInPlace(arr) {
  const [removed] = arr.splice(0, 1);
  return removed;
}

/** filter by index — non-mutating, and generalises to any index. */
const withoutIndex = (arr, index) => arr.filter((_, i) => i !== index);

/** delete leaves a HOLE — length is unchanged. Almost never what you want. */
function deleteLeavesHole(arr) {
  const copy = [...arr];
  delete copy[0];
  return { array: copy, length: copy.length, firstIsHole: !(0 in copy) };
}

/**
 * O(1) dequeue: keep a head index instead of shifting.
 * shift() is O(n) because every remaining element moves down one slot,
 * which matters in a hot loop.
 */
class Queue {
  #items = [];
  #head = 0;

  enqueue(item) {
    this.#items.push(item);
    return this;
  }

  dequeue() {
    if (this.#head >= this.#items.length) return undefined;

    const item = this.#items[this.#head];
    this.#items[this.#head++] = undefined; // release the reference

    // Compact occasionally so memory does not grow without bound.
    if (this.#head > 32 && this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }

    return item;
  }

  get size() {
    return this.#items.length - this.#head;
  }
}

// ---- Examples ----
console.log(withoutFirst([1, 2, 3]));            // [2, 3]
console.log(withoutFirstDestructured([1, 2, 3]));// [2, 3]

const arr = [1, 2, 3];
console.log(removeFirstInPlace(arr), arr);       // 1 [2, 3]

console.log(withoutIndex(['a', 'b', 'c'], 1));   // ['a', 'c']
console.log(deleteLeavesHole([1, 2, 3]));        // length still 3, index 0 is a hole

const q = new Queue();
q.enqueue('a').enqueue('b');
console.log(q.dequeue(), q.size);                // 'a' 1

module.exports = { withoutFirst, withoutFirstDestructured, removeFirstInPlace, withoutIndex, Queue };
