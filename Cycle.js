Implement a function that takes one or more values and returns a function that cycles through those values each time it is called


function createCycler(...values) {
    let index = 0; 
  
    return function() {
      const value = values[index];
      index = (index + 1) % values.length; // Cycle back to the beginning
      return value;
    };
  }