/*************************User Implement custom promise.all ************************ */

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new TypeError("Promises must be provided as an array."));
      return;
    }

    const results = [];
    let completedPromises = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          completedPromises++;

          if (completedPromises === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    // If the input array is empty, resolve immediately
    if (promises.length === 0) {
      resolve(results);
    }
  });
}

// Example usage:

const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 1 resolved"), 1000)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 2 resolved"), 500)
);
const promise3 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 3 resolved"), 200)
);

promiseAll([promise1, promise2, promise3])
  .then((results) => {
    console.log("Resolved:", results);
  })
  .catch((error) => {
    console.log("Rejected:", error);
  });
/********************************************* */
