/******************************Throtlling *****************/
function throttle(func, delay) {
  let lastExecTime = 0;
  let timeoutId;

  return function (...args) {
    const currentTime = new Date().getTime();

    if (currentTime - lastExecTime >= delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = currentTime;
      }, delay);
    }
  };
}

// The throttling function forces a function to run once in an amount of time for one or multiple calls
// The function is built to limit the number of function calls to improve the performance

// Example usage:

// A function to be throttled
function expensiveOperation() {
  console.log("Executing expensive operation...");
}

// Throttle the function with a delay of 500 milliseconds
const throttledOperation = throttle(expensiveOperation, 500);

// Trigger the throttled function
throttledOperation(); // This will execute the expensive operation

// Quickly trigger the throttled function multiple times
// The expensive operation will be executed at most once every 500 milliseconds
setTimeout(() => {
  throttledOperation();
  throttledOperation();
  throttledOperation();
}, 100);

/***************************************************************** */
function throttle(func, waitTime) {
  // Set isThrottling flag to false to start
  // and savedArgs to null
  let isThrottling = false,
    savedArgs = null;
  // Spread the arguments for .apply
  return function (...args) {
    // Return a wrapped function
    // Flag preventing immediate execution
    if (!isThrottling) {
      // Actual initial function execution
      func.apply(this, args);
      // Flip flag to throttling state
      isThrottling = true;
      // Queue up timer to flip the flag so future iterations can occur
      function queueTimer() {
        setTimeout(() => {
          // Stop throttling
          isThrottling = false;
          // Queueing up the next invocation after wait time passes
          if (savedArgs) {
            func.apply(this, savedArgs);
            isThrottling = true;
            savedArgs = null;
            queueTimer();
          }
        }, waitTime);
      }
      queueTimer();
    }
    // Wait state until timeout is done
    // Save arguments
    else savedArgs = args;
  };
}

let time = 0;

function testThrottle(input) {
  const calls = [];
  time = 0;

  function wrapper(arg) {
    calls.push(`${arg}@${time}`);
  }

  const throttledFunc = throttle(wrapper, 3);
  input.forEach((call) => {
    const [arg, time] = call.split("@");
    setTimeout(() => throttledFunc(arg), time);
  });
  return calls;
}

expect(testThrottle(["A@0", "B@2", "C@3"])).toEqual(["A@0", "C@3"]);

/************************************************* */
function throttle(fn, delay, context) {
  let timer;
  let lastArgs;

  return function (...args) {
    lastArgs = args;
    context = this ?? context;

    if (timer) return;

    timer = setTimeout(() => {
      fn.apply(context, lastArgs);
      clearTimeout(timer);
    }, delay);
  };
}

// /******************************************************* */
// Design an interface which limits the number of function calls by executing the function
// once for a given count of calls
// function forces a function run to for specific number of times in a given number of execution calls
// The function is built to limit the number of times a function is called
// Throttling function design can take function (to be throttled), delay and the optional context
function sampler(fn, count, context) {
  let counter = 0;

  return function (...args) {
    lastArgs = args;
    context = this ?? context;

    if (++counter !== count) return;

    fn.apply(context, args);
    counter = 0;
  };
}
