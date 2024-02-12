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
