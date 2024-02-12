export const callbackAtMostN = (callback, n) => {
  let count = 0;

  return function (...args) {
    if (count < n) {
      count++;
      return callback(...args);
    }
    return undefined;
  };
};

const callback = (a, b) => console.log(a + b);
const callbackAtMostTwo = callbackAtMostN(callback, 2);
callbackAtMostTwo(1, 2); // logs 3
callbackAtMostTwo(3, 4); // logs 7
callbackAtMostTwo(5, 6); // does nothing
