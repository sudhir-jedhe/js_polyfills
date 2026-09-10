/**
 * Reverse a doubly linked list.
 *
 * Swapping each node's `prev` and `next` reverses the list in one pass;
 * the head and tail then swap too.
 *
 * Time  O(n)
 * Space O(1)
 */

class DoublyNode {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList {
  head = null;
  tail = null;
  size = 0;

  push(value) {
    const node = new DoublyNode(value, this.tail);

    if (this.tail) this.tail.next = node;
    else this.head = node;

    this.tail = node;
    this.size++;
    return this;
  }

  /** Reverse in place by swapping each node's pointers. */
  reverse() {
    let node = this.head;

    while (node) {
      [node.prev, node.next] = [node.next, node.prev];
      node = node.prev; // prev now holds what next used to
    }

    [this.head, this.tail] = [this.tail, this.head];
    return this;
  }

  /** Recursive reversal, for contrast. */
  reverseRecursive() {
    const walk = (node) => {
      if (!node) return null;

      [node.prev, node.next] = [node.next, node.prev];
      if (!node.prev) return node; // this was the old tail

      return walk(node.prev);
    };

    const oldTail = this.tail;
    walk(this.head);
    [this.head, this.tail] = [oldTail, this.head];
    return this;
  }

  toArray() {
    const out = [];
    for (let node = this.head; node; node = node.next) out.push(node.value);
    return out;
  }

  toArrayBackward() {
    const out = [];
    for (let node = this.tail; node; node = node.prev) out.push(node.value);
    return out;
  }

  static from(arr) {
    const list = new DoublyLinkedList();
    for (const value of arr) list.push(value);
    return list;
  }
}

/** Singly linked list reversal, the more common interview question. */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseSingly(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// ---- Examples ----
const list = DoublyLinkedList.from([1, 2, 3, 4]);

console.log(list.toArray());          // [1, 2, 3, 4]
list.reverse();
console.log(list.toArray());          // [4, 3, 2, 1]
console.log(list.toArrayBackward());  // [1, 2, 3, 4]
console.log(list.head.value, list.tail.value); // 4 1

const singly = new ListNode(1, new ListNode(2, new ListNode(3)));
let node = reverseSingly(singly);
const out = [];
while (node) {
  out.push(node.val);
  node = node.next;
}
console.log(out); // [3, 2, 1]

module.exports = { DoublyLinkedList, DoublyNode, ListNode, reverseSingly };
