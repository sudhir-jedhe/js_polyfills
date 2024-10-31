Promise.prototype.finally = function (callback) {
  if (typeof callback !== "function") {
    return this.then(callback, callback);
  }
  // get the current promise or a new one
  const P = this.constructor || Promise;

  // return the promise and call the callback function
  // as soon as the promise is rejected or resolved with its value
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (err) =>
      P.resolve(callback()).then(() => {
        throw err;
      })
  );
};


/********************
 * 
 */

if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
      // Ensure the callback is callable
      if (typeof callback !== 'function') {
          throw new TypeError('callback must be a function');
      }

      // Reference the original promise
      const promise = this;

      return promise.then(
          value => {
              return Promise.resolve(callback()).then(() => value);
          },
          reason => {
              return Promise.resolve(callback()).then(() => { throw reason; });
          }
      );
  };
}

// Example usage:
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Success!"), 1000);
});

myPromise
  .then(result => {
      console.log(result); // Output: "Success!"
  })
  .finally(() => {
      console.log("Cleanup or final action"); // Always executed
  });



  /*********************
   * 
   * 
   */

  if (!Promise.prototype.finally) {
    Promise.prototype.finally = function(callback) {
        // Check if callback is a function
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        // Reference the original promise
        const promise = this;

        // Return a new promise
        return new Promise((resolve, reject) => {
            promise
                .then(value => {
                    // Execute the callback and resolve with the value
                    return Promise.resolve(callback()).then(() => resolve(value));
                })
                .catch(reason => {
                    // Execute the callback and reject with the reason
                    return Promise.resolve(callback()).then(() => reject(reason));
                });
        });
    };
}

// Example usage:
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Success!"), 1000);
});

myPromise
    .then(result => {
        console.log(result); // Output: "Success!"
    })
    .finally(() => {
        console.log("Cleanup or final action"); // Always executed
    });
