```js
Array.prototype.customPop = function () {
    // Get the current length of the array
    const currentLength = this.length;
  
    // Check if the array is empty
    if (currentLength === 0) {
      return undefined; // Return undefined for an empty array
    }
  
    // Get the last element
    const poppedElement = this[currentLength - 1];
  
    // Remove the last element by truncating the array
    this.length = currentLength - 1;
  
    // Return the popped element
    return poppedElement;
  };
  
  // Example usage:
  const numbers = [1, 2, 3];
  const poppedElement = numbers.customPop();
  
  console.log(poppedElement); // Output: 3
  console.log(numbers); // Output: [1, 2]

  
const words = [];
  const el2 = words.pop();
console.log(el2);
console.log(words);

```