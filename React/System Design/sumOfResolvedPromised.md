# Sum of All Resolved Promises

This is a very common **JavaScript Promise interview question**.

## Problem

Given:

```js
const promises = [
  Promise.resolve(10),
  Promise.resolve(20),
  Promise.resolve(30),
];
```

Output:

```js
60;
```

---

## Approach 1: Using `Promise.all()`

### Code

```js
async function sumResolvedPromises(promises) {
  const values = await Promise.all(promises);

  return values.reduce((sum, current) => sum + current, 0);
}
```

### Usage

```js
const promises = [
  Promise.resolve(10),
  Promise.resolve(20),
  Promise.resolve(30),
];

sumResolvedPromises(promises).then(console.log);
```

### Output

```txt
60
```

---

## How It Works

### Step 1

```js
await Promise.all(promises);
```

Result:

```js
[10, 20, 30];
```

---

### Step 2

```js
reduce();
```

Calculation:

```txt
0 + 10 = 10
10 + 20 = 30
30 + 30 = 60
```

Result:

```txt
60
```

---

## Time Complexity

Let:

```txt
n = number of promises
```

```txt
Promise.all() → O(n)
Reduce        → O(n)

Total         → O(n)
```

---

## Approach 2: Ignore Failed Promises

Interview follow-up:

> Sum only resolved promises and ignore rejected ones.

---

### Using Promise.allSettled

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  return results.reduce((sum, result) => {
    if (result.status === "fulfilled") {
      return sum + result.value;
    }

    return sum;
  }, 0);
}
```

---

### Usage 1

```js
const promises = [
  Promise.resolve(10),
  Promise.reject("Error"),
  Promise.resolve(30),
];

sumResolvedPromises(promises).then(console.log);
```

---

### Output 1

```txt
40
```

Because:

```txt
10 + 30
```

Only fulfilled promises are used.

---

## Approach 3: Sequential Processing

Sometimes interviewers ask:

> Sum promises one by one.

---

### Code 1

```js
async function sumPromises(promises) {
  let total = 0;

  for (const promise of promises) {
    total += await promise;
  }

  return total;
}
```

---

### Execution

```txt
Wait Promise 1
↓
Wait Promise 2
↓
Wait Promise 3
```

---

### Drawback

Sequential execution is slower than:

```js
Promise.all();
```

because promises are awaited one after another.

---

## Advanced Version

Promises may resolve after different delays.

```js
const promises = [
  new Promise((resolve) => setTimeout(() => resolve(10), 1000)),

  new Promise((resolve) => setTimeout(() => resolve(20), 500)),

  new Promise((resolve) => setTimeout(() => resolve(30), 200)),
];
```

### Solution

```js
async function sumPromises(promises) {
  const values = await Promise.all(promises);

  return values.reduce((sum, value) => sum + value, 0);
}
```

Output:

```txt
60
```

---

# Interview Optimised Solution

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  return results
    .filter((result) => result.status === "fulfilled")
    .reduce((sum, result) => sum + result.value, 0);
}
```

## Example 1

```js
const promises = [
  Promise.resolve(5),
  Promise.resolve(10),
  Promise.reject("Failed"),
  Promise.resolve(15),
];

sumResolvedPromises(promises).then(console.log);
```

Output:

```txt
30
```

---

# Interview Follow-Up Questions

### Difference between Promise.all and Promise.allSettled?

**Promise.all**

```txt
Fails immediately if any promise rejects
```

```js
Promise.all([Promise.resolve(1), Promise.reject("Error")]);
```

Result:

```txt
Rejected
```

---

**Promise.allSettled**

```txt
Waits for all promises
```

Result:

```js
[
  { status: "fulfilled", value: 1 },
  { status: "rejected", reason: "Error" },
];
```

---

# Senior-Level Interview Answer

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  return results.reduce(
    (sum, result) => (result.status === "fulfilled" ? sum + result.value : sum),
    0,
  );
}
```

**Explanation:** This solution waits for all promises to settle, ignores rejected promises, and sums only fulfilled values. It is resilient to failures and runs in **O(n)** time complexity, making it suitable for real-world asynchronous processing scenarios.

## Sum Only Fulfilled Promises (Ignore Rejections)

The best solution is to use `Promise.allSettled()` because it waits for **all promises** and gives the status of each promise.

### Implementation

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  return results.reduce((sum, result) => {
    if (result.status === "fulfilled") {
      return sum + result.value;
    }

    return sum;
  }, 0);
}
```

