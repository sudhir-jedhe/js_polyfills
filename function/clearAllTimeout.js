// window.setTimeout() could be used to schedule some task in the future.

// Could you implement clearAllTimeout() to clear all the timers ? This might be
// useful when we want to clear things up before page transition.

setTimeout(func1, 10000);
setTimeout(func2, 10000);
setTimeout(func3, 10000);

// all 3 functions are scheduled 10 seconds later
clearAllTimeout();

// all scheduled tasks are cancelled.

/**
 * cancel all timer from window.setTimeout
 */
function clearAllTimeout() {
  // your code here
  let id = setTimeout(null, 0);
  while (id >= 0) {
    window.clearTimeout(id);
    id--;
  }
}

/********************** */

(() => {
  const originSetTimeout = setTimeout;
  const originClearTimeout = clearTimeout;
  const timers = new Set();

  window.clearAllTimeout = () => {
    for (const timerId of timers) {
      clearTimeout(timerId);
    }
  };

  window.setTimeout = (callback, time, ...args) => {
    const callbackWrapper = () => {
      callback(...args);
      timers.delete(timerId);
    };
    const timerId = originSetTimeout(callbackWrapper, time);
    timers.add(timerId);
    return timerId;
  };

  window.clearTimeout = (id) => {
    originClearTimeout(id);
    timers.delete(id);
  };
})();

/************************** */

const originalSetTimeout = window.setTimeout;
let timeoutIds = [];

window.setTimeout = (callback, delay) => {
  const timerId = originalSetTimeout(callback, delay);
  timeoutIds.push(timerId);
  return timerId;
};

const clearAllTimeout = () => {
  timeoutIds.forEach((id) => window.clearTimeout(id));
};
