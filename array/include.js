
/*************************** Array For Includes method ***************************/

Array.prototype.customIncludes = function (searchElement, fromIndex = 0) {
    const length = this.length;
  
    // Handle negative indices
    let startIndex = fromIndex >= 0 ? fromIndex : Math.max(0, length + fromIndex);
  
    for (let i = startIndex; i < length; i++) {
      if (
        this[i] === searchElement ||
        (Number.isNaN(this[i]) && Number.isNaN(searchElement))
      ) {
        return true;
      }
    }
  
    return false;
  };
  
  // Example usage:
  const numbers = [1, 2, 3, 4, 5];
  
  console.log(numbers.customIncludes(3)); // Output: true
  console.log(numbers.customIncludes(6)); // Output: false