const numbers = [1, 2, 3, 7, 8, 10, 11, 17, 19, 22];

const evenCount = numbers.reduce((count, currentNumber) => {
  // Check if the current number is even
  if (currentNumber % 2 === 0) {
    // Increment the count if it's even
    return count + 1;
  }
  // Otherwise, just return the current count
  return count;
}, 0);

console.log(evenCount);
