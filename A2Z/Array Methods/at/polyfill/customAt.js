Array.prototype.customAt = function (index) {
    const length = this.length;

      // Handle negative indices
  const realIndex = index >= 0 ? index : length + index;

  // Check if the index is within the valid range
    if(realIndex >=0 && realIndex < length) {
        return this[realIndex]
    } else { return undefined}
}

const numbers = [1, 2, 3, 4, 5];

console.log(numbers.customAt(3))  // 4

console.log(numbers.customAt(2)); // Output: 3
console.log(numbers.customAt(-1)); // Output: undefined
console.log(numbers.customAt(10)); // Output: undefined