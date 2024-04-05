// What is an arguments object

// The arguments object is an Array-like object accessible inside functions that contains the values of the arguments passed to that function. For example, let's see how to use arguments object inside sum function,

function sum() {
  var total = 0;
  for (var i = 0, len = arguments.length; i < len; ++i) {
    total += arguments[i];
  }
  return total;
}

sum(1, 2, 3); // returns 6

// **Note:** You can't apply array methods on arguments object. But you can convert into a regular array as below.

var argsArray = Array.prototype.slice.call(arguments);
