function myInterval(func, delay) {
  const intervalId = setInterval(func, delay);
  return function cancel() {
    clearInterval(intervalId);
  };
}

const cancelInterval = myInterval(function () {
  console.log("Hello, world!");
}, 1000);

// Cancel the interval after 5 seconds.
setTimeout(cancelInterval, 5000);
