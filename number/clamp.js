Implement a js function to clamp a number within the inclusive lower and upper bounds


function clamp(number, lowerBound, upperBound) {
    // Ensure a valid number
    if (isNaN(number)) {
      return number;
    }
  
    // Handle cases where lowerBound > upperBound
    if (lowerBound > upperBound) {
      [lowerBound, upperBound] = [upperBound, lowerBound];
    }
  
    // Clamp the value within the bounds
    return Math.min(Math.max(number, lowerBound), upperBound);
  }

  console.log(clamp(10, 5, 15)); // Output: 10 (within bounds)
console.log(clamp(20, 5, 15)); // Output: 15 (clamped to upper bound)
console.log(clamp(3, 10, 5));  // Output: 5 (clamped to lower bound)
console.log(clamp('hello', 1, 2)); // Output: 'hello' (returns input for invalid number)