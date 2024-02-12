// Different from Promise.all() which rejects right away once an error occurs,
// Promise.allSettled() waits for all promises to settle.

/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  if (promises.length === 0) {
    return Promise.resolve([]);
  }

  const results = [];
  let completed = 0;
  return new Promise((resolve) => {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          results[i] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[i] = { status: "rejected", reason };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        });
    }
  });
}

/********************************* */

/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  // Using promise all
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => {
          return {
            status: "fulfilled",
            value,
          };
        },
        (reason) => {
          return {
            status: "rejected",
            reason,
          };
        }
      )
    )
  );
}

/*************************** */
/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  return new Promise((resolve) => {
    const result = [];
    let waitFor = promises.length;
    if (waitFor === 0) {
      resolve(result);
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => (result[index] = { status: "fulfilled", value }))
        .catch((reason) => (result[index] = { status: "rejected", reason }))
        .finally(() => {
          waitFor--;
          if (waitFor === 0) {
            resolve(result);
          }
        });
    });
  });
}

/****************************** */

/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
  // your code here
  const resolve = promises.reduce((acc, item) => {
    return acc.then((prev) => {
      return Promise.resolve(item)
        .then((ret) => {
          return [...prev, { status: "fulfilled", value: ret }];
        })
        .catch((error) => {
          return [...prev, { status: "rejected", reason: error }];
        });
    });
  }, Promise.resolve([]));

  return resolve;
}
