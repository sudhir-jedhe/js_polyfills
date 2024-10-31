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

/************************************************ */
// Promise is widely used nowadays, hard to think how we handled Callback Hell in the old times.

// Can you implement a MyPromise Class by yourself?

// At least it should match following requirements

// new promise: new MyPromise((resolve, reject) => {})
// chaining : MyPromise.prototype.then() then handlers should be called asynchronously
// rejection handler: MyPromise.prototype.catch()
// static methods: MyPromise.resolve(), MyPromise.reject().
// This is a challenging problem. Recommend you read about Promise thoroughly first.

class MyPromise {
  status = "pending";
  value;
  pendingCallbacks = [];

  constructor(executor) {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  fulFill(onFulfilled) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => this.value;
    }
    try {
      const fullfilledRet = onFulfilled(this.value);
      fullfilledRet instanceof MyPromise
        ? this.replacePromise(fullfilledRet)
        : (this.value = fullfilledRet);
    } catch (err) {
      this.status = "rejected";
      this.value = err;
    }
  }

  rej(onRejected) {
    if (typeof onFulfilled === "function" && typeof onRejected !== "function")
      return this;
    if (typeof onRejected !== "function") {
      onRejected = () => this.value;
    }
    try {
      const rejectRet = onRejected(this.value);
      rejectRet instanceof MyPromise
        ? this.replacePromise(rejectRet)
        : (this.value = rejectRet);
      this.status = "fulfilled";
    } catch (err) {
      this.status = "rejected";
      this.value = err;
    }
  }

  then(onFulfilled, onRejected) {
    queueMicrotask(() => {
      switch (this.status) {
        case "fulfilled":
          this.fulFill(onFulfilled);
          break;
        case "rejected":
          if (typeof onRejected === "function") this.rej(onRejected);
          break;
        case "pending":
          this.pendingCallbacks.push({ type: "then", onFulfilled, onRejected });
          return this;
      }
    });
    return this;
  }

  catch(onRejected) {
    queueMicrotask(() => {
      if (this.status === "rejected") {
        this.rej(onRejected);
      } else if (this.status === "pending") {
        this.pendingCallbacks.push({ type: "catch", onRejected });
      }
    });
    return this;
  }

  replacePromise(p) {
    this.pendingCallbacks = p.pendingCallbacks;
    this.value = p.value;
    this.status = p.status;
    for (const key of Object.keys(MyPromise.prototype)) {
      if (typeof this[key] === "function") {
        this[key] = this[key].bind(p);
      }
    }
  }

  resolve(value) {
    this.resolve = () => null;
    this.status = "fulfilled";
    this.value = value;
    for (const { type, onFulfilled, onRejected } of this.pendingCallbacks) {
      if (type === "then") {
        this.fulFill(onFulfilled);
        if (this.status === "rejected") {
          return this.reject(this.reason);
        }
      }
    }
    this.pendingCallbacks.length = 0;
  }

  reject(reason) {
    this.reject = () => null;
    this.status = "rejected";
    this.value = reason;
    for (const { type, onFulfilled, onRejected } of this.pendingCallbacks) {
      if (type === "catch") {
        this.rej(onRejected);
        if (this.status === "fulfilled") {
          return this.resolve(this.value);
        }
      }
    }
    this.pendingCallbacks.length = 0;
  }

  static resolve(value) {
    return new MyPromise((res) => res(value));
  }

  static reject(value) {
    return new MyPromise((res, rej) => rej(value));
  }
}

/***************************************** */

