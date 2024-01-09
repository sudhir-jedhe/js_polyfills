/*************************** Array For Shift method ***************************/
Array.prototype.customShift = function () {
    if (this.length === 0) {
      // Return undefined if the array is empty
      return undefined;
    }
    // Save the first element
    const shiftedElement = this[0];
    // Shift the remaining elements to the left
    for (let i = 0; i < this.length - 1; i++) {
      this[i] = this[i + 1];
    }
    // Remove the last element (now a duplicate) and update the length
    this.length--;
    return shiftedElement;
  };
  // Example usage:
  const fruits = ["apple", "banana", "orange"];
  const shiftedFruit = fruits.customShift();
  console.log(shiftedFruit); // Output: 'apple'
  console.log(fruits); // Output: ['banana', 'orange']
  


  const words = [];
  const el1 = words.shift();
console.log(el1);
console.log(words);