---

## Example with Mixed Success & Failure

```js
const promises = [
  Promise.resolve(10),
  Promise.reject("API Error"),
  Promise.resolve(20),
  Promise.resolve(30),
  Promise.reject("Network Error"),
];

sumResolvedPromises(promises).then(console.log);
```

### Output

```txt
60
```

Because:

```txt
10 + 20 + 30 = 60
```

Rejected promises are ignored.

---

# Example with Different Delays

This is a very common interview follow-up.

```js
function delayResolve(value, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Resolved ${value}`);
      resolve(value);
    }, delay);
  });
}

function delayReject(message, delay) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      console.log(`Rejected ${message}`);
      reject(message);
    }, delay);
  });
}
```

---

## Input

```js
const promises = [
  delayResolve(10, 3000), // 3 sec
  delayResolve(20, 1000), // 1 sec
  delayReject("Failed", 2000), // 2 sec
  delayResolve(30, 500), // 0.5 sec
];
```

---

## Sum Function

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  return results.reduce((sum, result) => {
    return result.status === "fulfilled" ? sum + result.value : sum;
  }, 0);
}
```

---

## Execute

```js
sumResolvedPromises(promises).then((total) => {
  console.log("Total:", total);
});
```

---

## Execution Timeline

```txt
0.5 sec  -> Resolved 30
1 sec    -> Resolved 20
2 sec    -> Rejected Failed
3 sec    -> Resolved 10

Total: 60
```

Even though promises finish in different orders:

```txt
30
20
Rejected
10
```

`Promise.allSettled()` waits for **all of them**.

---

# Interview Optimised Version

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  const fulfilledValues = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return fulfilledValues.reduce((sum, value) => sum + value, 0);
}
```

### Example

```js
const promises = [
  Promise.resolve(5),
  Promise.reject("Error"),
  Promise.resolve(15),
  Promise.resolve(25),
];

sumResolvedPromises(promises).then(console.log);
```

Output:

```txt
45
```

---

# Interview Follow-up: Why Not `Promise.all()`?

### Using Promise.all

```js
await Promise.all([
  Promise.resolve(10),
  Promise.reject("Error"),
  Promise.resolve(20),
]);
```

Output:

```txt
Rejected immediately
```

The entire operation fails.

---

### Using Promise.allSettled

```js
await Promise.allSettled([
  Promise.resolve(10),
  Promise.reject("Error"),
  Promise.resolve(20),
]);
```

Output:

```js
[
  { status: "fulfilled", value: 10 },
  { status: "rejected", reason: "Error" },
  { status: "fulfilled", value: 20 },
];
```

Now you can safely calculate:

```txt
10 + 20 = 30
```

---

## Senior-Level Interview Answer

```js
async function sumResolvedPromises(promises) {
  const results = await Promise.allSettled(promises);

  return results.reduce(
    (sum, result) => (result.status === "fulfilled" ? sum + result.value : sum),
    0,
  );
}
```

**Complexity**

```txt
Time Complexity: O(n)
Space Complexity: O(n)
```

Where `n` is the number of promises. This solution is preferred because it gracefully handles failures while still processing and summing all successfully resolved promises.

## 1. Handle Rejected Promises Separately

Sometimes interviewers ask:

> Sum fulfilled promises, but also return rejected promises separately.

### Implementation

```js
async function processPromises(promises) {
  const results = await Promise.allSettled(promises);

  const summary = {
    sum: 0,
    fulfilled: [],
    rejected: [],
  };

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      summary.sum += result.value;

      summary.fulfilled.push({
        index,
        value: result.value,
      });
    } else {
      summary.rejected.push({
        index,
        reason: result.reason,
      });
    }
  });

  return summary;
}
```

### Usage

```js
const promises = [
  Promise.resolve(10),
  Promise.reject("Network Error"),
  Promise.resolve(20),
  Promise.reject("API Error"),
  Promise.resolve(30),
];

