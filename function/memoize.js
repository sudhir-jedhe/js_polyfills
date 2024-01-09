/*********************Memoize Function **************** */
function memoize(func) {
    const cache = {};
  
    return function (...args) {
        const key = JSON.stringify(args);
  
        if (!cache[key]) {
            cache[key] = func.apply(this, args);
        }
  
        return cache[key];
    };
  }
  
  // Example usage:
  
  // A simple function to calculate the square of a number
  const square = (x) => {
    console.log('Calculating square:', x);
    return x * x;
  };
  
  // Memoize the square function
  const memoizedSquare = memoize(square);
  
  console.log(memoizedSquare(5)); // Output: Calculating square: 5 | 25
  console.log(memoizedSquare(5)); // Output: 25 (result is retrieved from cache)
  console.log(memoizedSquare(3)); // Output: Calculating square: 3 | 9
  console.log(memoizedSquare(3)); // Output: 9 (result is retrieved from cache)