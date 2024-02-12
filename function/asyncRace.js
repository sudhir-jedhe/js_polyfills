// You are asked to implement an async function helper, race() which works like
// Promise.race(). Different from parallel() that waits for all functions to
// finish, race() will finish when any function is done or run into error.

// All async functions have following interface

type Callback = (error: Error, data: any) => void;

type AsyncFunc = (callback: Callback, data: any) => void;

const async1 = (callback) => {
  setTimeout(() => callback(undefined, 1), 300);
};

const async2 = (callback) => {
  setTimeout(() => callback(undefined, 2), 100);
};

const async3 = (callback) => {
  setTimeout(() => callback(undefined, 3), 200);
};

const first = race([async1, async2, async3]);

first((error, data) => {
  console.log(data); // 2, since 2 is the first to be given
}, 1);

// When error occurs, only first error is passed down to the last. Later errors or data are ignored.

/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/

/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function race(funcs) {
  let finished = false;
  return function (callback) {
    const callbackWrapper = (...args) => {
      if (finished) return;
      callback(...args);
      finished = true;
    };

    for (const func of funcs) {
      func(callbackWrapper);
    }
  };
}

/********************************** */
/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/

/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function race(funcs) {
  return function (cb) {
    let handled = false;
    funcs.forEach((func) => {
      func((e, v) => {
        if (!handled) {
          handled = true;
          cb(e, v);
        }
      });
    });
  };
}

/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/

/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function race(funcs) {
  let completed = false;

  return function (callback) {
    funcs.forEach((func) => {
      func((error, value) => {
        if (completed) {
          return;
        }

        if (error) {
          callback(error, undefined);
          completed = true;
          return;
        }

        callback(undefined, value);
        completed = true;
      });
    });
  };
}
