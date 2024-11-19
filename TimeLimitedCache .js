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


class TimeLimitedCache {
  constructor() {
    this.cache = new Map(); // To store key-value pairs with expiration times
  }

  // Set a key-value pair with expiration duration
  set(key, value, duration) {
    const currentTime = Date.now();  // Get current time in milliseconds
    const expirationTime = currentTime + duration;  // Calculate expiration time
    
    let existed = false;
    
    if (this.cache.has(key)) {
      // If the key exists, check if the old value is expired
      const [oldValue, oldExpirationTime] = this.cache.get(key);
      if (oldExpirationTime > currentTime) {
        // If the old value is unexpired, we overwrite it and return true
        existed = true;
      }
    }

    // Store the new key, value, and expiration time
    this.cache.set(key, [value, expirationTime]);
    
    return existed;  // Return whether the key was overwritten with an unexpired value
  }

  // Get the value of a key if it is not expired
  get(key) {
    const currentTime = Date.now();  // Get current time
    
    if (this.cache.has(key)) {
      const [value, expirationTime] = this.cache.get(key);
      if (expirationTime > currentTime) {
        // If the key hasn't expired, return the value
        return value;
      }
      // If the key is expired, delete it from the cache
      this.cache.delete(key);
    }
    
    return -1;  // Return -1 if the key doesn't exist or is expired
  }

  // Count how many keys are unexpired
  count() {
    const currentTime = Date.now();  // Get current time
    let count = 0;
    
    // Iterate through all keys to count unexpired ones
    for (let [key, [value, expirationTime]] of this.cache.entries()) {
      if (expirationTime > currentTime) {
        count++;
      } else {
        // If expired, remove the key
        this.cache.delete(key);
      }
    }
    
    return count;
  }
}



const actions2 = ["TimeLimitedCache", "set", "set", "get", "get", "get", "count"];
const values2 = [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []];
const timeDelays2 = [0, 0, 40, 50, 120, 200, 250];

const cache2 = new TimeLimitedCache();

const results2 = [];
let currentTime2 = 0;

actions2.forEach((action, index) => {
  currentTime2 = timeDelays2[index];
  if (action === "set") {
    const [key, value, duration] = values2[index];
    results2.push(cache2.set(key, value, duration));
  } else if (action === "get") {
    const [key] = values2[index];
    results2.push(cache2.get(key));
  } else if (action === "count") {
    results2.push(cache2.count());
  }
});

console.log(results2);  // Output: [null, false, true, 50, 50, -1, 0]
