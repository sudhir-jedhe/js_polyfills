// The **slice()** method returns the selected elements in an array as a new array object.
// It selects the elements starting at the given start argument, and ends at the given optional end argument without including the last element. If you omit the second argument then it selects till the end of the array.

let arrayIntegers = [1, 2, 3, 4, 5];
let arrayIntegers1 = arrayIntegers.slice(0, 2); // returns [1,2]
let arrayIntegers2 = arrayIntegers.slice(2, 3); // returns [3]
let arrayIntegers3 = arrayIntegers.slice(4); //returns [5]

// **Note:** Slice method doesn't mutate the original array but it returns the subset as a new array.

const nums = [2, -3, 4, 6, -1, 9, -7];

const res = nums.slice(3);
console.log(res);

const res2 = nums.slice(2, 4);
console.log(res2);
