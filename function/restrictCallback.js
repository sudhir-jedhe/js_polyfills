/*******************************Implement a function that accepts a callback and restricts its invocation to at most N times *****************************************/
function restrictCallback(callback, maxInvocations) {
    let invocations = 0;
  
    return function (...args) {
        if (invocations < maxInvocations) {
            invocations++;
            return callback(...args);
        } else {
            console.warn('Callback has reached the maximum number of invocations.');
            // You can choose to do nothing, throw an error, or handle it in a different way.
        }
    };
  }
  
  // Example usage:
  
  const callbackFunction = () => {
    console.log('Callback invoked.');
  };
  
  const restrictedCallback = restrictCallback(callbackFunction, 3);
  
  restrictedCallback(); // Output: Callback invoked.
  restrictedCallback(); // Output: Callback invoked.
  restrictedCallback(); // Output: Callback invoked.
  restrictedCallback(); // Output: Callback has reached the maximum number of invocations.