
/*************************** Array For FindLast method ***************************/

Array.prototype.customFindLast = function (callback, thisArg) {
    const length = this.length;
  
    for (let i = length - 1; i >= 0; i--) {
      if (callback.call(thisArg, this[i], i, this)) {
        return this[i];
      }
    }
  
    return undefined;
  };
  
  // Example usage:
  const numbers = [1, 2, 3, 4, 3, 5];
  
  const lastElement = numbers.customFindLast(function (element) {
    return element === 3;
  });
  
  console.log(lastElement); // Output: 3