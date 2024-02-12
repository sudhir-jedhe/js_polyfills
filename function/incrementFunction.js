// Implement a javascript function that accepts an integer value and returns a
// function that can be repeatedly called to return increasing values

function makeIncrementer(n) {
  // Create a closure to hold the value
  var counter = n;
  return function () {
    // Increment the counter and return it
    return counter++;
  };
}

// Example usage:
var incrementer = makeIncrementer(10);
console.log(incrementer()); // 10
console.log(incrementer()); // 11
console.log(incrementer()); // 12

// This function works by creating a closure to hold the value of the counter.
// The closure is returned by the makeIncrementer function, and it can be
// repeatedly called to return the next increasing value. In the example usage,
// we create an incrementer function that starts at 10. We then call the
// incrementer function three times, and each time it returns the next
// increasing value. Here is another example of a JavaScript function that
// accepts an integer value and returns a function that can be repeatedly called
// to return increasing valu

function makeIncrementer(n) {
  // Create a function that increments the counter and returns it
  function increment() {
    return n++;
  }
  // Return the increment function
  return increment;
}

// Example usage:
var incrementer = makeIncrementer(10);
console.log(incrementer()); // 10
console.log(incrementer()); // 11
console.log(incrementer()); // 12
