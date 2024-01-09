/********************Debounce ********************* */
function debounce(func, delay) {
    let timeoutId;
  
    return function (...args) {
        clearTimeout(timeoutId);
  
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
  }
  
  // Example usage:
  
  // A function to be debounced
  function expensiveOperation() {
    console.log('Executing expensive operation...');
  }
  
  // Debounce the function with a delay of 500 milliseconds
  const debouncedOperation = debounce(expensiveOperation, 500);
  
  // Trigger the debounced function
  debouncedOperation(); // This will not immediately execute the expensive operation
  
  // Wait for 500 milliseconds...
  // The expensive operation will be executed only once within this timeframe