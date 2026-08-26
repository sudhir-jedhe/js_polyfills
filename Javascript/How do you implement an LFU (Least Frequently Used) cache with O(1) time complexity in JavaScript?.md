*** copy How do you implement an LFU (Least Frequently Used) cache with O(1) time complexity in JavaScript?.md ***

An **LFU (Least Frequently Used) Cache** evicts the item with the lowest access frequency. When there is a tie in frequency, it breaks the tie by evicting the **Least Recently Used (LRU)** item among them.

Achieving strictly **$O(1)$ time complexity** for both `get` and `put` requires two data structures:

1. **`keyTable` (`Map<key, Node>`):** Quick node lookup by key.
2. **`freqTable` (`Map<frequency, DoublyLinkedList>`):** Maps each access count to a doubly linked list of nodes sharing that exact frequency (ordered by recency).
3. **`minFreq` pointer:** Tracks the minimum frequency currently in the cache.

---

### Implementation

```javascript
class Node {
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
    this.freq = 1;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = new Node(); // LRU sentinel
    this.tail = new Node(); // MRU sentinel
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  // Insert node at the MRU end (before tail)
  addNode(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
    this.size++;
  }

  // Remove a specific node in O(1)
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
  }

  // Evict the least recently used node in this frequency list (after head)
  removeLRU() {
    if (this.size === 0) return null;
    const lruNode = this.head.next;
    this.removeNode(lruNode);
    return lruNode;
  }
}

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.minFreq = 0;
    this.keyTable = new Map();  // key -> Node
    this.freqTable = new Map(); // freq -> DoublyLinkedList
  }

  // Helper to update node frequency and shift it across frequency lists
  _updateFreq(node) {
    const oldFreq = node.freq;
    const oldList = this.freqTable.get(oldFreq);
    oldList.removeNode(node);

    // If the lowest frequency list becomes empty, increment minFreq
    if (oldFreq === this.minFreq && oldList.size === 0) {
      this.minFreq++;
    }

    node.freq++;
    if (!this.freqTable.has(node.freq)) {
      this.freqTable.set(node.freq, new DoublyLinkedList());
    }
    this.freqTable.get(node.freq).addNode(node);
  }

  get(key) {
    if (!this.keyTable.has(key) || this.capacity === 0) {
      return -1;
    }

    const node = this.keyTable.get(key);
    this._updateFreq(node);
    return node.val;
  }

  put(key, value) {
    if (this.capacity === 0) return;

    // Case 1: Key already exists -> update value and increase frequency
    if (this.keyTable.has(key)) {
      const node = this.keyTable.get(key);
      node.val = value;
      this._updateFreq(node);
      return;
    }

    // Case 2: Capacity reached -> Evict LFU (and LRU on tie)
    if (this.size >= this.capacity) {
      const minList = this.freqTable.get(this.minFreq);
      const evicted = minList.removeLRU();
      this.keyTable.delete(evicted.key);
      this.size--;
    }

    // Case 3: Insert brand new node with initial freq = 1
    const newNode = new Node(key, value);
    this.keyTable.set(key, newNode);

    if (!this.freqTable.has(1)) {
      this.freqTable.set(1, new DoublyLinkedList());
    }
    this.freqTable.get(1).addNode(newNode);

    this.minFreq = 1;
    this.size++;
  }
}

```

---

### Verification Test

```javascript
const lfu = new LFUCache(2);

lfu.put(1, 1); // [1:1 (f=1)]
lfu.put(2, 2); // [1:1 (f=1), 2:2 (f=1)]

console.log(lfu.get(1)); // returns 1 -> 1's freq becomes 2: [2:2 (f=1)], [1:1 (f=2)]

lfu.put(3, 3); // Capacity full. minFreq=1 (key 2 evicted).
               // Cache is now: [3:3 (f=1)], [1:1 (f=2)]

console.log(lfu.get(2)); // returns -1 (evicted)
console.log(lfu.get(3)); // returns 3 -> 3's freq becomes 2: [1:1 (f=2), 3:3 (f=2)]

lfu.put(4, 4); // Capacity full. minFreq=2. Both 1 and 3 have freq=2.
               // Key 1 is LRU among freq=2 -> evicts key 1.
               // Cache is now: [4:4 (f=1)], [3:3 (f=2)]

console.log(lfu.get(1)); // returns -1 (evicted)
console.log(lfu.get(3)); // returns 3
console.log(lfu.get(4)); // returns 4

```

---

### Key Architectural Differences: LRU vs. LFU

| Metric              | LRU (Least Recently Used)           | LFU (Least Frequently Used)                              |
| ------------------- | ----------------------------------- | -------------------------------------------------------- |
| **Primary Metric**  | Recency of last access              | Total access count                                       |
| **Tie-Breaker**     | None                                | LRU among the lowest frequency group                     |
| **Data Structures** | Single `Map` + 1 `DoublyLinkedList` | `Map` + Multiple `DoublyLinkedList` grouped by frequency |
| **Complexity**      | $O(1)$ `get`, $O(1)$ `put`          | $O(1)$ `get`, $O(1)$ `put`                               |
