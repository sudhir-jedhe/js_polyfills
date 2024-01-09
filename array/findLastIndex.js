/*************************** Array For FindLastIndex method ***************************/

Array.prototype.customFindLastIndex = function (callback, thisArg) {
    const length = this.length;
  
    for (let i = length - 1; i >= 0; i--) {
      if (callback.call(thisArg, this[i], i, this)) {
        return i;
      }
    }
  
    return -1;
  };
  
  // Example usage:
  const numbers = [1, 2, 3, 4, 3, 5];
  
  const lastIndex = numbers.customFindLastIndex(function (element) {
    return element === 3;
  });
  
  console.log(lastIndex); // Output: 4