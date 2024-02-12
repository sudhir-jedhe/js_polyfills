class PromisePool {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.runningCount = 0;
    this.queue = [];
  }

  add(promiseGenerator) {
    return new Promise((resolve, reject) => {
      const runNext = () => {
        if (this.queue.length === 0) {
          this.runningCount--;
          if (this.runningCount === 0) {
            resolve(); // All promises have finished
          }
          return;
        }

        const nextPromise = this.queue.shift();
        nextPromise()
          .then(() => {
            runNext();
          })
          .catch((error) => {
            reject(error);
          });
      };

      const runNow = () => {
        if (this.runningCount < this.concurrency) {
          this.runningCount++;
          promiseGenerator()
            .then(() => {
              runNext();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          this.queue.push(promiseGenerator);
        }
      };

      runNow();
    });
  }
}

// Example usage:

// Create a promise pool with concurrency limit of 2
const pool = new PromisePool(2);

// Define a promise generator function
const promiseGenerator = () => {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation
    setTimeout(() => {
      console.log("Task completed");
      resolve();
    }, 1000);
  });
};

// Add promises to the pool
pool.add(promiseGenerator);
pool.add(promiseGenerator);
pool.add(promiseGenerator);
pool.add(promiseGenerator);

// Output:
// Task completed
// Task completed
// Task completed
// Task completed
