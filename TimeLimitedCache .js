class TimeLimitedCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, duration) {
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timer); // Clear previous timer
    }

    const expirationTime = Date.now() + duration;
    const timer = setTimeout(() => {
      this.cache.delete(key); // Remove key from cache after expiration
    }, duration);

    this.cache.set(key, { value, expirationTime, timer });

    return !this.cache.has(key); // Return true if key did not exist previously
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1; // Key does not exist
    }

    const { value, expirationTime } = this.cache.get(key);

    if (expirationTime < Date.now()) {
      this.cache.delete(key); // Remove key if expired
      return -1; // Key has expired
    }

    return value; // Return value if key is valid
  }

  count() {
    return Array.from(this.cache.values()).reduce((count, item) => {
      if (item.expirationTime >= Date.now()) {
        return count + 1;
      } else {
        this.cache.delete(key); // Remove expired key from cache
        return count;
      }
    }, 0);
  }
}

// Example usage:
const cache = new TimeLimitedCache();
cache.set(1, 42, 1000); // returns false
console.log(cache.get(1)); // returns 42
console.log(cache.count()); // returns 1



/***************************** */
In this lab, you will be building a Time Limited Cache class that allows you to store key-value pairs, with each key having a time until expiration associated with it. Once the duration has elapsed, the key should become inaccessible. This class is a great way to practice working with time constraints and data structures in JavaScript.

Here's an outline of the Time Limited Cache class and its methods:

set(key, value, duration): Accepts an integer key, an integer value, and a duration in milliseconds. Once the duration has elapsed, the key should be inaccessible. The method should return true if the same unexpired key already exists and false otherwise. Both the value and duration should be overwritten if the key already exists.

get(key): If an unexpired key exists, it should return the associated value. Otherwise, it should return -1.

count(): Returns the count of unexpired keys.

Here's an example of how the Time Limited Cache class should work:

const cache = new TimeLimitedCache();
cache.set(1, 42, 1000); // returns false
cache.get(1); // returns 42
cache.count(); // returns 1
The lab will guide you through several challenges that involve updating and using the cache. To complete the challenges, you will need to utilize ESM import/export throughout the lab. Additionally, please ensure that any code you write is bug-free and carefully constructed.

Let's look at some examples to better understand the Time Limited Cache class:

Example 1:

const cache = new TimeLimitedCache();
cache.set(1, 42, 1000); // returns false (Duration is set to 1000ms)
cache.get(1); // returns 42
setTimeout(() => {
  cache.get(1); // returns -1, as key 1 has expired after 1000ms
}, 1500);
Example 2:

const cache = new TimeLimitedCache();
cache.set(1, 42, 500); // returns false
cache.set(2, 84, 1000); // returns false
cache.count(); // returns 2
setTimeout(() => {
  cache.count(); // returns 1, as only key 2 with 1000ms duration remains
  cache.get(1); // returns -1, as key 1 has expired after 500ms
  cache.get(2); // returns 84
}, 700);
Example 3:

const cache = new TimeLimitedCache();
cache.set(1, 42, 500); // returns false
cache.set(1, 24, 1500); // returns true, as key 1 has the same unexpired key and updates value and duration
cache.get(1); // returns 24
setTimeout(() => {
  cache.get(1); // returns 24, as key 1's new duration is 1500ms
}, 700);

/********************************** */