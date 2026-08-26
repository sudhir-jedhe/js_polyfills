*** copy How do you implement an LRU (Least Recently Used) cache with O(1) get and put operations in JavaScript?.md ***

An **LRU (Least Recently Used) Cache** requires $O(1)$ time complexity for both `get` and `put` operations.

There are two primary ways to implement this in JavaScript:

1. **The Modern JS Way:** Using JavaScript's built-in `Map` (which maintains key insertion order).
2. **The Classic Data Structure Way:** Using a `HashMap` paired with a **Doubly Linked List** (frequently asked in algorithm/data structures interviews).

---

### Method 1: The Modern `Map` Implementation ($O(1)$)

JavaScript `Map` objects iterate keys in insertion order. When an item is accessed or updated, deleting and re-inserting it moves it to the very end ("most recently used"). The item at the front (`map.keys().next().value`) is always the least recently used.

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Refresh position: read value, delete, and re-insert to end
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    // If key exists, delete it first to reset insertion position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first key in map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }
}

```

---

### Method 2: Classic Doubly Linked List + Hash Map ($O(1)$)

This is the standard low-level implementation:

* **`HashMap`**: Stores `key -> ListNode` for $O(1)$ node lookup.
* **`DoublyLinkedList`**: Holds nodes ordered by usage with dummy `head` (Least Recently Used) and `tail` (Most Recently Used) sentinels for $O(1)$ node removal and insertion.

```javascript
class Node {
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCacheManual {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> Node

    // Sentinel dummy nodes to eliminate edge-case null checks
    this.head = new Node(); // LRU side
    this.tail = new Node(); // MRU side
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Remove a node from the linked list
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // Insert node right before tail (mark as Most Recently Used)
  _insert(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;

    const node = this.map.get(key);
    this._remove(node);
    this._insert(node); // Move to MRU position
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
    }

    const newNode = new Node(key, value);
    this._insert(newNode);
    this.map.set(key, newNode);

    // Evict least recently used if exceeding capacity
    if (this.map.size > this.capacity) {
      const lruNode = this.head.next; // First real node after dummy head
      this._remove(lruNode);
      this.map.delete(lruNode.key);
    }
  }
}

```

---

### Verification & Test

```javascript
const lru = new LRUCache(2);

lru.put(1, 1); // cache is {1=1}
lru.put(2, 2); // cache is {1=1, 2=2}
console.log(lru.get(1));    // returns 1, marks key 1 as MRU -> cache is {2=2, 1=1}

lru.put(3, 3); // evicts key 2 -> cache is {1=1, 3=3}
console.log(lru.get(2));    // returns -1 (not found)

lru.put(4, 4); // evicts key 1 -> cache is {3=3, 4=4}
console.log(lru.get(1));    // returns -1 (not found)
console.log(lru.get(3));    // returns 3
console.log(lru.get(4));    // returns 4

```
