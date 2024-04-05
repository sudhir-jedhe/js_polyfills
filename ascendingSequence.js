function ascendingSequence(start, end) {
  // Create an empty array to store the sequence.
  const sequence = [];

  // Iterate from the start number to the end number, adding each number to the sequence.
  for (let i = start; i <= end; i++) {
    sequence.push(i);
  }

  // Return the sequence.
  return sequence;
}

// Example usage:
const sequence = ascendingSequence(1, 10);
console.log(sequence); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const sequence = ascendingSequence(1, 10);
console.log(sequence); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
