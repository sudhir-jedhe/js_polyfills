/*************************** Array For Reverse method ***************************/

Array.prototype.customReverse = function () {
    let left = 0;
    let right = this.length - 1;
  
    while (left < right) {
      [this[left], this[right]] = [this[right], this[left]];
      left++;
      right--;
    }
    return this;
  };
  const arr = [1, 2, 3, 4, 5, 9, 7, 9, 9, 10];
  console.log(arr.customReverse());