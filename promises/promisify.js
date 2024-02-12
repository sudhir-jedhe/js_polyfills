const myPromisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      function customCallback(err, ...results) {
        if (err) {
          return reject(err);
        }
        return resolve(results.length === 1 ? results[0] : results);
      }
      args.push(customCallback);
      fn.call(this, ...args);
    });
  };
};

const getSumAsync = (num1, num2, callback) => {
  if (!num1 || !num2) {
    return callback(new Error("Missing dependencies"), null);
  }

  const sum = num1 + num2;
  const message = `Sum is ${sum}`;
  return callback(null, sum, message);
};
const getSumPromise = myPromisify(getSumAsync);
getSumPromise(2, 3).then(arrayOfResults); // [6, 'Sum is 6']

/********************** */

function promisify(func) {
  return function promisified(...args) {
    return new Promise((resolve, reject) => {
      func(...args, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });
  };
}

const readFile = promisify(fs.readFile);

readFile("./path/to/file")
  .then((data) => {
    // Do something with the data
  })
  .catch((error) => {
    // Handle the error
  });

// In this example, we use the promisify() function to create a new function
// called readFilePromise that returns a promise. We then call the
// readFilePromise() function and pass it the path to the file that we want to
// read. The readFilePromise() function will return a promise that will be
// resolved with the contents of the file, or rejected with an error object if
// the file cannot be read. We can then use the then() and catch() methods to
// handle the promise. The then() method will be called if the promise is
// resolved, and the catch() method will be called if the promise is rejected.
// The promisify() function can be used to convert any function that follows the
// common error-first callback style to a function that returns a promise. This
// can make it easier to write asynchronous code in JavaScript.

/************************************** */

// Implement a js promisify function that allows the original function to
// override the return value

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Example usage:

const originalFunction = (callback) => {
  // Do something asynchronous, and call the callback with the result.
  callback(null, "some result");
};

const promisifiedFunction = promisify(originalFunction);

promisifiedFunction().then((result) => {
  // Do something with the result.
});

// In this example, the originalFunction() function takes a callback as an
// argument, and calls it with the result of the asynchronous operation. The
// promisifiedFunction() function returns a Promise that resolves with the
// result of the original function. The promisifiedFunction() function allows
// the original function to override the return value by passing a custom
// callback to the promisify() function. The custom callback will be called with
// the result of the original function, and the promisifiedFunction() function
// will resolve with the return value of the custom callback.

const customCallback = (err, result) => {
  // Do something with the result, and return a new value.
  return "new result";
};

const promisifiedFunction = promisify(originalFunction, customCallback);

promisifiedFunction().then((result) => {
  // Do something with the new result.
});
