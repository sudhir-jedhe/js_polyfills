
/*******************************Implement Promise Polyfill  *****************************************/
function MyPromise(executor) {
    if (typeof executor !== 'function') {
        throw new TypeError('Executor must be a function.');
    }
  
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];
  
    const resolve = (value) => {
        if (this.state === 'pending') {
            this.state = 'fulfilled';
            this.value = value;
            this.handlers.forEach(handler => handler.onFulfilled(value));
        }
    };
  
    const reject = (reason) => {
        if (this.state === 'pending') {
            this.state = 'rejected';
            this.value = reason;
            this.handlers.forEach(handler => handler.onRejected(reason));
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
  
        if (this.state === 'fulfilled') {
            handle(onFulfilled);
        } else if (this.state === 'rejected') {
            handle(onRejected);
        } else {
            this.handlers.push({
                onFulfilled: (value) => handle(onFulfilled),
                onRejected: (reason) => handle(onRejected)
            });
        }
    });
  };
  
  // Example usage:
  
  const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise resolved!');
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
  