class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.handlers = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handlers.push({
        fulfilled: (value) => {
          if (typeof onFulfilled !== "function") {
            resolve(value);
            return;
          }
          try {
            resolve(onFulfilled(value));
          } catch (err) {
            reject(err);
          }
        },
        rejected: (error) => {
          if (typeof onRejected !== "function") {
            reject(error);
            return;
          }

          try {
            resolve(onRejected(error));
          } catch (err) {
            reject(err);
          }
        },
      });

      this._executeHandlers();
    });
  }

  _executeHandlers() {
    if (this.state === "pending") return;
    for (const handler of this.handlers) {
      queueMicrotask(() => {
        handler[this.state](this.result);
      });
    }

    this.handlers = [];
  }

  _resolve(value) {
    if (this.state !== "pending") return;
    if (value instanceof MyPromise) {
      value.then(this._resolve.bind(this), this._reject.bind(this));
      return;
    }

    this.state = "fulfilled";
    this.result = value;
    this._executeHandlers();
  }

  _reject(error) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.result = error;
    this._executeHandlers();
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
}

/*************************************************** */
class MyPromise {
  constructor(executor) {
    this._state = "pending";
    this._callbacks = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve(value) {
    if (this._state !== "pending") return;
    this._state = "fulfilled";
    this._result = value;
    this._handleSettled("onFulfilled");
  }

  _reject(err) {
    if (this._state !== "pending") return;
    this._state = "rejected";
    this._result = err;
    this._handleSettled("onRejected");
  }

  _handleSettled(onSettled) {
    queueMicrotask(() => {
      for (const cb of this._callbacks) {
        try {
          const returned = cb[onSettled](this._result);
          if (returned instanceof MyPromise) {
            returned.then(cb.resolve, cb.reject);
          } else {
            cb.resolve(returned);
          }
        } catch (err) {
          cb.reject(err);
        }
      }
    });
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._callbacks.push({
        onFulfilled: onFulfilled ?? ((value) => value),
        onRejected:
          onRejected ??
          ((err) => {
            throw err;
          }),
        resolve,
        reject,
      });
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((res) => res(value));
  }

  static reject(err) {
    return new MyPromise((_, rej) => rej(err));
  }
}

/**************************************** */

class CustomPromise {
  constructor(executor) {
      this.state = 'pending'; // initial state
      this.value = undefined; // resolved value
      this.reason = undefined; // rejection reason
      this.onFulfilledCallbacks = []; // array for success callbacks
      this.onRejectedCallbacks = []; // array for failure callbacks

      const resolve = (value) => {
          if (this.state === 'pending') {
              this.state = 'fulfilled';
              this.value = value;
              this.onFulfilledCallbacks.forEach(callback => callback(value));
          }
      };

      const reject = (reason) => {
          if (this.state === 'pending') {
              this.state = 'rejected';
              this.reason = reason;
              this.onRejectedCallbacks.forEach(callback => callback(reason));
          }
      };

      try {
          executor(resolve, reject);
      } catch (error) {
          reject(error); // handle synchronous errors
      }
  }

  then(onFulfilled, onRejected) {
      return new CustomPromise((resolve, reject) => {
          const handleFulfilled = () => {
              try {
                  const result = onFulfilled ? onFulfilled(this.value) : this.value;
                  resolve(result);
              } catch (error) {
                  reject(error);
              }
          };

          const handleRejected = () => {
              try {
                  const result = onRejected ? onRejected(this.reason) : this.reason;
                  resolve(result);
              } catch (error) {
                  reject(error);
              }
          };

          if (this.state === 'fulfilled') {
              handleFulfilled();
          } else if (this.state === 'rejected') {
              handleRejected();
          } else {
              this.onFulfilledCallbacks.push(handleFulfilled);
              this.onRejectedCallbacks.push(handleRejected);
          }
      });
  }

  catch(onRejected) {
      return this.then(null, onRejected);
  }
}

// Example usage
const promise = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
      const success = true; // Change to false to simulate rejection
      if (success) {
          resolve('Promise resolved successfully!');
      } else {
          reject('Promise rejected.');
      }
  }, 1000);
});

promise
  .then(result => {
      console.log(result); // Output on success
      return 'Chained success!';
  })
  .then(chainedResult => {
      console.log(chainedResult); // Output from the chained promise
  })
  .catch(error => {
      console.error(error); // Output on error
  });