processPromises(promises).then(console.log);
```

### Output

```js
{
  sum: 60,

  fulfilled: [
    { index: 0, value: 10 },
    { index: 2, value: 20 },
    { index: 4, value: 30 }
  ],

  rejected: [
    { index: 1, reason: "Network Error" },
    { index: 3, reason: "API Error" }
  ]
}
```

---

# 2. Sum Promises with Concurrency Control

## Problem

Suppose:

```txt
1000 Promises
```

Using:

```js
Promise.all(promises);
```

starts all promises immediately.

This can overload:

```txt
API Server
Database
Rate Limits
```

---

## Requirement

Run only:

```txt
2 promises at a time
```

---

## Helper

```js
function delayResolve(value, delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Resolved ${value}`);

        resolve(value);
      }, delay);
    });
}
```

---

## Concurrency-Controlled Sum

```js
async function sumWithConcurrency(tasks, concurrency = 2) {
  let total = 0;
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const current = index++;

      try {
        const value = await tasks[current]();

        total += value;
      } catch (error) {
        console.error("Task Failed:", error);
      }
    }
  }

  const workers = Array(concurrency)
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return total;
}
```

---

## Usage

```js
const tasks = [
  delayResolve(10, 1000),
  delayResolve(20, 2000),
  delayResolve(30, 500),
  delayResolve(40, 1500),
];

sumWithConcurrency(tasks, 2).then(console.log);
```

### Execution

```txt
Worker1 -> 10
Worker2 -> 20

10 complete

Worker1 -> 30

30 complete

Worker1 -> 40

20 complete

40 complete

Total = 100
```

---

# 3. Log Actual Promise Resolution Order

Interview Question:

> Log promises in the order they resolve, not the order they were created.

---

## Example

```js
const p1 = new Promise((resolve) => setTimeout(() => resolve("A"), 3000));

const p2 = new Promise((resolve) => setTimeout(() => resolve("B"), 1000));

const p3 = new Promise((resolve) => setTimeout(() => resolve("C"), 2000));
```

Created:

```txt
A
B
C
```

But resolved:

```txt
B
C
A
```

---

## Log Resolution Order

```js
function trackResolution(promise, name) {
  promise.then((value) => {
    console.log(`${name} resolved => ${value}`);
  });

  return promise;
}

const tracked = [
  trackResolution(p1, "P1"),
  trackResolution(p2, "P2"),
  trackResolution(p3, "P3"),
];

Promise.allSettled(tracked).then(() => {
  console.log("All Done");
});
```

### Output

```txt
P2 resolved => B
P3 resolved => C
P1 resolved => A

All Done
```

---

# Advanced: Capture Resolution Order Array

Sometimes the interviewer wants:

```js
["B", "C", "A"];
```

---

### Implementation

```js
async function getResolutionOrder(promises) {
  const order = [];

  promises.forEach((promise) => {
    promise.then((value) => {
      order.push(value);
    });
  });

  await Promise.allSettled(promises);

  return order;
}
```

---

### Usage

```js
const order = await getResolutionOrder([p1, p2, p3]);

console.log(order);
```

Output:

```js
["B", "C", "A"];
```

---

# Most Complete Interview Solution

```js
async function processPromises(tasks, concurrency = 3) {
  let sum = 0;
  let index = 0;

  const resolvedOrder = [];
  const rejected = [];

  async function worker() {
    while (index < tasks.length) {
      const current = index++;

      try {
        const value = await tasks[current]();

        resolvedOrder.push(value);

        sum += value;
      } catch (error) {
        rejected.push(error.message);
      }
    }
  }

  const workers = Array(concurrency)
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return {
    sum,
    resolvedOrder,
    rejected,
  };
}
```

### Output

```js
{
  sum: 100,

  resolvedOrder: [
    30,
    10,
    20,
    40
  ],

  rejected: [
    "Network Error"
  ]
}
```

---

## Senior Interview Answer

> To handle rejected promises separately, I use `Promise.allSettled()` and partition results into fulfilled and rejected collections. For large promise sets, I introduce concurrency control using a worker-pool pattern so that only a limited number of promises execute simultaneously. To capture actual completion order, I attach handlers to each promise and store results as they resolve rather than relying on creation order. This pattern is commonly used in file uploads, API batching, background job processing, and async task schedulers.
