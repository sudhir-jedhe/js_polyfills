// Implement a  js function that creates a resumable interval object

function createResumableInterval(callback, delay) {
  // Private variables to store the callback function, delay, and interval ID.
  var _callback = callback;
  var _delay = delay;
  var _intervalId = null;

  // Public methods to start, pause, and resume the interval.
  function start() {
    if (_intervalId === null) {
      _intervalId = setInterval(_callback, _delay);
    }
  }

  function pause() {
    if (_intervalId !== null) {
      clearInterval(_intervalId);
      _intervalId = null;
    }
  }

  function resume() {
    if (_intervalId === null) {
      _intervalId = setInterval(_callback, _delay);
    }
  }

  // Return the public methods.
  return {
    start: start,
    pause: pause,
    resume: resume,
  };
}

// This function takes two arguments: a callback function to be executed at each
// interval, and the delay in milliseconds between intervals. It returns an
// object with three public methods: start(), pause(), and resume(). To use the
// createResumableInterval() function, you would first create a new instance of
// it, passing in the callback function and delay that you want to use. Then,
// you can call the start() method to start the interval, the pause() method to
// pause it, and the resume() method to resume it. For example, the following
// code would create a resumable interval that executes the doSomething()
// function every 1000 milliseconds:

var interval = createResumableInterval(doSomething, 1000);

// Start the interval.
interval.start();

// Pause the interval after 5 seconds.
setTimeout(function () {
  interval.pause();
}, 5000);

// Resume the interval after 10 seconds.
setTimeout(function () {
  interval.resume();
}, 10000);

// Resumable intervals can be useful in a variety of situations, such as when you need to periodically execute a task, but you also need to be able to pause and resume the task as needed.
