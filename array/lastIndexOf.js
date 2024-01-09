/*************************** Array For lastIndexOf method ***************************/

Array.prototype.customLastIndexOf = function (value) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (this[i] == value) {
        return i;
      }
    }
    return -1;
  };
  



  /*************************** Array For lastIndexOf method ***************************/
Array.prototype.customLastIndexOf = function (searchElement, fromIndex = this.length - 1) {
  const length = this.length;

  // Handle negative indices
  let startIndex =
    fromIndex >= 0 ? Math.min(fromIndex, length - 1) : length + fromIndex;

  for (let i = startIndex; i >= 0; i--) {
    if (
      this[i] === searchElement ||
      (Number.isNaN(this[i]) && Number.isNaN(searchElement))
    ) {
      return i;
    }
  }

  return -1;
};

// Example usage:
const numbers = [1, 2, 3, 4, 3, 5];

console.log(numbers.customLastIndexOf(3)); // Output: 4
console.log(numbers.customLastIndexOf(6)); // Output: -1