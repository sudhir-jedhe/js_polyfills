### 13. Implement `Promise.any` and `Promise.allSettled`

- **`Promise.any`**: This method takes an iterable of promises and resolves as soon as the first promise in the iterable resolves. If all promises reject, it will return an aggregate `AggregateError`.

```javascript
Promise.any = function(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;
    const total = promises.length;

    for (const promise of promises) {
      Promise.resolve(promise).then(resolve, (error) => {
        errors.push(error);
        rejectedCount++;
        if (rejectedCount === total) {
          reject(new AggregateError(errors, 'All promises were rejected.'));
        }
      });
    }
  });
};
```

- **`Promise.allSettled`**: This method returns a promise that resolves after all of the input promises have settled, either resolved or rejected.

```javascript
Promise.allSettled = function(promises) {
  return new Promise((resolve) => {
    let settledCount = 0;
    const results = [];

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          results[index] = { status: 'fulfilled', value };
        },
        (reason) => {
          results[index] = { status: 'rejected', reason };
        }
      ).finally(() => {
        settledCount++;
        if (settledCount === promises.length) {
          resolve(results);
        }
      });
    });
  });
};
```

---

### 15. Run N async tasks in series

To run multiple async tasks in series, you can use `Array.reduce()` to chain the promises one after another:

```javascript
async function runInSeries(tasks) {
  let result = [];
  for (const task of tasks) {
    result.push(await task());
  }
  return result;
}
```

This ensures each task runs after the previous one completes.

---

### 16. Execute N async tasks concurrently

To run multiple async tasks concurrently, simply use `Promise.all()`:

```javascript
async function runConcurrently(tasks) {
  const results = await Promise.all(tasks.map(task => task()));
  return results;
}
```

Each task will start as soon as possible, and `Promise.all` will wait for all of them to finish.

---

### 17. Execute N async tasks in a race condition

To implement a race condition, you can use `Promise.race()`:

```javascript
async function runInRace(tasks) {
  const result = await Promise.race(tasks.map(task => task()));
  return result;
}
```

`Promise.race` will resolve or reject as soon as the first promise resolves or rejects.

---

### 18. Throttle promises to limit API request rates

To throttle promises and limit the number of concurrent API requests, you can use a semaphore-like approach:

```javascript
async function throttlePromises(tasks, limit) {
  const result = [];
  const queue = [...tasks];
  const executing = [];

  async function runTask(task) {
    const promise = task().finally(() => {
      executing.splice(executing.indexOf(promise), 1);
    });
    executing.push(promise);
    await promise;
  }

  while (queue.length > 0 || executing.length > 0) {
    if (executing.length < limit && queue.length > 0) {
      const task = queue.shift();
      runTask(task);
    } else {
      await Promise.race(executing);
    }
  }
  
  return result;
}
```

This ensures that no more than `limit` requests run concurrently.

---

### 19. Cache identical API requests to avoid redundancy

For caching identical requests, you can store the results in a cache object or map:

```javascript
const cache = new Map();

async function cachedRequest(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}
```

This stores the results of API requests and avoids making the same request twice.

---

### 20. Retry a promise-based function a specified number of times

To implement a retry mechanism, you can wrap the function in a loop:

```javascript
async function retry(fn, retries = 3, delay = 1000) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}
```

This will retry the function up to `retries` times with a delay between attempts.

---

### 21. Implement a timeout for a promise

To implement a timeout, you can race the promise against a timeout:

```javascript
async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout exceeded')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
}
```

This will reject if the promise does not resolve within the specified `timeoutMs`.

---

### 22. Combine multiple promise-based functions, executing in parallel

To execute multiple promises in parallel, use `Promise.all()`:

```javascript
async function runParallel(tasks) {
  const results = await Promise.all(tasks.map(task => task()));
  return results;
}
```

Each function in the `tasks` array will run in parallel, and the results will be returned once all of them are completed.

---

These techniques cover a variety of scenarios in asynchronous programming, from handling multiple tasks concurrently or in series to adding more control over things like rate limiting, retries, and timeouts.