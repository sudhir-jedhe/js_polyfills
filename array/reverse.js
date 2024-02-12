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

/******************* */

let numbers_array = [1, 2, 3, 4, 5];

console.log("Original Array: ");
console.log(numbers_array);

numbers_array.reverse();

console.log("Reversed Array: ");
console.log(numbers_array);
/************************************ */

let original_array = [1, 2, 3, 4];

let reversed_array = [];

console.log("Original Array: ");
console.log(original_array);

for (let i = original_array.length - 1; i >= 0; i--) {
  reversed_array.push(original_array[i]);
}

console.log("Reversed Array: ");
console.log(reversed_array);
/*************************************************** */

let original_array = [1, 2, 3, 4, 5, 6];

let reversed_array = [];

console.log("Original Array: ");
console.log(original_array);

original_array.forEach((element) => {
  reversed_array.unshift(element);
});

console.log("Reversed Array: ");
console.log(reversed_array);

/******************************** */
let original_array = [1, 2, 3, 4];

let reversed_array = [];

console.log("Original Array: ");
console.log(original_array);

reversed_array = original_array.reduce((acc, item) => [item].concat(acc), []);

console.log("Reversed Array: ");
console.log(reversed_array);
/********************************************************* */
let array = [1, 2, 3, 4, 5];

console.log("Original Array: ");
console.log(array);

reverse_array = array.map((item, idx) => array[array.length - 1 - idx]);

console.log("Reversed Array: ");
console.log(reverse_array);

/********************************************************* */
function customReverse() {
  // DO NOT REMOVE
  "use strict";

  // Write your solution below
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.every called on null or undefined");
  }

  const list = Object(this);
  const length = list.length || 0;

  if (!length) {
    return this;
  }

  const mid = parseInt(length / 2);
  let temp;
  let i = 0;
  let j;

  while (i < mid) {
    j = length - i - 1;
    const lowerExists = Object.prototype.hasOwnProperty.call(list, i);
    const upperExists = Object.prototype.hasOwnProperty.call(list, j);

    if (lowerExists && upperExists) {
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    } else if (!lowerExists && upperExists) {
      this[i] = this[j];
      delete this[j];
    } else if (lowerExists && !upperExists) {
      this[j] = this[i];
      delete this[i];
    }

    i += 1;
  }

  return this;
}

Array.prototype.customReverse = customReverse;

/************************************************************** */

function customReverse() {
  // DO NOT REMOVE
  "use strict";

  // Write your solution below
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.every called on null or undefined");
  }

  const list = Object(this);
  const length = list.length || 0;

  if (!length) {
    return this;
  }

  const mid = parseInt(length / 2);
  let temp;
  let i = 0;
  let j;

  while (i < mid) {
    j = length - i - 1;
    const lowerExists = Object.prototype.hasOwnProperty.call(list, i);
    const upperExists = Object.prototype.hasOwnProperty.call(list, j);

    if (lowerExists && upperExists) {
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    } else if (!lowerExists && upperExists) {
      this[i] = this[j];
      delete this[j];
    } else if (lowerExists && !upperExists) {
      this[j] = this[i];
      delete this[i];
    }

    i += 1;
  }

  return this;
}

Array.prototype.customReverse = customReverse;

/******************************************************** */

function customReverse() {
  // DO NOT REMOVE
  "use strict";

  function swap(a, b) {
    let temp = a;
    a = b;
    b = temp;
  }

  // write your code below
  let i = 0;
  let j = this.length;

  while (i < j) {
    swap(this[i], this[j]);
    i++;
    j--;
  }
  return this;
}

Array.prototype.customReverse = customReverse;

/********************************************** */
