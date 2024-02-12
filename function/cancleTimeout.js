function mySetTimeout(callback, delay) {
  const timerId = setTimeout(callback, delay);

  function cancel() {
    clearTimeout(timerId);
  }

  return cancel;
}
// This function takes two arguments: the callback function to be executed after
// the delay, and the delay in milliseconds. It returns a function that can be
// used to cancel the pending callback. To use the function, simply call it with
// the callback function and the delay. The function will return a function that
// can be used to cancel the pending callback. For example, the following code
// will execute the callback function after 1000 milliseconds, but the callback
// can be canceled at any time by calling the cancel function:

const cancel = mySetTimeout(() => {
  console.log("This will be executed after 1000 milliseconds.");
}, 1000);

// Cancel the callback after 500 milliseconds.
cancel();

// The cancel function can be called at any time before the callback function is
// executed. If the callback function has already been executed, the cancel
// function will have no effect.
