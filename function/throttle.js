

/******************************Throtlling *****************/
function throttle(func, delay) {
    let lastExecTime = 0;
    let timeoutId;
  
    return function (...args) {
        const currentTime = new Date().getTime();
  
        if (currentTime - lastExecTime >= delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = currentTime;
            }, delay);
        }
    };
  }
  
  // Example usage:
  
  // A function to be throttled
  function expensiveOperation() {
    console.log('Executing expensive operation...');
  }
  
  // Throttle the function with a delay of 500 milliseconds
  const throttledOperation = throttle(expensiveOperation, 500);
  
  // Trigger the throttled function
  throttledOperation(); // This will execute the expensive operation
  
  // Quickly trigger the throttled function multiple times
  // The expensive operation will be executed at most once every 500 milliseconds
  setTimeout(() => {
    throttledOperation();
    throttledOperation();
    throttledOperation();
  }, 100);
  