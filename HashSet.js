class HashSet {
  constructor() {
    this.buckets = [];
    this.size = 0;
    this.capacity = 10; // Initial capacity
    this.loadFactor = 0.75;
  }

  add(key) {
    if (this.contains(key)) {
      return false; // Key already exists
    }

    if (this.size >= this.capacity * this.loadFactor) {
      this.rehash();
    }

    const index = this.hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    this.buckets[index].push(key);
    this.size++;
    return true;
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    if (!bucket) {
      return false; // Key doesn't exist
    }
    const indexInBucket = bucket.indexOf(key);
    if (indexInBucket === -1) {
      return false; // Key doesn't exist
    }
    bucket.splice(indexInBucket, 1);
    this.size--;
    return true;
  }

  contains(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    return !!bucket && bucket.includes(key);
  }

  hash(key) {
    // Custom hash function, for simplicity let's use the ASCII value of the first character
    return key.charCodeAt(0) % this.capacity;
  }

  rehash() {
    this.capacity *= 2;
    const oldBuckets = this.buckets;
    this.buckets = [];
    this.size = 0;
    for (const bucket of oldBuckets) {
      if (bucket) {
        for (const key of bucket) {
          this.add(key);
        }
      }
    }
  }
}

["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"]
[[], [1], [2], [1], [3], [2], [2], [2], [2]]

[null, null, null, true, false, null, true, null, false]


MyHashSet myHashSet = new MyHashSet();
myHashSet.add(1);      // set = [1]
myHashSet.add(2);      // set = [1, 2]
myHashSet.contains(1); // return True
myHashSet.contains(3); // return False, (not found)
myHashSet.add(2);      // set = [1, 2]
myHashSet.contains(2); // return True
myHashSet.remove(2);   // set = [1]
myHashSet.contains(2); // return False, (already removed)



/******************************** */

class ListNode {
  constructor(val, next = null) {
      this.val = val;
      this.next = next;
  }
}

class MyHashSet {
  constructor() {
      this.size = 1000;
      this.buckets = new Array(this.size).fill(null);
  }

  _hash(key) {
      return key % this.size;
  }

  add(key) {
      const hashKey = this._hash(key);
      if (!this.buckets[hashKey]) {
          this.buckets[hashKey] = new ListNode(key);
          return;
      }
      let curr = this.buckets[hashKey];
      while (curr.next) {
          if (curr.val === key) {
              return;
          }
          curr = curr.next;
      }
      curr.next = new ListNode(key);
  }

  remove(key) {
      const hashKey = this._hash(key);
      if (!this.buckets[hashKey]) {
          return;
      }
      if (this.buckets[hashKey].val === key) {
          this.buckets[hashKey] = this.buckets[hashKey].next;
          return;
      }
      let prev = null;
      let curr = this.buckets[hashKey];
      while (curr) {
          if (curr.val === key) {
              prev.next = curr.next;
              return;
          }
          prev = curr;
          curr = curr.next;
      }
  }

  contains(key) {
      const hashKey = this._hash(key);
      let curr = this.buckets[hashKey];
      while (curr) {
          if (curr.val === key) {
              return true;
          }
          curr = curr.next;
      }
      return false;
  }
}

// Test cases
const myHashSet = new MyHashSet();
myHashSet.add(1);
myHashSet.add(2);
console.log(myHashSet.contains(1)); // Output: true
console.log(myHashSet.contains(3)); // Output: false
myHashSet.remove(2);
console.log(myHashSet.contains(2)); // Output: false




/********************************** */

const Store = function(){
  //store the data
  this.list = {};
  
  //set the key-value in list
  this.set = function(key, value){
    this.list[key] = value;
  }
  
  //get the value of the given key
  this.get = function(key){
    return this.list[key];
  }
  
  //check if key exists
  this.has = function(key){
    return !!this.list[key];
  }
}


Input:
const store = new Store();
store.set('a', 10);
store.set('b', 20);
store.set('c', 30);
console.log(store.get('b'));
console.log(store.has('c'));
console.log(store.get('d'));
console.log(store.has('e'));

Output:
20
true
undefined
false