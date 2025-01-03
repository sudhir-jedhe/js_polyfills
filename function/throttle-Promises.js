// If you use Promise.all(), 100 requests go to your server at the same time, which is a burden to low spec servers.

// Can you throttle your API calls so that always maximum 5 API calls at the same time?

// You are asked to create a general throttlePromises() which takes an array of functions returning promises, and a number indicating the maximum concurrent pending promises.

throttleAsync(callApis, 5)
  .then((data) => {
    // the data is the same as `Promise.all`
  })
  .catch((err) => {
    // any error occurs in the callApis would be relayed here
  });
//   By running above code, at any time, no more than 5 APIs are requested, so low spec servers are saved.

//   Related Problems

/**
 * @param {() => Promise<any>} func
 * @param {number} max
 * @return {Promise}
 */
function throttlePromises(funcs, max) {
  return new Promise((resolve, reject) => {
    let concurrentCount = 0;
    let latestCalledFuncIndex = -1;
    let resultCount = 0;
    let hasError = false;
    const result = [];

    const fetchNext = () => {
      // already done
      if (hasError || latestCalledFuncIndex === funcs.length - 1) {
        return;
      }
      // get the func
      // trigger
      // update the count
      // if ok for next fetch, trigger next

      const nextFuncIndex = latestCalledFuncIndex + 1;
      const next = funcs[nextFuncIndex];

      concurrentCount += 1;
      latestCalledFuncIndex += 1;

      next().then(
        (data) => {
          result[nextFuncIndex] = data;
          resultCount += 1;
          concurrentCount -= 1;

          if (resultCount === funcs.length) {
            resolve(result);
            return;
          }

          fetchNext();
        },
        (err) => {
          hasError = true;
          reject(err);
        }
      );

      if (concurrentCount < max) {
        fetchNext();
      }
    };

    fetchNext();
  });
}

/**************************************** */

/**
 * @param {() => Promise<any>} func
 * @param {number} max
 * @return {Promise}
 */
function throttlePromises(funcs, max) {
  const results = [];
  async function doWork(iterator) {
    for (let [index, item] of iterator) {
      const result = await item();
      results[index] = result;
    }
  }
  const iterator = Array.from(funcs).entries();
  const workers = Array(max).fill(iterator).map(doWork); // maps over asynchronous fn doWork, which returns array of results for each promise
  return Promise.all(workers).then(() => results);
}

/*********************************** */

async function throttlePromises(funcs, max) {
  const res = [];
  while (funcs.length) {
    const values = await Promise.all(funcs.splice(0, max).map((f) => f()));
    res.push(...values);
  }
  return res;
}

/************************** */
async function throttlePromises(arr, max) {
  let data = [];
  const len = arr.length;
  while (data.length < len) {
    try {
      let vals = await Promise.all(arr.splice(0, max).map((fn) => fn()));
      data.push(...vals);
    } catch (err) {
      throw err;
    }
  }
  return data;
}


/****************************** */
// js  Implement a throttle function with a cancel method.

function throttle(func, delay) {
  let timer;

  function throttledFunction() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(func, delay);
  }

  throttledFunction.cancel = function() {
    clearTimeout(timer);
  };

  return throttledFunction;
}

// Example usage:

const throttledFunction = throttle(() => {
  console.log('Function throttled!');
}, 1000);

throttledFunction(); // Logs 'Function throttled!'
throttledFunction(); // Does not log anything, because the function is throttled

// Cancel the throttled function:

throttledFunction.cancel();

// Now the function can be called again:

throttledFunction(); // Logs 'Function throttled!'





function throttle(func, interval) {
  let timeoutId;
  let lastArgs;
  let lastTime = 0;
  let shouldCallNow = false;

  function throttled(...args) {
      const now = Date.now();

      if (!timeoutId && !shouldCallNow) {
          shouldCallNow = true;
          func.apply(this, args);
          lastTime = now;
      } else {
          lastArgs = args;
          const remaining = lastTime + interval - now;
          if (remaining <= 0) {
              clearTimeout(timeoutId);
              timeoutId = null;
              lastTime = now;
              func.apply(this, lastArgs);
          } else if (!timeoutId) {
              timeoutId = setTimeout(() => {
                  timeoutId = null;
                  lastTime = Date.now();
                  func.apply(this, lastArgs);
              }, remaining);
          }
      }
  }

  // Method to cancel the throttle
  throttled.cancel = function() {
      clearTimeout(timeoutId);
      timeoutId = null;
      shouldCallNow = false;
  };

  return throttled;
}


// Example usage
function sayHello(name) {
  console.log(`Hello, ${name}!`);
}

const throttledHello = throttle(sayHello, 1000);

throttledHello('Alice'); // This will execute immediately
throttledHello('Bob');   // This will be ignored (throttled)
throttledHello('Charlie'); // This will be ignored (throttled)

setTimeout(() => throttledHello('Dave'), 500); // This will be ignored (throttled)

// Cancel the pending execution
throttledHello.cancel();

// No function will be executed after cancellation
throttledHello('Eve'); // This will execute immediately
