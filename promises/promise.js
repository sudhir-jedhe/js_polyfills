/*******************************Implement Promise Polyfill  *****************************************/
function MyPromise(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("Executor must be a function.");
  }

  this.state = "pending";
  this.value = undefined;
  this.handlers = [];

  const resolve = (value) => {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.handlers.forEach((handler) => handler.onFulfilled(value));
    }
  };

  const reject = (reason) => {
    if (this.state === "pending") {
      this.state = "rejected";
      this.value = reason;
      this.handlers.forEach((handler) => handler.onRejected(reason));
    }
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  return new MyPromise((resolve, reject) => {
    const handle = (handler) => {
      try {
        const result = handler(this.value);
        if (result instanceof MyPromise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    };

    if (this.state === "fulfilled") {
      handle(onFulfilled);
    } else if (this.state === "rejected") {
      handle(onRejected);
    } else {
      this.handlers.push({
        onFulfilled: (value) => handle(onFulfilled),
        onRejected: (reason) => handle(onRejected),
      });
    }
  });
};

// Example usage:

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved!");
  }, 1000);
});

promise.then(
  (result) => {
    console.log(result); // Output: Promise resolved!
  },
  (error) => {
    console.error(error);
  }
);

/******************************************************************* */
///Where is rejected property stored for a Promise in JavaScript ?
// shows the rejected state of a promise along with a certain message passed inside the reject() method
// e promise’s internal object’s property named PromiseState,
//  the rejected property of the promise is stored, and later when we have
// implemented catch in order to make our promise fulfilled then that PromiseState property’s value becomes Fulfilled

let new_promise = new Promise((resolve, reject) => {
  resolve("This topic is available on " + "GeeksforGeeks platform...!!");
});

new_promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

let new_promise = new Promise((resolve, reject) => {
  reject("Rejected Promise...!!");
});

new_promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

/******************************************************************** */
//How to call promise inside another promise in JavaScript
// This is a JavaScript Quiz from BFE.dev

console.log(1);

document.body.addEventListener("click", () => {
  console.log(2);
});

Promise.resolve().then(() => {
  console.log(3);
});

setTimeout(() => {
  console.log(4);
}, 0);

console.log(5);

document.body.click();

console.log(6);
