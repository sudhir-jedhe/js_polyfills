/**
 * Doubly Linked List.
 *
 * Each node points both ways, so insertion and deletion at a known node are
 * O(1) — that is the whole reason to pay for the extra pointer. This is the
 * structure behind an LRU cache.
 */

class DoublyNode {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList {
  #head = null;
  #tail = null;
  #size = 0;

  get size() {
    return this.#size;
  }
  get head() {
    return this.#head;
  }
  get tail() {
    return this.#tail;
  }

  /** O(1) */
  push(value) {
    const node = new DoublyNode(value, this.#tail);

    if (this.#tail) this.#tail.next = node;
    else this.#head = node;

    this.#tail = node;
    this.#size++;
    return node;
  }

  /** O(1) */
  unshift(value) {
    const node = new DoublyNode(value, null, this.#head);

    if (this.#head) this.#head.prev = node;
    else this.#tail = node;

    this.#head = node;
    this.#size++;
    return node;
  }

  /** O(1) */
  pop() {
    if (!this.#tail) return undefined;

    const node = this.#tail;
    this.#tail = node.prev;

    if (this.#tail) this.#tail.next = null;
    else this.#head = null;

    this.#size--;
    return node.value;
  }

  /** O(1) */
  shift() {
    if (!this.#head) return undefined;

    const node = this.#head;
    this.#head = node.next;

    if (this.#head) this.#head.prev = null;
    else this.#tail = null;

    this.#size--;
    return node.value;
  }

  /** O(1) removal when you already hold the node — the key advantage. */
  remove(node) {
    if (node.prev) node.prev.next = node.next;
    else this.#head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.#tail = node.prev;

    node.prev = null;
    node.next = null;
    this.#size--;
    return node.value;
  }

  /** O(n) */
  find(predicate) {
    for (let node = this.#head; node; node = node.next) {
      if (predicate(node.value)) return node;
    }
    return null;
  }

  /** Reverse in place by swapping each node's pointers. */
  reverse() {
    let node = this.#head;

    while (node) {
      [node.prev, node.next] = [node.next, node.prev];
      node = node.prev; // prev is the old next
    }

    [this.#head, this.#tail] = [this.#tail, this.#head];
    return this;
  }

  toArray() {
    const out = [];
    for (let node = this.#head; node; node = node.next) out.push(node.value);
    return out;
  }

  toArrayReverse() {
    const out = [];
    for (let node = this.#tail; node; node = node.prev) out.push(node.value);
    return out;
  }

  *[Symbol.iterator]() {
    for (let node = this.#head; node; node = node.next) yield node.value;
  }

  static from(arr) {
    const list = new DoublyLinkedList();
    for (const value of arr) list.push(value);
    return list;
  }
}

// ---- Examples ----
const list = DoublyLinkedList.from([1, 2, 3]);
list.unshift(0);
list.push(4);

console.log(list.toArray());        // [0, 1, 2, 3, 4]
console.log(list.toArrayReverse()); // [4, 3, 2, 1, 0]
console.log(list.pop(), list.shift()); // 4 0

const node = list.find((v) => v === 2);
list.remove(node);
console.log(list.toArray());        // [1, 3]
console.log(list.reverse().toArray()); // [3, 1]
console.log([...list], list.size);  // [3, 1] 2

module.exports = { DoublyLinkedList, DoublyNode };
