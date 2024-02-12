// You are asked to implement an async function helper, parallel() which works
// like Promise.all(). Different from sequence(), the async function doesn't
// wait for each other, rather they are all triggered together.

// All async functions have following interface

type Callback = (error: Error, data: any) => void;

type AsyncFunc = (callback: Callback, data: any) => void;

// Your parallel() should accept AsyncFunc array, and return a new function
// which triggers its own callback when all async functions are done or an error
// occurs.

// Suppose we have an 3 async functions

const async1 = (callback) => {
  callback(undefined, 1);
};

const async2 = (callback) => {
  callback(undefined, 2);
};

const async3 = (callback) => {
  callback(undefined, 3);
};

const all = parallel([async1, async2, async3]);

all((error, data) => {
  console.log(data); // [1, 2, 3]
}, 1);

/************************************** */
const promisify = (fn) => (input) =>
  new Promise((res, rej) => {
    fn((err, output) => (err ? rej(err) : res(output)), input);
  });

function parallel(fns) {
  return (cb, input) => {
    Promise.all(fns.map((fn) => promisify(fn)(input)))
      .then((outputs) => cb(undefined, outputs))
      .catch((err) => cb(err, undefined));
  };
}

/************************************************* */

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
function parallel(funcs) {
  let hasError = false,
    funcIndex = 0,
    result = [];

  return function (finalCallback, input) {
    funcs.forEach((func, idx) => {
      func((err, cbData) => {
        if (hasError) {
          return;
        }
        if (err) {
          hasError = true;
          finalCallback(err, undefined);
          return;
        }
        result[idx] = cbData;
        funcIndex++;
        if (funcIndex === funcs.length) {
          finalCallback(undefined, result);
        }
      });
    });
  };
}

/************************************ */

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
function parallel(funcs) {
  // your code here

  return function all(cb, initialValue) {
    let error;
    let result = [];
    const callback = (err, data) => {
      if (error) {
        return;
      }
      if (err) {
        error = err;
        cb(error, undefined);
        return;
      }
      result.push(data);
      if (result.length === funcs.length) {
        cb(undefined, result);
      }
    };
    funcs.find((func) => {
      if (error) return true;
      func.call(this, callback, initialValue);
    });
  };
}
// create a function parallel
// we will pass an array of async functions
// return a function
// that function will be called with final callback that's need to be executed
//after every async function is completed and in that call back we have pass final array of data
// if there is error while executing an asyn function we need again to call the callback function with error

/***************************************** */

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
function parallel(funcs) {
  // your code here
  return function (callback, data) {
    let res = [],
      isError = false;

    funcs.forEach((func, index) => {
      func(function (err, data) {
        if (!isError) {
          if (err) {
            isError = true;
            callback(err, undefined);
          }
          res[index] = data;
          if (Object.keys(res).length == funcs.length) callback(undefined, res);
        }
      });
    });
  };
}

const async1 = (callback) => {
  callback(undefined, 1);
};

const async2 = (callback) => {
  callback(undefined, 2);
};

const async3 = (callback) => {
  callback(undefined, 3);
};

const all = parallel([async1, async2, async3]);

all((error, data) => {
  console.log(data); // [1, 2, 3]
}, 1);
