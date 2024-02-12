// his is a pretty important question to practice because async programming is
// frequently tested during interviews. Understanding how Promise.all works
// under the hood will help you in understanding the mechanisms behind similar
// Promise-related functions like Promise.race,Promise.any, Promise.allSettled,
// etc.

// Solution There are a few aspects to this question we need to bear in mind and
// handle:

// Promises are meant to be chained, so the function needs to return a Promise.
// If the input array is empty, the returned Promise resolves with an empty
// array. The returned Promise contains an array of resolved values in the same
// order as the input if all of them are fulfilled. The returned Promise rejects
// immediately if any of the input values are rejected or throw an error. The
// input array can contain non-Promises.

// Solution 1: Count unresolved promises using async Since the function needs to
// return a Promise, we can construct a Promise at the top level of the function
// and return it. The bulk of the code will be written within the constructor
// parameter.

// We first check if the input array is empty, and resolve with an empty array
// if so.

// We then need to attempt resolving every item in the input array. This can be
// achieved using Array.prototype.forEach or Array.prototype.map. As the
// returned values will need to preserve the order of the input array, we create
// a results array and slot the value in the right place using its index within
// the input array. To know when all the input array values have been resolved,
// we keep track of how many unresolved promises there are by initializing a
// counter of unresolved values and decrementing it whenever a value is
// resolved. When the counter reaches 0, we can return the results array.

// One thing to note here is that because the input array can contain
// non-Promise values, if we are not await-ing them, we need to wrap each value
// with Promise.resolve() which allows us to use .then() on each of them and we
// don't have to differentiate between Promise vs non-Promise values and whether
// they need to be resolved.

// Lastly, if any of the values are rejected, we reject the top-level Promise
// immediately without waiting for any other pending promises.

/**
 * @param {Array} iterable
 * @return {Promise<Array>}
 */
export default function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach(async (item, index) => {
      try {
        const value = await item;
        results[index] = value;
        unresolved -= 1;

        if (unresolved === 0) {
          resolve(results);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}
