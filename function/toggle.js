// // Example
// var hello = toggle("hello");
// var onOff = toggle("on", "off");
// var speed = toggle("slow", "medium", "fast");

// hello(); // "hello"
// hello(); // "hello"

// onOff(); // "on"
// onOff(); // "off"
// onOff(); // "on"

// speed(); // "slow"
// speed(); // "medium"
// speed(); // "fast"
// speed(); // "slow"

// Design a function with toggle functionality for given list of inputs where toggle function accepts list of values to be toggled upon

// Toggle functionality can be obtained by returning the next value cyclically on each call to the function
// The toggle function will return another function which maintains the closure over the values with which it was initialized

function toggle(...values) {
  let state = -1;
  const length = values.length;
  return function () {
    state = (state + 1) % length;
    return values[state];
  };
}

const hello = toggle("1", "2", "3");
console.log(hello()); // "1"
console.log(hello()); // "2"
console.log(hello()); // "3"
console.log(hello()); // "1"
