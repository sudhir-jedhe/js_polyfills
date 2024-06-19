// Implement a js debounce function that comes with a cancel method to cancel
// delayed invocations and a flush method to immediately invoke them

function debounce(fn, wait, options = {}) {
  let timeout;

  function debounced(...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  debounced.flush = () => {
    clearTimeout(timeout);
    fn();
  };

  return debounced;
}

const debouncedFn = debounce(() => {
  console.log("hello world");
}, 1000);

debouncedFn(); // Will log 'hello world' after 1000 milliseconds

debouncedFn(); // Will cancel the previous invocation and reschedule it for 1000 milliseconds from now

debouncedFn.cancel(); // Will cancel the delayed invocation

debouncedFn.flush(); // Will immediately invoke the function and reset the timer for future calls


/************************** */

cancelDebounce