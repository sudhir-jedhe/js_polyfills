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
