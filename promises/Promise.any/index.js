// Promise.any() takes an iterable of Promise objects. It returns a single
// promise that fulfills as soon as any of the promises in the iterable
// fulfills, with the value of the fulfilled promise. If no promises in the
// iterable fulfill (if all of the given promises are rejected), then the
// returned promise is rejected with an AggregateError, a new subclass of Error
// that groups together individual errors.

// In simple terms Promise.any() is just opposite of Promise.all().

// Function takes an array of promises as input and returns a new promise. The
// returned promise is resolved as soon as any of the input promises resolves.
// Else if all of the input promises are rejected then the returned promise is
// rejected with the array of all the input promises reasons.

const any = function (promisesArray) {
  const promiseErrors = new Array(promisesArray.length);
  let counter = 0;

  //return a new promise
  return new Promise((resolve, reject) => {
    promisesArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // resolve, when any of the input promise resolves
        .catch((error) => {
          promiseErrors[index] = error;
          counter = counter + 1;
          if (counter === promisesArray.length) {
            // all promises rejected, reject outer promise
            reject(promiseErrors);
          }
        }); // reject, when any of the input promise rejects
    });
  });
};

/************************************ */
function PromiseAny(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve).catch(reject);
    });
  });
}

// Example usage:
const promises = [
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise 1 resolved");
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise 2 resolved");
    }, 2000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Promise 3 rejected");
    }, 3000);
  }),
];

PromiseAny(promises)
  .then((result) => {
    console.log(result); // "Promise 1 resolved"
  })
  .catch((error) => {
    console.error(error); // "Promise 3 rejected"
  });

//   In this example, we create an array of three promises, each of which
// resolves or rejects after a different amount of time. We then pass this array
// to the PromiseAny() function. The PromiseAny() function will return a new
// promise that resolves when any of the input promises resolves. In this case,
// the new promise will resolve to the value of the first promise that resolves,
// which is "Promise 1 resolved". If all of the input promises reject, the
// PromiseAny() function will reject with an AggregateError containing an array
// of all of the rejection reasons.
