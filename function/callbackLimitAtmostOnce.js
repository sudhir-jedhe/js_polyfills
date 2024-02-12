export const callbackAtMostOnce = (callback) => {
  let called = false;

  return function (...args) {
    if (!called) {
      called = true;
      return callback(...args);
    }
  };
};

const callback = (a, b) => console.log(a + b);
const callbackAtMostOnce = callbackAtMostOnce(callback);
callbackAtMostOnce(1, 2); // logs 3
callbackAtMostOnce(3, 4); // does nothing
