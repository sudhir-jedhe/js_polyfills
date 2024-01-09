/*************************User
Implement a function that accepts a callback and restricts its invocation to at most once************************ */
function once(callback) {
    let hasBeenCalled = false;
  
    return function (...args) {
      if (!hasBeenCalled) {
        hasBeenCalled = true;
        return callback(...args);
      } else {
        console.warn("Function already called!");
        // You can choose to do nothing, throw an error, or handle it in a different way.
      }
    };
  }
  
  // Example usage:
  
  const callbackFunction = (message) => {
    console.log(message);
  };
  
  const callbackOnce = once(callbackFunction);
  
  callbackOnce("This will be called once."); // Output: This will be called once.
  callbackOnce("This will not be called."); // Output: Function already called!