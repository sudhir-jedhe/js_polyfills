/*************************User
Implement a function that accepts a callback and restricts its invocation to at most once************************ */
function once(callback) {
  let hasBeenCalled = false;

  return function (...args) {
    if (!hasBeenCalled) {
      hasBeenCalled = true;
      return callback(...args);
    } else {
      console.warn("Function already called!");
      // You can choose to do nothing, throw an error, or handle it in a different way.
    }
  };
}

// Example usage:

const callbackFunction = (message) => {
  console.log(message);
};

const callbackOnce = once(callbackFunction);

callbackOnce("This will be called once."); // Output: This will be called once.
callbackOnce("This will not be called."); // Output: Function already called!

/****************************************** */
function once(func) {
  let result = null;
  let isCalled = false;
  return function (...args) {
    if (!isCalled) {
      result = func.call(this, ...args);
      isCalled = true;
    }
    return result;
  };
}

/*************************************** */

function once(func) {
  let val;
  let called = false;

  return function onced(...args) {
    if (!called) {
      val = func.apply(this, args);
      called = true;
      return val;
    }

    return val;
  };
}

/********************************** */

function once(func) {
  let result = null;
  let isCalled = false;
  return function (...args) {
    if (isCalled) {
      return result;
    }

    result = func.call(this, ...args);
    isCalled = true;

    return result;
  };
}
