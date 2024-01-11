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
