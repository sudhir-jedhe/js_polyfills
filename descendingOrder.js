Implement a js function that returns a sequence of numbers in descending order

function descendingOrder(n) {
    // Check if the input is a positive integer
    if (n <= 0 || !Number.isInteger(n)) {
      return "Invalid input";
    }
  
    // Create an empty array to store the descending sequence
    const descendingSequence = [];
  
    // Iterate from n to 1, adding each number to the array
    for (let i = n; i >= 1; i--) {
      descendingSequence.push(i);
    }
  
    // Return the descending sequence
    return descendingSequence;
  }
  
  // Example usage:
  const sequence = descendingOrder(10);
  console.log(sequence); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]